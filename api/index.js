const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
const port = 5000;

mongoose
  .connect('mongodb://localhost:27017/passwordsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error);
  });

//db schema
const PasswordSchema = new mongoose.Schema({
  original: String,
  salt: String,
  encrypted: String,
});
const Password = mongoose.model('Password', PasswordSchema);

app.use(express.json());

app.post('/encrypt', async (req, res) => {
  const password = req.body.password;

  if (!password) {
    return res.status(400).send({ error: 'Password is required' });
  }

  //encryption
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');

  const passwordEntry = new Password({
    original: password,
    salt: salt,
    encrypted: hash,
  });

  try {
    await passwordEntry.save();
    res.send({ salt: salt, encryptedPassword: hash });
  } catch (error) {
    res.status(500).send({ error: 'Error saving to MongoDB' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;
