const pool = require("../repositories/db");



async function syncInstagramPosts() {

  const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
  const INSTAGRAM_URL = `https://graph.instagram.com/v23.0/me/media?fields=id,caption,media_type,media_url,permalink,timestamp,username&access_token=${ACCESS_TOKEN}`;

  console.log("🔄 Buscando posts no Instagram...");

  const response = await fetch(INSTAGRAM_URL);
  const data = await response.json();

  if (!response.ok) {
    console.error("❌ Erro na API:", data);
    throw new Error(data.error?.message || "Erro na API do Instagram");
  }

  const posts = data.data || [];
  let novos = 0;

  for (const post of posts) {
    const { id, caption, media_type, media_url, permalink, timestamp, username } = post;
    const result = await pool.query(
      `INSERT INTO tb_instagram_posts 
      (id_instagram_posts, caption, media_type, media_url, permalink, timestamp, username)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (id_instagram_posts) DO NOTHING
      RETURNING id_instagram_posts;`,
      [id, caption, media_type, media_url, permalink, timestamp, username]
    );

    if (result.rowCount > 0) {
      novos++; // só incrementa se realmente inseriu
    }
  }
  console.log(`✅ ${novos} novos posts salvos`);
  return novos;
}

async function fetchInstagramPostsDetails() {
  // 1️⃣ Buscar IDs do banco
  const result = await pool.query("SELECT id_instagram_posts FROM tb_instagram_posts");
  const postIds = result.rows.map(row => row.id_instagram_posts);

  const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

  console.log("🔄 Buscando detalhes dos posts no Instagram...");

  for (const id of postIds) {
    const url = `https://graph.instagram.com/v23.0/${id}?fields=id,media_type,media_url,owner,timestamp,like_count,comments_count&access_token=${ACCESS_TOKEN}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error(`❌ Erro ao buscar post ${id}:`, data);
      continue;
    }

    // 2️⃣ Atualizar no banco
    const { like_count, comments_count } = data;

    await pool.query(
      `UPDATE tb_instagram_posts
       SET like_count = $1,
           comments_count = $2
       WHERE id_instagram_posts = $3`,
      [like_count, comments_count, id]
    );

    console.log(`✅ Post ${id} atualizado: likes=${like_count}, comments=${comments_count}`);
  }

  console.log("✅ Todos os posts atualizados");
}

async function fetchInstagramPostsViews() {
  const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

  // 1️⃣ Buscar IDs dos posts no banco
  const result = await pool.query("SELECT id_instagram_posts FROM tb_instagram_posts");
  const postIds = result.rows.map(row => row.id_instagram_posts);

  console.log("🔄 Buscando visualizações (views) dos posts no Instagram...");

  let atualizados = 0;

  for (const id of postIds) {
    // A métrica "views" só vem pelo endpoint de Insights (não é um campo do post).
    const url = `https://graph.instagram.com/v23.0/${id}/insights?metric=views&access_token=${ACCESS_TOKEN}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      // Mídias antigas ou de certos tipos podem não ter "views" -> apenas loga e segue.
      console.error(`❌ Erro ao buscar views do post ${id}:`, data.error?.message || data);
      continue;
    }

    const views =
      data.data?.find(m => m.name === "views")?.values?.[0]?.value ?? 0;

    await pool.query(
      `UPDATE tb_instagram_posts
         SET views = $1
       WHERE id_instagram_posts = $2`,
      [views, id]
    );

    atualizados++;
    console.log(`✅ Post ${id}: views=${views}`);
  }

  console.log(`✅ Views atualizadas em ${atualizados} posts`);
  return atualizados;
}

