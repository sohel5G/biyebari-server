
const Biodata = require("../../modals/biodata");

const getBiodataWithFilters = async (req, res) => {
    try {

        const pageNo = parseInt(req.query.currentPage - 1);
        const totalItem = parseInt(req.query.itemsPerPage);

        const PremiumBiodata = req.query.premium;
        if (PremiumBiodata) {
            const filter = { isPro: PremiumBiodata };
            const result = await Biodata.find(filter).skip(pageNo * totalItem).limit(totalItem);
            return res.send(result);
        }

        const biodataType = req.query.biodatatype;
        if (biodataType) {
            const filter = { type: biodataType };
            const result = await Biodata.find(filter).skip(pageNo * totalItem).limit(totalItem);
            return res.send(result);
        }

        const divisionValue = req.query.divisionvalue;
        if (divisionValue) {
            const filter = { permanentDivision: divisionValue };
            const result = await Biodata.find(filter).skip(pageNo * totalItem).limit(totalItem);
            return res.send(result);
        }

        const gteValue = req.query.gteValue;
        const lteValue = req.query.lteValue;
        if (gteValue && lteValue) {
            const filter = { age: { $gte: gteValue, $lte: lteValue } };
            const result = await Biodata.find(filter).skip(pageNo * totalItem).limit(totalItem);
            return res.send(result);
        }


        const result = await Biodata.find().skip(pageNo * totalItem).limit(totalItem);
        res.send(result);

    } catch (error) {
        console.log(error);
    }
}




const postBiodata = async (req, res) => {
    try {
        const newBiodata = req.body;

        const totalBiodata = await Biodata.countDocuments();
        const id = totalBiodata + 1;
        newBiodata.biodataId = id;

        const data = new Biodata(newBiodata);
        const result = await data.save();

        res.send({ insertedId: result._id });

    } catch (error) {
        console.log(error)
    }
}



const updateBiodata = async (req, res) => {
    try {
        const updateBiodata = req.body;

        const userEmail = req.params.useremail;
        const query = { email: userEmail };

        const updateDoc = {
            $set: {
                age: updateBiodata?.age,
                birth: updateBiodata?.birth,
                email: updateBiodata?.email,
                height: updateBiodata?.height,
                img: updateBiodata?.img,
                inches: updateBiodata?.inches,
                mobile: updateBiodata?.mobile,
                mothersName: updateBiodata?.mothersName,
                name: updateBiodata?.name,
                occupation: updateBiodata?.occupation,
                race: updateBiodata?.race,
                religion: updateBiodata?.religion,
                type: updateBiodata?.type,
                weight: updateBiodata?.weight,
                permanentDivision: updateBiodata?.permanentDivision,
                presentDivision: updateBiodata?.presentDivision,
                expectedPartnerAge: updateBiodata?.expectedPartnerAge,
                expectedPartnerHeight: updateBiodata?.expectedPartnerHeight,
                expectedPartnerInches: updateBiodata?.expectedPartnerInches,
                expectedPartnerWeight: updateBiodata?.expectedPartnerWeight,
                fathersName: updateBiodata?.fathersName
            },
        };

        const result = await Biodata.updateOne(query, updateDoc);
        res.send(result);

    } catch (error) {
        console.log(error)
    }
}



const getSingleBioDataById = async (req, res) => {
    try {

        const biodataId = req.params.biodataid;
        const filter = { _id: biodataId };
        const result = await Biodata.findOne(filter);
        res.send(result);

    } catch (error) {
        console.log(error)
    }
}


getSingleBioDataByEmail = async (req, res) => {
    try {

        const userEmail = req.params.useremail;
        const filter = { email: userEmail };
        const result = await Biodata.findOne(filter);
        res.send(result);

    } catch (error) {
        console.log(error)
    }
}




module.exports = { getBiodataWithFilters, postBiodata, updateBiodata, getSingleBioDataById, getSingleBioDataByEmail };

