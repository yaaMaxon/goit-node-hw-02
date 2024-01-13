const { Schema, model } = require("mongoose");
const Joi = require("joi");

const userSchema = Schema({
  password: {
    type: String,
    required: [true, 'Set password for user'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  token: {
    type: String,
    default: null
  },
  avatarUrl: {
    type: String,
    required: true
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, 'Verify token is required'],
  },
}, {versionKey: false, timestamps: true});

const joiRegisterSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
    subscription: Joi.string().optional(),
})

const joiLoginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(6).required()
})

const verifyEmailSchema = Joi.object({
    email: Joi.string().required()
})

const User = model("user", userSchema);

module.exports = {
    User,
    joiRegisterSchema,
    joiLoginSchema,
    verifyEmailSchema
}