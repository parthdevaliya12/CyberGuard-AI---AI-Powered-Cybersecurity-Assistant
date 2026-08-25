const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const KnowledgeArticle = require('../models/KnowledgeArticle');
const knowledgeArticles = require('./knowledgeData');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Seed admin user
    const existingAdmin = await User.findOne({ email: 'admin@cyberguard.com' });
    if (!existingAdmin) {
      await User.create({
        name: 'Admin',
        email: 'admin@cyberguard.com',
        password: 'Admin@123',
        role: 'admin',
      });
      console.log('✅ Admin user created (admin@cyberguard.com / Admin@123)');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Seed knowledge articles
    const existingArticles = await KnowledgeArticle.countDocuments();
    if (existingArticles === 0) {
      await KnowledgeArticle.insertMany(knowledgeArticles);
      console.log(`✅ ${knowledgeArticles.length} knowledge articles seeded`);
    } else {
      console.log(`ℹ️  Knowledge articles already exist (${existingArticles} found)`);
    }

    console.log('✅ Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
