const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Virtuals for relationships
userSchema.virtual('prescriptions', {
  ref: 'Prescription',
  localField: '_id',
  foreignField: 'userId',
  justOne: false
});

userSchema.virtual('chat', {
  ref: 'Chat',
  localField: '_id',
  foreignField: 'userId',
  justOne: true
});

userSchema.virtual('embeddings', {
  ref: 'Embedding',
  localField: '_id',
  foreignField: 'userId',
  justOne: false
});

userSchema.virtual('dietPlans', {
  ref: 'Diet',
  localField: '_id',
  foreignField: 'userId',
  justOne: false
});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model("User", userSchema);