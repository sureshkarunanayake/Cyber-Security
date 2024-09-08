const express = require('express');
const { signup, login, getUsers, updateUserRole, verifyOtp   } = require('../controllers/userController');


const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/users', getUsers);
router.put('/users/:userId/role', updateUserRole);
router.post('/verify-otp', verifyOtp);


module.exports = router;
