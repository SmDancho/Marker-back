const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./auth/authRouter');
const postRouter = require('./addpost/postRouter');
const searchRouter = require('./search/searchRouter');

const fileupload = require('express-fileupload');

const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(fileupload());
app.use(express.json());
app.use(cors());

app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/search', searchRouter);

const start = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://dantereshenko69:${process.env.DB_PASSWORD}@cluster0.dooyzfm.mongodb.net/?retryWrites=true&w=majority`
    );
    app.listen(PORT, () => console.log(`server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
