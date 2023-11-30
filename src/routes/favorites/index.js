
const express = require('express');
const { storeFavoritesItems, getFavoriteByEmail, deleteAFavorite } = require('../../controllers/favorites');
const router = express.Router();


router.post('/favorites', storeFavoritesItems)

router.get('/favorites/:userEmail', getFavoriteByEmail)

router.delete('/favorites/:favitemid', deleteAFavorite)





module.exports = router;



