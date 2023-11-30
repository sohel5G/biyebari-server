
const express = require('express');
const { getARequestedItem, PostARequestedItem, deleteARequeste, adminGetRequestForApproved, ApprovedRequestByAdmin } = require('../../controllers/requests');
const router = express.Router();


router.get('/users/get-contact-request/:useremail', getARequestedItem);

router.post('/users/post-contact-request', PostARequestedItem);

router.delete('/users/delete-contact-request/:reqitemid', deleteARequeste)

router.get('/admin/get-for-approved-request', adminGetRequestForApproved)

router.put('/admin/approved-contact-request/:itemid', ApprovedRequestByAdmin)




module.exports = router;
