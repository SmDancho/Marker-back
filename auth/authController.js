const User = require('../models/user');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { secret } = require('../config');

const saltRounds = 10;
const { validationResult } = require('express-validator');

function generateAccessToken(id) {
  const payload = { id };
  return jwt.sign(payload, secret, {
    expiresIn: '24h',
  });
}

const registration = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({ message: 'password must be longer than 5' });
    }

    const { username, password } = req.body;

    const candidate = await User.findOne({ username });

    if (candidate) return res.json({ message: 'User already exist' });

    const Hashpassword = bcrypt.hashSync(password, saltRounds);

    const user = new User({ username, password: Hashpassword });
    await user.save();
    const token = generateAccessToken(user._id);

    return await res.json({ user, token, message: 'registration successful' });
  } catch (e) {
    console.log(e);
    return res.json({ message: `username can not be empty` });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ message: `User ${username} is no defined` });
    }
    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.json({ message: `password is invalid` }).status(400);
    }
    const token = generateAccessToken(user._id);
    return res.json({ user, token, message: 'Login successful' });
  } catch (e) {
    console.log(e);
    return res.json({ message: `Login error ${e}` });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.json({
        message: 'user is not defined',
      });
    }

    const token = generateAccessToken(user._id);
    return res.json({ user, token });
  } catch (error) {
    res.json({ message: 'Нет доступа.' });
  }
};
const { OAuth2Client } = require('google-auth-library');

const googleVerify = async (req, res) => {
  try {
    const { clientId, credential } = req.body;

    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });

    const payload = ticket.getPayload();

    const username = payload.name;
    const candidate = await User.findOne({ username });

    if (candidate) {
      const token = generateAccessToken(candidate);
      return res.json({ token, user:candidate });
    }

    const Hashpassword = bcrypt.hashSync(credential, saltRounds);

    const user = new User({ username, password: Hashpassword });
    await user.save();
    const token = generateAccessToken(user);

    return res.json({ user, token: token });
  } catch (e) {
    console.log(e);
  }
};

module.exports = { registration, login, getMe, googleVerify };
