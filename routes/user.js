const user = require('express').Router();
const { getUserInfo, updateProfile } = require('../controllers/user');

user.get('/users/me', getUserInfo);
user.patch('/users/me', updateProfile);
module.exports = user;