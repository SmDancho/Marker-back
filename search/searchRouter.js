const Router = require('express');
const router = new Router();

const { search } = require('./searchContoller.js');

router.post('/posts', (req, res) => {
  search(req, res);
});

module.exports = router;
