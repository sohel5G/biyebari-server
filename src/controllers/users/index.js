const Biodata = require("../../modals/biodata");
const Users = require("../../modals/users");

const StoreNewUser = async (req, res) => {
    try {
        const newUser = req.body;

        const query = { email: newUser.email };
        const existingUser = await Users.findOne(query);
        if (existingUser) {
            return res.send({ message: 'user already exists', insertedId: null });
        }

        const data = new Users(newUser);
        const result = await data.save();

        res.send({ insertedId: result._id });
    } catch (err) {
        console.log(err)
    }
}


const getAllUsers = async (req, res) => {
    const result = await Users.find();
    res.send(result);
}


const getUsersForPremiumApprobel = async (req, res) => {
    const result = await Users.find({ isPro: 'Pending' });
    res.send(result);
}


const getSingleUserByEmail = async (req, res) => {
    try {

        const userEmail = req.params.useremail;
        const query = { email: userEmail };
        const result = await Users.findOne(query);
        res.send(result);

    } catch (error) {
        console.log(error)
    }
}


const userRoleUpdate = async (req, res) => {
    try {
        const userEmail = req.params.useremail;
        const query = { email: userEmail };

        const updateDoc = {
            $set: {
                userRole: 'Admin',
            },
        };

        const result = await Users.updateOne(query, updateDoc);
        res.send(result);
    } catch (err) {
        console.log(err)
    }
}


const RequestUserAndBiodataForPro = async (req, res) => {
    try {

        const userEmail = req.params.useremail;
        const query = { email: userEmail };

        const getThisUserBiodataId = await Biodata.findOne(query);
        const thisUserBiodataId = getThisUserBiodataId?.biodataId;

        const updateDoc = {
            $set: {
                isPro: 'Pending',
                biodataId: thisUserBiodataId
            },
        };

        const resultForUser = await Users.updateOne(query, updateDoc);
        const resultForBiodata = await Biodata.updateOne(query, updateDoc);
        const result = { resultForUser, resultForBiodata }
        res.send(result);

    } catch (error) {
        console.log(error);
    }
}



const adminAproveUserToPremium = async (req, res) => {
    try {

        const userEmail = req.params.useremail;
        const query = { email: userEmail };

        const updateDoc = {
            $set: {
                isPro: 'Premium',
            },
        };

        const resultForUser = await Users.updateOne(query, updateDoc);
        const resultForBiodata = await Biodata.updateOne(query, updateDoc);
        const result = { resultForUser, resultForBiodata }
        res.send(result);

    } catch (error) {
        console.log(error);
    }
}








module.exports = { StoreNewUser, getAllUsers, getUsersForPremiumApprobel, getSingleUserByEmail, userRoleUpdate, RequestUserAndBiodataForPro, adminAproveUserToPremium };

