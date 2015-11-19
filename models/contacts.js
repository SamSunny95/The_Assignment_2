//import mongoose and bcrypt
var mongoose = require('mongoose');


var Schema = mongoose.Schema; // Schema object

var ContactSchema = new Schema({
	contactName: String,
	phone: String,
	email: String,
	salt: String,
	provider: String,
	providerId: String,
	providerData: {},
	created: Number,
	updated: Number
}, 
{
	collection: 'contactInfo'
});

module.exports = mongoose.model('Contact', ContactSchema);