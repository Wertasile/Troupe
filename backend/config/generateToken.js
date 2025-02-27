const jwt = require("jsonwebtoken")

const generateToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET, {                /* the id is the payload, secret is a key to sign and verify token*/
        expiresIn: "30d",                                         /* token expiry*/
    })
}

module.exports = generateToken