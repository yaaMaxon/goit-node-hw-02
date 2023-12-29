const fs = require("fs/promises");
const { nanoid } = require("nanoid");
const path = require("path");
const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf-8");
  const contacts = JSON.parse(data);
  return contacts;
}

const getContactById = async(contactId) => {
  const contacts = await listContacts();
  const result = contacts.find(item => item.id === contactId);
  if(!result) {
    return null;
  }
  return result;
}

const removeContact = async(contactId) => {
  const contacts = await listContacts();
  const idx = contacts.findIndex(item => item.id === contactId);
  if(idx === -1) {
    return null;
  }
  const [removeContact] = contacts.splice(idx, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return removeContact;
}

const addContact = async(data) => {
  const contacts = await listContacts(); 
  const newContact = {...data, id: nanoid()}
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

const updateContact = async (contactId, data) => {
  const contacts = await listContacts();
  const idx = contacts.findIndex(item => item.id === contactId);
  if(idx === -1) {
    return null;
  }
  contacts[idx] = { contactId, ...data};
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[idx];
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}