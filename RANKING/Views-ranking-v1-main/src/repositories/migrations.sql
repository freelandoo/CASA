-- ============================================================
-- Schema do ranking Casa Views — Instagram.
-- Idempotente: pode rodar várias vezes sem erro (IF NOT EXISTS).
--
-- As tabelas-base (posts, usuários, comentários) precisam existir
-- ANTES do ALTER/CREATE incrementais abaixo. O repositório original
-- assumia que elas já existiam no banco do persio; num banco zerado
-- (2º Postgres da Freelandoo) elas são criadas aqui.
-- Colunas derivadas do uso real em InstagramService.js / UserService.js.
-- ============================================================

-- 0a) Posts do Instagram (id_instagram_posts = media id do Instagram)
CREATE TABLE IF NOT EXISTS tb_instagram_posts (
  id_instagram_posts TEXT PRIMARY KEY,
  caption            TEXT,
  media_type         TEXT,
  media_url          TEXT,
  permalink          TEXT,
  timestamp          TEXT,
  username           TEXT,
  like_count         BIGINT DEFAULT 0,
  comments_count     BIGINT DEFAULT 0,
  views              BIGINT DEFAULT 0
);

-- 0b) Usuários (comentaristas = ESPECTADOR por padrão; collabs/donos = PARTICIPANTE)
CREATE TABLE IF NOT EXISTS tb_usuarios (
  id_user         TEXT PRIMARY KEY,
  user_login      TEXT,
  tipo_usuario    TEXT NOT NULL DEFAULT 'ESPECTADOR',
  profile_pic_url TEXT
);

-- 0c) Comentários dos posts
CREATE TABLE IF NOT EXISTS tb_instagram_posts_comments (
  id_instagram_comments TEXT PRIMARY KEY,
  media_id              TEXT,
  user_login            TEXT,
  user_id               TEXT,
  comment_text          TEXT,
  like_count            BIGINT DEFAULT 0,
  replies_count         BIGINT DEFAULT 0
);

-- ============================================================
-- Migração: suporte a VIEWS e a posts em COLLAB (até 5 contas)
-- Idempotente: pode rodar várias vezes sem erro.
-- ============================================================

-- 1) Coluna de visualizações nos posts
ALTER TABLE tb_instagram_posts
  ADD COLUMN IF NOT EXISTS views BIGINT DEFAULT 0;

-- 2) Tabela de ligação post <-> participante
--    Guarda o dono (OWNER) e cada colaborador (COLLAB) de um mesmo post.
--    A PK (media_id, user_login) garante que um usuário só aparece
--    UMA vez por post, então a soma de views nunca duplica indevidamente.
CREATE TABLE IF NOT EXISTS tb_post_participantes (
  media_id    TEXT NOT NULL,
  user_login  TEXT NOT NULL,
  id_user     TEXT,
  papel       TEXT NOT NULL DEFAULT 'COLLAB',  -- 'OWNER' ou 'COLLAB'
  PRIMARY KEY (media_id, user_login)
);

CREATE INDEX IF NOT EXISTS idx_post_participantes_login
  ON tb_post_participantes (user_login);

CREATE INDEX IF NOT EXISTS idx_post_participantes_media
  ON tb_post_participantes (media_id);
