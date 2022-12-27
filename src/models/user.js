const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { async } = require('node-stream-zip')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true
    },
    mobile: {
        type: Number,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 1
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }],
    filesData: [{fileName:String,fileContent:String}]

})

userSchema.methods.generateToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisisloginsystem')
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findCredential = async function (email, password) {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error(message = 'User Not Found')
    }

    if (user.password === password) {
        return user
    }
    else {
        throw new Error(message = 'Password Not Match')
    }
}

userSchema.statics.storeFile = async function (email, fileName, fileContent) {
    const user = await User.findOne({ email })
    var file = {fileName:fileName,fileContent:fileContent}
    if(user){
        user.filesData.push(file)
        // console.log(user)
        await user.save()
        return user
    }
    else {
        throw new Error('File Not Uploaded!')
    }
}
const User = mongoose.model('User', userSchema)

module.exports = User;