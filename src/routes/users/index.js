
const express = require('express');
const { StoreNewUser, getAllUsers, getUsersForPremiumApprobel, getSingleUserByEmail, userRoleUpdate, RequestUserAndBiodataForPro, adminAproveUserToPremium } = require('../../controllers/users');
const router = express.Router();


router.post('/store-users', StoreNewUser);

router.get('/users/all', getAllUsers);

router.get('/users/get-for-approved-premium', getUsersForPremiumApprobel);

router.get('/user/self/:useremail', getSingleUserByEmail);

router.put('/users/update-role/:useremail', userRoleUpdate);

router.put('/request/user/to-pro/:useremail', RequestUserAndBiodataForPro)

router.put('/approved/user/to-premium/:useremail', adminAproveUserToPremium )











module.exports = router;

