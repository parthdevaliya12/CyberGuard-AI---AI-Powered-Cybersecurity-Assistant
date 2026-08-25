const KnowledgeArticle = require('../models/KnowledgeArticle');

/**
 * Search the knowledge base for relevant cybersecurity articles.
 * @param {Object} params - { query, category }
 * @returns {Object} - Search results
 */
const searchKnowledge = async ({ query, category }) => {
  try {
    const searchQuery = {};

    if (category) {
      searchQuery.category = category;
    }

    if (query) {
      searchQuery.$or = [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } },
      ];
    }

    const articles = await KnowledgeArticle.find(searchQuery)
      .select('title category content prevention recommendedActions tags')
      .limit(3);

    if (articles.length === 0) {
      return {
        found: false,
        message: `No articles found for "${query}". The knowledge base may not cover this topic yet.`,
      };
    }

    return {
      found: true,
      count: articles.length,
      articles: articles.map((a) => ({
        title: a.title,
        category: a.category,
        content: a.content,
        prevention: a.prevention,
        recommendedActions: a.recommendedActions,
      })),
    };
  } catch (error) {
    return { found: false, error: 'Failed to search knowledge base' };
  }
};

module.exports = searchKnowledge;
