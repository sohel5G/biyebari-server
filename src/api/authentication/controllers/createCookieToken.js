
const jwt = require('jsonwebtoken');
require("dotenv").config();


const createCookieToken = async (req, res) => {

    try {
        const user = req.body;
        const userKey = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: '12h' })

        res.cookie('userKey', userKey, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        }).send({ success: true })

    } catch (error) {
        console.log(error)
    }


}

module.exports = createCookieToken;
