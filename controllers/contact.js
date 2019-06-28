let controller = {};

let Contact = require('../models').Contact;

controller.add = (contact)=>{
    return new Promise((resolve,reject)=>{
        Contact
            .create(contact)
            .then(newContact=> resolve(newContact)); 
    });
}

module.exports = controller;