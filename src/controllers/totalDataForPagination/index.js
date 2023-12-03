const Biodata = require("../../modals/biodata");

const totalBiodataForPagination = async (req, res) => {
    try {

        const totalBiodataForPagination = await Biodata.countDocuments();

        res.send({ totalBiodataForPagination });

    } catch (error) {
        console.log(error)
    }
}

module.exports = { totalBiodataForPagination };
