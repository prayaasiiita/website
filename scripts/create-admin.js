require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createAdmin() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('Error: MONGODB_URI not found in .env.local');
      console.log('Please create .env.local file with MONGODB_URI');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully!\n');

    const AdminSchema = new mongoose.Schema({
      username: String,
      password: String,
      email: String,
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });

    const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

    console.log('=== Create Admin User ===\n');
    
    const username = await question('Enter username: ');
    const email = await question('Enter email: ');
    const password = await question('Enter password: ');

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      console.log('\nError: Admin with this username already exists!');
      process.exit(1);
    }

    console.log('\nCreating admin user...');
    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      username,
      password: hashedPassword,
      email
    });

    console.log('\n✅ Admin created successfully!');
    console.log('\nLogin Credentials:');
    console.log(`Username: ${username}`);
    console.log(`Email: ${email}`);
    console.log('\nYou can now login at: http://localhost:3000/admin');
    
  } catch (error) {
    console.error('Error creating admin:', error.message);
  } finally {
    await mongoose.disconnect();
    rl.close();
    process.exit(0);
  }
}

createAdmin();
