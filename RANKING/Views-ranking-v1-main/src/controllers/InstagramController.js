const { syncInstagramPosts, fetchInstagramPostsDetails, fetchInstagramPostsComments, fetchInstagramPostsViews, syncInstagramPostsCollaborators} = require("../services/InstagramService");

module.exports = {
  async fetchAndSave(req, res) {
    try {
      const novos = await syncInstagramPosts();
      res.json({ message: `${novos} novos posts salvos` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async fetchInstagramPostsDetails(req, res) {
    try {
      const detalhes = await fetchInstagramPostsDetails();
      res.json({ message: `Detalhes dos posts atualizados` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async fetchInstagramPostsComments(req, res) {
    try {
      const comentarios = await fetchInstagramPostsComments();
      res.json({ message: `Comentários dos posts atualizados` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async fetchInstagramPostsViews(req, res) {
    try {
      const atualizados = await fetchInstagramPostsViews();
      res.json({ message: `Views atualizadas em ${atualizados} posts` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async syncInstagramPostsCollaborators(req, res) {
    try {
      const vinculos = await syncInstagramPostsCollaborators();
      res.json({ message: `${vinculos} colaborador(es) vinculado(s) aos posts` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
