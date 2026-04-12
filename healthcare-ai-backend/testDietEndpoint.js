require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const User = require('./models/user');

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Get a user token (we'll need to login first)
    console.log('Testing Diet Plan API endpoint...');
    console.log('POST /api/diet/generate');
    
    // Try calling the endpoint with curl instead
    console.log('\nTo test, use:');
    console.log('curl -X POST http://localhost:5001/api/diet/generate \\');
    console.log('  -H "Authorization: Bearer YOUR_TOKEN" \\');
    console.log('  -H "Content-Type: application/json" \\');
    console.log('  -d "{ \\"goal\\": \\"Recovery from fever\\" }"');
    
    process.exit(0);
  } catch(e) { console.error(e); process.exit(1); }
}
test();
