const { Contact } = require("../../models/index");
const { ctrlWrapper } = require("../../helpers/ctrlWrapper");
const { createError } = require("../../helpers/error");

const removeContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndDelete(contactId);
  if (!result) {
    throw createError(404, "Not found");
  }
  res.json({ 
      status: "success",
      message: "contact deleted",
      code: 200,
      data: {
        result
      }
    });
};

module.exports = {
    removeContact: ctrlWrapper(removeContact)
}