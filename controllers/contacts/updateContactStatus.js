const { Contact } = require("../../models/index");
const { ctrlWrapper } = require("../../helpers/ctrlWrapper");
const { createError } = require("../../helpers/error");

const updateContactStatus = async (req, res) => {
  const { contactId } = req.params;

  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

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
    updateContactStatus: ctrlWrapper(updateContactStatus)
}