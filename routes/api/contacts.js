const express = require("express");

const ctrl = require("../../controllers/contacts");

const { validateRequest, auth } = require("../../middlewares");
const router = express.Router();

const { joiSchema, updateFavoriteSchema } = require("../../models/contact");

router.get("/", auth, ctrl.getAll );

router.get("/:contactId", ctrl.getContactById);

router.post("/", auth, validateRequest(joiSchema), ctrl.addContact);

router.delete("/:contactId", ctrl.removeContact);

router.put("/:contactId", validateRequest(joiSchema), ctrl.updateContact);

router.patch("/:contactId/favorite", validateRequest(updateFavoriteSchema), ctrl.updateContactStatus);

module.exports = router;
