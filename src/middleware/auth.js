const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    const token = req.params.token
    // console.log(token)
    const decoded = jwt.verify(token, 'thisisloginsystem')

    // console.log(decoded)
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

    req.token = token;
    req.user = user;
    next()

    // try {
    //     const token = req.body.token;
    //     const decoded = jwt.verify(token,'thisisloginsystem')
    //     const user = await User.findOne({ _id: decoded._id, 'tokens.token':token })

    //     if(!user){
    //         throw new Error()
    //     }

    //     req.token = token;
    //     req.user = user;
    //     next()
    // } catch (e) {
    //     res.status(401).send({'error':'Please authenticate.'})
    // }
}

module.exports = auth;