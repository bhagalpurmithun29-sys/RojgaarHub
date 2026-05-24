const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const mongoURI = 'mongodb+srv://mithunkumarsingh1827143_db_user:58PZ0tUuYIKVLQ1d@cluster0.jbx5jfk.mongodb.net/rozgaarhub?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI).then(async () => {
  const db = mongoose.connection.db;
  const user = await db.collection('users').findOne({ email: 'mithun@gmail.com' });
  console.log("User found:", !!user);
  if (user) {
    const isMatch = await bcrypt.compare('Mithun@123', user.passwordHash);
    console.log("Password matches:", isMatch);
  }
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
