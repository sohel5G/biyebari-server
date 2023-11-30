const Biodata = require("../../modals/biodata");
const Requests = require("../../modals/requests");
const SuccessStory = require("../../modals/successStory");


const adminDashboardStatistic = async (req, res) => {
    try {

        const totalBiodata = await Biodata.countDocuments();

        const totalMarrige = await SuccessStory.countDocuments();

        const maleQuery = { type: 'Male' }
        const maleBiodata = await Biodata.countDocuments(maleQuery);

        const femaleQuery = { type: 'Female' }
        const femaleBiodata = await Biodata.countDocuments(femaleQuery);

        const premiumQuery = { isPro: 'Premium' }
        const premiumBiodata = await Biodata.countDocuments(premiumQuery);

        const totalRevenue = await Requests.find();
        const subTotalRevenue = totalRevenue.reduce((total, item) => {
            if (item.payed) {
                return total + item.payed;
            }
            return total;
        }, 0);

        res.send({
            totalBiodata,
            maleBiodata,
            femaleBiodata,
            premiumBiodata,
            subTotalRevenue,
            totalMarrige
        })

    } catch (err) {
        console.log(err);
    }
}


module.exports = { adminDashboardStatistic };

