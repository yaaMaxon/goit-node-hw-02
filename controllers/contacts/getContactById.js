const { Contact } = require("../../models/contact");
const { ctrlWrapper } = require("../../helpers/ctrlWrapper");
const { createError } = require("../../helpers/error");

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);

  if (!result) {
    throw createError(404, "Not found");
  }
  res.json({
      status: "success",
      code: 200,
      data: {
        result
    }
    });
};

module.exports = {
    getContactById: ctrlWrapper(getContactById)
}