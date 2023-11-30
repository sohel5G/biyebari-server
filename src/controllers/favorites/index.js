const FavoritesItems = require("../../modals/favorites");
const { ObjectId } = require('mongoose').Types;




const storeFavoritesItems = async (req, res) => {
    try {
        const newFavorite = req.body;

        const data = new FavoritesItems(newFavorite);
        const result = await data.save();

        res.send({ insertedId: result._id });

    } catch (error) {
        console.log(error)
    }
}



const getFavoriteByEmail = async (req, res) => {
    try {
        const userEmail = req.params.userEmail;
        const query = { favMakerEmail: userEmail };

        const result = await FavoritesItems.find(query);
        res.send(result);

    } catch (error) {
        console.log(error);
    }
}


const deleteAFavorite = async (req, res) => {
    try {

        const favItemId = req.params.favitemid;
        const filter = { _id: new ObjectId(favItemId) };
        const result = await FavoritesItems.deleteOne(filter);
        res.send(result);

    } catch (error) {
        console.log(error)
    }
}








module.exports = { storeFavoritesItems, getFavoriteByEmail, deleteAFavorite };

