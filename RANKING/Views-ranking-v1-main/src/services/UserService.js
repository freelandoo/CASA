const pool = require("../repositories/db");

async function fetchTopUsers() {
  try {
    const query = `
      WITH
      -- ESPECTADOR: comentários + likes nos comentários + respostas
      espectador AS (
        SELECT
          u.id_user,
          u.user_login,
          u.profile_pic_url,
          u.tipo_usuario,
          COALESCE(COUNT(c.id_instagram_comments), 0)
          + COALESCE(SUM(c.like_count), 0)
          + COALESCE(SUM(c.replies_count), 0) AS pontuacao
        FROM tb_usuarios u
        LEFT JOIN tb_instagram_posts_comments c
          ON c.user_id = u.id_user
        WHERE u.tipo_usuario = 'ESPECTADOR'
        GROUP BY u.id_user, u.user_login, u.profile_pic_url, u.tipo_usuario
      ),

      -- PARTICIPANTE: soma das VIEWS de todo post em que ele participa
      -- (dono OU collab). Cada participante recebe as views CHEIAS do post,
      -- sem dividir nem multiplicar. A PK de tb_post_participantes garante
      -- que cada post é contado uma única vez por usuário.
      participante AS (
        SELECT
          u.id_user,
          u.user_login,
          u.profile_pic_url,
          u.tipo_usuario,
          COALESCE(SUM(p.views), 0) AS pontuacao
        FROM tb_usuarios u
        LEFT JOIN tb_post_participantes pp
          ON pp.user_login = u.user_login
        LEFT JOIN tb_instagram_posts p
          ON p.id_instagram_posts = pp.media_id
        WHERE u.tipo_usuario = 'PARTICIPANTE'
        GROUP BY u.id_user, u.user_login, u.profile_pic_url, u.tipo_usuario
      ),

      todos AS (
        SELECT * FROM espectador
        UNION ALL
        SELECT * FROM participante
      ),

      ranking AS (
        SELECT
          *,
          ROW_NUMBER() OVER (
            PARTITION BY tipo_usuario
            ORDER BY pontuacao DESC
          ) AS posicao
        FROM todos
      )

      SELECT *
      FROM ranking
      WHERE posicao <= 10
      ORDER BY tipo_usuario, pontuacao DESC;
    `;

    const { rows } = await pool.query(query);
    return rows;

  } catch (err) {
    console.error("Erro ao buscar top users:", err);
    throw err;
  }
}


module.exports = { fetchTopUsers };