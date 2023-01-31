const user = require('express').Router();
const { getUserInfo, updateProfile } = require('../controllers/user');
const { validateProfileUpdate } = require('../middlewares/celebrate');

user.get('/users/me', getUserInfo);
user.patch('/users/me', validateProfileUpdate, updateProfile);
module.exports = user;