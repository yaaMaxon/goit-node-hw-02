const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const { nanoid } = require("nanoid");

const { User } = require("../../models/user");

const { ctrlWrapper } = require("../../helpers/ctrlWrapper");
const { createError } = require("../../helpers/error");
const { sendEmail } = require("../../helpers/sendEmail");

const { SECRET_KEY } = process.env;

const register = async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(user) {
        throw createError(409, `User with ${email} already exist`);
    }

    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const avatarUrl = gravatar.url(email);
    const verificationToken = nanoid();
    const result = await User.create({ 
        ...req.body, 
        password: hashPassword, 
        avatarUrl, 
        verificationToken 
    });

    const mail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="http://localhost:3000/users/verify/${verificationToken}">Confirm email!</a>`
    }

    await sendEmail(mail);

    res.status(201).json({
        status: "success",
        code: 201,
        user: {
            email: result.email,
            subscription: result.subscription
        }
    })
}

const verifyEmail = async(req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({verificationToken});
    if(!user) {
        throw createError(404, "User not found")
    }
    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null});
    res.json({
        message: "Verify success"
    })
}

const resendVerifyEmail = async(req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if(!user) {
        throw createError(404, "missing required field email")
    }
    if(user.verify) {
        throw createError(400, "Verification has already been passed")
    }

    const mail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="http://localhost:3000/users/verify/${user.verificationToken}">Confirm email!</a>`
    }
    await sendEmail(mail);
    res.json({
        message: "Email verify resend"
    })
}

const login = async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) {
        throw createError(401, "Email or password is wrong")
    }
    const passCompare = await bcrypt.compareSync(password, user.password)
    if(!passCompare) {
        throw createError(401, "Email or password is wrong")
    }
    if(!user.verify) {
        throw createError(400, "Email is not verify")
    }
    const payload = {
        id: user._id
    }
    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "1h"});
    await User.findByIdAndUpdate(user._id, {token})

    res.json({
        status: "success",
        code: 200,
        token,
        user: {
            email: user.email,
            subscription: user.subscription
        }
    })
}

const getCurrent = async(req, res) => {
    const { email, subscription } = req.user;

    res.json({
        user: {
            email,
            subscription
        }
    })
}

const logout = async(req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, {token: null});
    res.status(204).json();
}

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

const updateAvatar = async(req, res) => {
    const {path: tempUpload, originalname} = req.file;
    const {_id: id} =  req.user;
    const imageName = `${id}_${originalname}`;
    try {
        const resultUpload = path.join(avatarsDir, imageName)
        await fs.rename(tempUpload, resultUpload);
        const avatarUrl = path.join("public", "avatars", imageName);
        await User.findByIdAndUpdate(req.user._id, { avatarUrl });
        res.json({ avatarUrl })

    } catch (error) {
        await fs.unlink(tempUpload);
        throw error;
    }
}

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
    verifyEmail: ctrlWrapper(verifyEmail),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail)
}