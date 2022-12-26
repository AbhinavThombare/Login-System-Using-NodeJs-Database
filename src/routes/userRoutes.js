const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
const fs = require('fs')
const multer = require('multer')
const pdfParse = require('pdf-parse')
const StreamZip = require('node-stream-zip');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

const userFiles = './user_upload/'

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
            return res.status(200).send({ token });
        }
    } catch (error) {
        // console.log(error)
        return res.status(400).send(error.message)
    }
})

router.post('/api/user/logout', auth, async (req, res) => {
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

router.post('/api/user/fileupload', auth, async (req, res) => {

    const file = req.body;
    const email = req.user.email
    try {
        const user = await User.storeFile(email, file.fileName, file.fileContent)
            return res.status(200).send('File Uploaded Successfully.')
    } catch (error) {
        return res.status(401).send(error.message)
    }


    // const file = req.body;
    // const base64data = file.fileContent.replace(/^data:.*,/, '');
    // fs.writeFile(userFiles + file.fileName, base64data, 'base64', (err) => {
    //     if (err) {
    //         console.log(err);
    //         res.sendStatus(500);
    //     } else {
    //         res.set('Location', userFiles + file.fileName);
    //         console.log(userFiles + file.fileName)
    //         res.status(200);
    //         res.send(file);
    //     }
    // });
    // const zip = new StreamZip({
    //     file: userFiles+file.fileName,
    //     storeEntries: true
    // })
    // zip.on('ready', () => {
    //     var chunks = []
    //     var content = ''
    //     zip.stream('word/document.xml', (err, stream) => {
    //         if (err) {
    //             console.log(err)
    //         }
    //         stream.on('data', function (chunk) {
    //             chunks.push(chunk)
    //         })
    //         stream.on('end', function () {
    //             content = Buffer.concat(chunks)
    //             console.log(content.toString())
    //             // const parser = new XMLParser();
    //             // const json = parser.parseString(content);
    //             // console.log(json)
    //             zip.close()
    //         })
    //     })
    // })

})

module.exports = router;