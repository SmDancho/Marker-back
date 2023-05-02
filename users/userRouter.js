const Router = require('express');
const router = new Router();
const {
  getUsers,
  getUserByid,
  deleteUser,
  makeAdmin,
  blockUser,
} = require('./userContoller');

router.get('/all', (req, res) => {
  getUsers(req, res);
});

router.post('/getUserByid', (req, res) => {
  getUserByid(req, res);
});

router.post('/delete', (req, res) => {
  deleteUser(req, res);
});

router.post('/admin', (req, res) => {
  makeAdmin(req, res);
});
router.post('/block', (req, res) => {
  blockUser(req, res);
});
module.exports = router;
