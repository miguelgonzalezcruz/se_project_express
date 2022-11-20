const router = require('express').Router();
const { getUser } = require('../controllers/users');

const getCurrentUser = (req, res) => {
  getUser(req, res);
};

router.get('/me', getCurrentUser);
router.patch('/me', getCurrentUser);

module.exports = router;
