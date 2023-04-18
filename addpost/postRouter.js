const Router = require('express');
const router = new Router();
const { addPostValidation } = require('../validation/post');
const { validationResult } = require('express-validator');

const {
  addPost,
  getUserPost,
  getAllTags,
  deletPost,
  getAllTposts,
  getPostById,
  likePost,
  addComment,
  addRaiting,
  postUpdate,
} = require('./postController.js');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/add', addPostValidation, authMiddleware, (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json({ message: 'fill all required fields' });
  } else {
    addPost(req, res);
  }
});

router.get('/getUsersPosts', authMiddleware, (req, res) => {
  getUserPost(req, res);
});
router.get('/getTags', (req, res) => {
  getAllTags(req, res);
});
router.post('/update', authMiddleware, (req, res) => {
  postUpdate(req, res);
});
router.delete('/delete', authMiddleware, (req, res) => {
  deletPost(req, res);
});
router.get('/allPosts', (req, res) => {
  getAllTposts(req, res);
});

router.post('/postById', (req, res) => {
  getPostById(req, res);
});
router.post('/likePosts', authMiddleware, (req, res) => {
  likePost(req, res);
});
router.post('/comment', authMiddleware, (req, res) => {
  addComment(req, res);
});
router.post('/rate', authMiddleware, (req, res) => {
  addRaiting(req, res);
});
module.exports = router;
