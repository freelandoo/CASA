const cron = require("node-cron");
const {
  syncInstagramPosts,
  fetchInstagramPostsDetails,
  fetchInstagramPostsComments,
  fetchInstagramPostsViews,
  syncInstagramPostsCollaborators
} = require("../services/InstagramService");

// Pipeline completo, rodando em ordem a cada 30 minutos:
// 1) novos posts -> 2) likes/comentários -> 3) comentários (espectadores)
// 4) colaboradores (quem está no collab) -> 5) views (pontuação participante)
async function runPipeline() {
  console.log("🕒 Executando pipeline automático do Instagram...");
  try {
    await syncInstagramPosts();
    await fetchInstagramPostsDetails();
    await fetchInstagramPostsComments();
    await syncInstagramPostsCollaborators();
    await fetchInstagramPostsViews();
    console.log("✅ Pipeline concluído");
  } catch (err) {
    console.error("⚠️ Erro no pipeline:", err);
  }
}

cron.schedule("*/30 * * * *", runPipeline);

module.exports = { runPipeline };
