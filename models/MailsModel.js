const mongoose = require('mongoose');

const MailSchema = mongoose.Schema({
    name: String,
    subject:String,
    email: String,
    message: String

});

const MailModel = mongoose.model('Mail',MailSchema);

module.exports = MailModel;