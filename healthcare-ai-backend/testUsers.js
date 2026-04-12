require('dotenv').config();
const mongoose = require('mongoose');
const Prescription = require('./models/prescription');
const User = require('./models/user');

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  const users = await User.find({});
  console.log("Users:", users.map(u => ({ email: u.email, id: u._id.toString() })));
  
  const prescs = await Prescription.find({});
  console.log("Presc userIds:", prescs.map(p => p.userId.toString()));
  process.exit(0);
}
test();
