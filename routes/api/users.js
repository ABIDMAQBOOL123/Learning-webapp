const express = require('express');
const router = express.Router();
const { validateUser, registerUser,getAllUsers } = require('../../controllers/userController');
const auth = require('../../middleware/auth');
const authorizeRoles = require('../../middleware/role');


// @route    POST api/users
// @desc     Register user
// @access   Public
router.post('/', validateUser, registerUser);
router.get('/',auth,authorizeRoles('admin'),  getAllUsers);
module.exports = router;
