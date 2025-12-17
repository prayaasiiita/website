// Script to seed initial team data from hardcoded values
// Run with: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seed-team.ts
// Or add to package.json: "seed:team": "npx ts-node scripts/seed-team.ts"

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env.local');
  process.exit(1);
}

// Define schema inline for the script
const TeamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  rollNo: { type: String, trim: true },
  image: { type: String, default: '' },
  email: { type: String, required: true, trim: true, lowercase: true },
  linkedin: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true },
}, { _id: true });

const TeamGroupSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  description: { type: String, trim: true },
  order: { type: Number, default: 0 },
  type: { type: String, enum: ['leadership', 'faculty', 'student'], default: 'student' },
  members: [TeamMemberSchema],
  isVisible: { type: Boolean, default: true },
}, { timestamps: true });

const TeamGroup = mongoose.models.TeamGroup || mongoose.model('TeamGroup', TeamGroupSchema);

// Initial team data
const teamData = [
  {
    name: 'Director',
    slug: 'director',
    type: 'leadership',
    order: 0,
    members: [
      {
        name: 'Prof. Mukesh Kumar',
        role: 'Director, IIIT Allahabad',
        email: 'director@iiita.ac.in',
        linkedin: 'https://www.linkedin.com/',
        order: 0,
      },
    ],
  },
  {
    name: 'Faculty Coordinator',
    slug: 'faculty-coordinator',
    type: 'faculty',
    order: 1,
    members: [
      {
        name: 'Dr. Prateek Kumar',
        role: 'Faculty Coordinator',
        email: 'prateek@iiita.ac.in',
        linkedin: 'https://www.linkedin.com/',
        order: 0,
      },
    ],
  },
  {
    name: 'Coordinators',
    slug: 'coordinators',
    type: 'student',
    order: 2,
    members: [
      {
        name: 'Kavya Mitruka',
        role: 'Coordinator',
        rollNo: 'IIT2023199',
        email: 'iit2023199@iiita.ac.in',
        linkedin: 'https://www.linkedin.com/',
        order: 0,
      },
      {
        name: 'Faizan Ali',
        role: 'Coordinator',
        rollNo: 'IIT2023192',
        email: 'iit2023192@iiita.ac.in',
        linkedin: 'https://www.linkedin.com/',
        order: 1,
      },
      {
        name: 'Raman Gautam',
        role: 'Coordinator',
        rollNo: 'IIT2023252',
        email: 'iit2023252@iiita.ac.in',
        linkedin: 'https://www.linkedin.com/',
        order: 2,
      },
    ],
  },
  {
    name: 'Treasurers',
    slug: 'treasurers',
    type: 'student',
    order: 3,
    members: [
      {
        name: 'Isha',
        role: 'Treasurer',
        rollNo: 'IIT2023202',
        email: 'iit2023202@iiita.ac.in',
        linkedin: 'https://www.linkedin.com/',
        order: 0,
      },
      {
        name: 'Shranay Malhotra',
        role: 'Treasurer',
        rollNo: 'IIT2023093',
        email: 'iit2023093@iiita.ac.in',
        linkedin: 'https://www.linkedin.com/',
        order: 1,
      },
    ],
  },
  {
    name: 'Speaker',
    slug: 'speaker',
    type: 'student',
    order: 4,
    members: [
      {
        name: 'Gaurav Kesherwani',
        role: 'Speaker',
        rollNo: 'IEC2023011',
        email: 'iec2023011@iiita.ac.in',
        linkedin: 'https://www.linkedin.com/',
        order: 0,
      },
    ],
  },
  {
    name: 'Teaching Heads',
    slug: 'teaching-heads',
    type: 'student',
    order: 5,
    members: [
      {
        name: 'Satyam Naman',
        role: 'Teaching Head',
        rollNo: 'IIT2023250',
        email: 'iit2023250@iiita.ac.in',
        linkedin: 'https://www.linkedin.com/',
        order: 0,
      },
      {
        name: 'Suman Kumari',
        role: 'Teaching Head',
        rollNo: 'IIT2023187',
        email: 'iit2023187@iiita.ac.in',
        linkedin: 'https://www.linkedin.com/',
        order: 1,
      },
    ],
  },
  {
    name: 'Media Team',
    slug: 'media-team',
    type: 'student',
    order: 6,
    members: [
      {
        name: 'Aashutosh Sahu',
        role: 'Media Team',
        rollNo: 'IEC2023011',
        email: 'iec2023011@iiita.ac.in',
        linkedin: 'https://www.linkedin.com/',
        order: 0,
      },
      {
        name: 'Mohit Rathwa',
        role: 'Media Team',
        rollNo: 'IEC2023098',
        email: 'iec2023098@iiita.ac.in',
        linkedin: 'https://www.linkedin.com/',
        order: 1,
      },
      {
        name: 'Sahil Kumar',
        role: 'Media Team',
        rollNo: 'IEC2023056',
        email: 'iec2023056@iiita.ac.in',
        linkedin: 'https://www.linkedin.com/',
        order: 2,
      },
    ],
  },
];

async function seedTeam() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Check if data already exists
    const existingGroups = await TeamGroup.countDocuments();
    if (existingGroups > 0) {
      console.log(`Found ${existingGroups} existing team groups.`);
      const readline = await import('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const answer = await new Promise<string>((resolve) => {
        rl.question('Do you want to delete existing data and reseed? (yes/no): ', resolve);
      });
      rl.close();

      if (answer.toLowerCase() !== 'yes') {
        console.log('Aborting seed operation.');
        await mongoose.disconnect();
        process.exit(0);
      }

      console.log('Deleting existing team data...');
      await TeamGroup.deleteMany({});
    }

    console.log('Seeding team data...');
    for (const group of teamData) {
      const newGroup = new TeamGroup(group);
      await newGroup.save();
      console.log(`Created group: ${group.name} with ${group.members.length} members`);
    }

    console.log('\n✅ Team data seeded successfully!');
    console.log(`Total groups created: ${teamData.length}`);
    console.log(`Total members created: ${teamData.reduce((sum, g) => sum + g.members.length, 0)}`);

  } catch (error) {
    console.error('Error seeding team data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedTeam();
