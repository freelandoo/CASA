# Instagram Sync Service

Um serviço em Node.js para sincronizar posts e comentários do Instagram com um banco de dados PostgreSQL. Permite armazenar posts, likes, comentários e atualizar automaticamente os contadores de likes e comentários.

---

## 🚀 Funcionalidades

- Sincroniza posts do Instagram para o banco de dados.
- Atualiza os contadores de likes e comentários.
- Sincroniza comentários de cada post, armazenando ID do comentário, usuário e texto.
- Evita duplicidade usando `ON CONFLICT DO NOTHING`.

---

## 🛠 Tecnologias

- Node.js (v22+)
- PostgreSQL
- Fetch API nativa do Node.js
- [dotenv](https://www.npmjs.com/package/dotenv) para variáveis de ambiente

---

## 📦 Estrutura do projeto

project-root/
├─ repositories/
│ └─ db.js # Conexão com PostgreSQL
├─ services/
│ ├─ syncInstagramPosts.js # Sincroniza posts
│ ├─ fetchInstagramComments.js # Sincroniza comentários
├─ .env # Variáveis de ambiente
└─ package.json

yaml
Copiar código

---

## ⚡ Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

ACCESS_TOKEN=<Seu Token de Acesso do Instagram Graph API>
DATABASE_URL=postgres://usuario:senha@localhost:5432/nomedobanco

yaml
Copiar código

---

## 💻 Como rodar

1. Instale as dependências:

```bash
npm install
Execute o script de sincronização de posts:

bash
Copiar código
node services/syncInstagramPosts.js
Execute o script de sincronização de comentários:

bash
Copiar código
node services/fetchInstagramComments.js
Os scripts podem ser combinados em um único cron job ou função principal.
