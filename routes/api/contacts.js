const express = require("express");

const ctrl = require("../../controllers/contacts");

const { validateRequest } = require("../../middlewares/validateRequest");
const router = express.Router();

const { joiSchema, updateFavoriteSchema } = require("../../models/index");

router.get("/", ctrl.getAll );

router.get("/:contactId", ctrl.getContactById);

router.post("/", validateRequest(joiSchema), ctrl.addContact);

router.delete("/:contactId", ctrl.removeContact);

router.put("/:contactId", validateRequest(joiSchema), ctrl.updateContact);

router.patch("/:contactId/favorite", validateRequest(updateFavoriteSchema), ctrl.updateContactStatus);

module.exports = router;
