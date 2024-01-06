const { Contact } = require("../../models/index");
const { ctrlWrapper } = require("../../helpers/ctrlWrapper");

const getAll = async (req, res) => {
  const result = await Contact.find();
  res.json({
      status: "success",
      code: 200,
      data: {
        result
    }
    });
};

module.exports = {
    getAll: ctrlWrapper(getAll)
}