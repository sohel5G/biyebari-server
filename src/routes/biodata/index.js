const express = require('express');
const { getBiodataWithFilters, postBiodata, updateBiodata, getSingleBioDataById, getSingleBioDataByEmail } = require('../../controllers/biodata');
const router = express.Router();


router.post('/biodatas', postBiodata);

router.put('/biodatas/:useremail', updateBiodata);

router.get('/biodatas', getBiodataWithFilters);


router.get('/biodata/:biodataid', getSingleBioDataById);


router.get('/biodata/own/:useremail', getSingleBioDataByEmail)


module.exports = router;


