const {createError} = require("../helpers/error");

const validateRequest = (schema) => {
    return (req, res, next) => {
        const {error} = schema.validate(req.body);
        if(error) {
            next(createError(400, error.message));
        }
        next();
    }
}

module.exports = {
    validateRequest
}