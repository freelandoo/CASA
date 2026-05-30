//dependências
const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const { runMigrations } = require('./repositories/migrate');

//instanciando o express
const app = express();

//habilitando o cors
app.use(cors());

//definindo a porta
const port = process.env.PORT || 3000;

//iniciando as rotas
routes(app);

// Aplica as migrations (views + tabela de collab) e só então sobe o servidor/job
runMigrations()
  .then(() => {
    // Importa e inicia o job (cron do pipeline completo)
    require('./jobs/instagramJob');

    app.listen(port, () => {
      console.log(`🚀 Servidor rodando na porta ${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ Falha ao aplicar migrations. Servidor não iniciado.', err);
    process.exit(1);
  });
