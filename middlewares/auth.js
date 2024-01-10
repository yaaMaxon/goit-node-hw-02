const { createError } = require("../helpers/error"); 
const jwt = require("jsonwebtoken");

const { User } = require("../models/user");

const { SECRET_KEY } = process.env;

const auth = async(req, res, next) => {
    const { authorization = ""} = req.headers;
    const [ bearer, token ] = authorization.split(" ");
    if(bearer !== "Bearer") {
       next(createError(401, "Not authorized"))
    }
    try {
       const { id } = jwt.verify(token, SECRET_KEY);
       const user = await User.findById(id);
    if(!user || !user.token) {
       next(createError(401, "Not authorized"))
       }
    req.user = user;
    next();
    } catch (error) {
       next(createError(401, "Not authorized"))
    }
}

module.exports = auth;