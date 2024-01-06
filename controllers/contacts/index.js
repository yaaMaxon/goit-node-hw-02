const { getAll } = require('./getAll');
const { getContactById } = require('./getContactById');
const { addContact } = require('./addContact');
const { updateContact } = require('./updateContact');
const { updateContactStatus } = require('./updateContactStatus');
const { removeContact } = require('./removeContact');
module.exports = {
    getAll,
    getContactById,
    addContact,
    updateContact,
    updateContactStatus,
    removeContact,
}