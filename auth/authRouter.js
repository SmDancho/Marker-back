const Router = require('express');
const router = new Router();

const {
  registration,
  login,
  getMe,
  googleVerify,
  getUsers,
  getUserByid,
} = require('./authController');

const { body } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');

router.post(
  '/registration',
  body('password').isLength({ min: 5 }),
  (req, res) => {
    return registration(req, res);
  }
);

router.post('/login', (req, res) => {
  return login(req, res);
});

router.get('/getme', authMiddleware, (req, res) => {
  getMe(req, res);
});

router.post('/google', (req, res) => {
  googleVerify(req, res);
});
router.get('/users', (req, res) => {
  getUsers(req, res);
});
router.post('/getUserByid', (req, res) => {
  getUserByid(req, res);
});
module.exports = router;
