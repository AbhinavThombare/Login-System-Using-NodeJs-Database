const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')

router.post('/api/users', bodyParser.json(), async (req, res) => {
    const user = new User(req.body.data)
    // console.log(user)
    // user.save().then(() => {
    //     console.log(user)
    //     res.status(201).send(user)
    // })

    try {
        const token = await user.generateToken()
        await user.save()
        return res.status(201).send({ user, token })
    } catch (error) {
        return res.status(401).send()
    }
})

router.get('/api/users', async (req, res) => {
    User.find({}).then((users) => {
        return res.send(users)
    })
})

router.post('/api/user/login', async (req, res) => {
    const email = req.body.userdata.email;
    const password = req.body.userdata.password;
    try {
        const user = await User.findCredential(email, password)
        const token = await user.generateToken()
        await user.save()
        if (user) {
            // console.log(res.header('auth-token'))
            return res.status(200).send({token});
        }
    } catch (error) {
        // console.log(error)
        return res.status(400).send(error.message)
    }
})

router.post('/api/user/logout',auth,async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.status(200).send()
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router;