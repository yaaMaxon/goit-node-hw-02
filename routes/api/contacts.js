const express = require('express')
const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
})

const contactsOperations = require("../../models");
const { createError } = require("../../helpers/error");

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const contacts = await contactsOperations.listContacts();
    res.json({
      status: "success",
      code: 200,
      data: {
        result: contacts
      }
    });
  } catch (error) {
      next(error);
  }
})

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contactsOperations.getContactById(contactId);
    if(!result) {
        throw createError(404, `Contact with id=${contactId} not found`);
    }
    res.json({ 
      status: "success",
      code: 200,
      data: {
        result
      }
    })
  } catch (error) {
     next(error);
  }
})

router.post('/', async (req, res, next) => {
  try {
    const {error} = contactSchema.validate(req.body);
    if(error) {
        throw createError(400, "missing required name fields");
    }
    const result = await contactsOperations.addContact(req.body);
    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        result
      }
    })
  } catch (error) {
    next(error);
  }
})

router.delete('/:contactId', async (req, res, next) => {
    try {
    const { contactId } = req.params;
    const result = await contactsOperations.removeContact(contactId);
    if(!result) {
        throw createError(404, `Contact with id=${contactId} not found`);
    }
     res.json({ 
      status: "success",
      message: "contact deleted",
      code: 200,
      data: {
        result
      }
    })
  } catch (error) {
    next(error);
  }
})

router.put('/:contactId', async (req, res, next) => {
  try {
    const {error} = contactSchema.validate(req.body);
    if(error) {
        throw createError(400, "missing required name fields");
    }
    const { contactId } = req.params;
    const result = await contactsOperations.updateContact(contactId, req.body);
    if(!result) {
        throw createError(404, `Contact with id=${contactId} not found`);
    }
     res.json({ 
      status: "success",
      code: 200,
      data: {
        result
      }
    })
  } catch (error) {
    next(error);
  }
})

module.exports = router;
