const Requests = require('../../modals/requests');

const { ObjectId } = require('mongoose').Types;

const getARequestedItem = async (req, res) => {
    try {

        const userEmail = req.params.useremail;
        const query = { requesterEmail: userEmail };

        const result = await Requests.find(query);
        res.send(result);

    } catch (error) {
        console.log(error)
    }
}


const PostARequestedItem = async (req, res) => {
    try {

        const newRequest = req.body;

        const data = new Requests(newRequest);
        const result = await data.save();

        res.send({ insertedId: result._id });

    } catch (err) {
        console.log(err);
    }
}



const deleteARequeste = async (req, res) => {
    try {

        const reqItemId = req.params.reqitemid;
        const filter = { _id: new ObjectId(reqItemId) };
        const result = await Requests.deleteOne(filter);
        res.send(result);

    } catch (error) {
        console.log(error)
    }

}


const adminGetRequestForApproved = async (req, res) => {
    const result = await Requests.find({ request: 'Pending' });
    res.send(result);
}



const ApprovedRequestByAdmin = async (req, res) => {
    try {
        const ItemId = req.params.itemid;
        const filter = { _id: new ObjectId(ItemId) };

        const updateDoc = {
            $set: {
                request: 'Approved',
            },
        };

        const result = await Requests.updateOne(filter, updateDoc);
        res.send(result);
    } catch (err) {
        console.log(err)
    }
}





module.exports = { getARequestedItem, PostARequestedItem, deleteARequeste, adminGetRequestForApproved, ApprovedRequestByAdmin };




