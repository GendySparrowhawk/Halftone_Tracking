const { sign, verify } = require("jsonwebtoken");
const User = 


async function createToken(user_id) {
    try {
        const token = await sign({ user_id }, process.env.JWT_SECRET);

        return token
    } catch (err) {
        console.log('jwt failed to create', err.message)
    }
}

async function authenticate({ req, res }) {
    const token = req.cookies.token;

    if(!token) return { res };

    try {
        const data = await verify(token, process.env.JWT_SECRET, {
            maxAge: '8hr'
        });

        const user = await User.findById(data.user_id).populate('customers');
        return { user, res }
    } catch (err) {
        console.log('failed to find user data', err.message)
    }
};

module.exports = { createToken, authenticate}