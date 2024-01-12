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
  }
}, {versionKey: false, timestamps: true});

const joiRegisterSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(6).required()
})

const joiLoginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(6).required()
})

const User = model("user", userSchema);

module.exports = {
    User,
    joiRegisterSchema,
    joiLoginSchema
}