async function syncInstagramPostsCollaborators() {
  const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

  // 1️⃣ Buscar posts (id + dono) no banco
  const result = await pool.query(
    "SELECT id_instagram_posts, username FROM tb_instagram_posts"
  );

  console.log("🔄 Buscando colaboradores (collab) dos posts no Instagram...");

  let vinculos = 0;

  for (const row of result.rows) {
    const mediaId = row.id_instagram_posts;
    const ownerLogin = row.username;

    // 2️⃣ Registra o DONO do post como participante do post (papel OWNER)
    if (ownerLogin) {
      await pool.query(
        `INSERT INTO tb_post_participantes (media_id, user_login, papel)
         VALUES ($1, $2, 'OWNER')
         ON CONFLICT (media_id, user_login) DO NOTHING`,
        [mediaId, ownerLogin]
      );
    }

    // 3️⃣ Buscar os colaboradores do post.
    //    Obs.: se este endpoint retornar erro de permissão no seu app,
    //    troque para graph.facebook.com + GRAPH_ACCESS_TOKEN.
    const url = `https://graph.instagram.com/v23.0/${mediaId}/collaborators?access_token=${ACCESS_TOKEN}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error(`❌ Erro ao buscar collaborators do post ${mediaId}:`, data.error?.message || data);
      continue;
    }

    const collaborators = data.data || [];

    for (const c of collaborators) {
      // Só conta quem ACEITOU o convite de collab.
      const status = (c.invite_status || "").toUpperCase();
      if (status !== "ACCEPTED") continue;

      const collabId = c.id || null;
      const collabLogin = c.username || null;
      if (!collabLogin) continue;

      // 4️⃣ Garante o colaborador em tb_usuarios como PARTICIPANTE
      if (collabId) {
        await pool.query(
          `INSERT INTO tb_usuarios (id_user, user_login, tipo_usuario)
           VALUES ($1, $2, 'PARTICIPANTE')
           ON CONFLICT (id_user) DO UPDATE SET
             user_login = EXCLUDED.user_login,
             tipo_usuario = 'PARTICIPANTE'`,
          [collabId, collabLogin]
        );
      }

      // 5️⃣ Vincula o colaborador ao post -> recebe as views CHEIAS do post
      await pool.query(
        `INSERT INTO tb_post_participantes (media_id, user_login, id_user, papel)
         VALUES ($1, $2, $3, 'COLLAB')
         ON CONFLICT (media_id, user_login) DO UPDATE SET
           id_user = EXCLUDED.id_user,
           papel = 'COLLAB'`,
        [mediaId, collabLogin, collabId]
      );

      vinculos++;
    }

    console.log(`✅ Post ${mediaId}: ${collaborators.length} colaborador(es) processado(s)`);
  }

  console.log(`✅ Colaboradores vinculados: ${vinculos}`);
  return vinculos;
}

async function fetchInstagramPostsComments() {
  const GRAPH_ACCESS_TOKEN = process.env.GRAPH_ACCESS_TOKEN;

  // 1️⃣ Buscar IDs dos posts no banco
  const result = await pool.query("SELECT id_instagram_posts FROM tb_instagram_posts");
  const postIds = result.rows.map(row => row.id_instagram_posts);

  console.log("🔄 Buscando comentários dos posts no Instagram...");

  for (const mediaId of postIds) {
    const commentsUrl =
      `https://graph.facebook.com/v23.0/${mediaId}/comments?fields=user,from,text,like_count,replies&access_token=${GRAPH_ACCESS_TOKEN}`;
    
    const response = await fetch(commentsUrl);
    const data = await response.json();

    if (!response.ok) {
      console.error(`❌ Erro ao buscar comentários do post ${mediaId}:`, data);
      continue;
    }

    const comments = data.data || [];

    for (const comment of comments) {

      const commentId   = comment.id;
      const userLogin   = comment.from?.username || null;
      const userId      = comment.from?.id || comment.user?.id || null;
      const commentText = comment.text || null;
      const likeCount   = comment.like_count ?? 0;

      // replies_count = número de itens no array replies.data
      const repliesCount = Array.isArray(comment.replies?.data)
        ? comment.replies.data.length
        : 0;

      // 1️⃣ Inserir comentário
      await pool.query(
        `INSERT INTO tb_instagram_posts_comments
        (id_instagram_comments, media_id, user_login, user_id, comment_text, like_count, replies_count)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (id_instagram_comments)
      DO UPDATE SET
      user_login = EXCLUDED.user_login,
      user_id = EXCLUDED.user_id,
      comment_text = EXCLUDED.comment_text,
      like_count = EXCLUDED.like_count,
      replies_count = EXCLUDED.replies_count,
      media_id = EXCLUDED.media_id`,
        [commentId, mediaId, userLogin, userId, commentText, likeCount, repliesCount]
      );

      // 2️⃣ Inserir usuário
      if (userId) {
        await pool.query(
          `INSERT INTO tb_usuarios (id_user, user_login)
           VALUES ($1, $2)
           ON CONFLICT (id_user) DO NOTHING`,
          [userId, userLogin]
        );
      }
    }

    console.log(`✅ Comentários do post ${mediaId} processados: ${comments.length}`);
  }

  console.log("✅ Todos os comentários foram processados");
}




module.exports = {
  syncInstagramPosts,
  fetchInstagramPostsDetails,
  fetchInstagramPostsComments,
  fetchInstagramPostsViews,
  syncInstagramPostsCollaborators
};
