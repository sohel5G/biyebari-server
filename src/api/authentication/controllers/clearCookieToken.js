const clearCookieToken = async (req, res) => {
    try {

        const user = req.body;
        res.clearCookie('userKey', {
            maxAge: 0,
            secure: true,
            sameSite: 'none'
        }).send({ success: true })

    } catch (error) {
        console.log(error)
    }
}

module.exports = clearCookieToken;
