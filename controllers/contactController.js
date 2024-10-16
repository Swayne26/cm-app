const Contact = require('../models/contactModel');

const getContacts = (req, res) => {
    const contacts = Contact.find({user_id: req.user.id});
    res.status(200).json(contacts);
};

const createContact = async(req, res) => {
    const {name, email, phone}= req.body;
    if(!name || !email || !phone) {
        res.status(404);
        throw new Error("All Fields are mandatory")
    }
    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.user.id  // Assuming user_id is part of the request body. You might need to modify this based on your schema and authentication system.
    })
    res.status(201).json(contact);
};

const getContact = async(req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact) {
        res.status(404);
        throw new Error("Contact not found")
    }
    res.status(200).json({ message: "Get Contact by ID" });
};

const updateContact = async(req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }
    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("Unauthorized to update this contact");
    }
    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )
    
    res.status(200).json(updatedContact);
};

const deleteContact = async(req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }
    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("Unauthorized to update this contact");
    }
    await contact.deleteOne({_id: req.params.id});
    res.status(200).json(contact);
};

module.exports = { getContacts, createContact, getContact, updateContact, deleteContact}