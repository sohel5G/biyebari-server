const SuccessStory = require("../../modals/successStory");

const getSuccessStory = async (req, res) => {
    try {

        const result = await SuccessStory.find()
        res.send(result);

    } catch (err) {
        console.log(err)
    }
}


const postSuccessStory = async (req, res) => {
    try {
        const newStory = req.body;

        const data = new SuccessStory(newStory);
        const result = await data.save();

        res.send({ insertedId: result._id });

    } catch (error) {
        console.log(error)
    }
}


module.exports = { getSuccessStory, postSuccessStory };