const Biodata = require("../../modals/biodata");

const totalDataForPagination = async (req, res) => {
    try {
        
        const totalBiodata = await Biodata.countDocuments();

        res.send({ totalBiodata });

    } catch (error) {
        console.log(error)
    }
}


module.exports = { totalDataForPagination };


