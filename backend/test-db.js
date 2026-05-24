const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://mithunkumarsingh1827143_db_user:58PZ0tUuYIKVLQ1d@cluster0.jbx5jfk.mongodb.net/rozgaarhub?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI).then(async () => {
  const db = mongoose.connection.db;
  const users = await db.collection('users').find({ email: { $regex: /mithun/i } }).toArray();
  console.log("Users:", users);
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
