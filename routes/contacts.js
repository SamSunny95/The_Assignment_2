var express = require('express');
var passport = require('passport');
var router = express.Router();

var Contact = require('../models/contact');

/* Utility functin to check if user is authenticatd */
function requireAuth(req, res, next){

  // check if the user is logged in
  if(!req.isAuthenticated()){
    return res.redirect('/login');
  }
  next();
}

/* Render Contacts main page. */
router.get('/', requireAuth, function (req, res, next) {
    Contact.find(function (err, contacts) {
        if (err) {
            console.log(err);
            res.end(err);
        }
        else {
            res.render('contacts/index', {
                title: 'Business Contacts',
                contacts: contacts,
                displayName: req.user ? req.user.displayName : ''
            });
        }
    });
});

/* Render the Add Contacts Page */
router.get('/add', requireAuth, function (req, res, next) {
    res.render('contacts/add', {
        title: 'Business Contacts',
        displayName: req.user ? req.user.displayName : ''
    });
});

/* process the submission of a new Contact */
router.post('/add', requireAuth, function (req, res, next) {
    var contact = new Contact(req.body);
    //var hashedPassword = user.generateHash(user.password);
    Contact.create({
        email: req.body.email,
        contactName: req.body.contactname,
        //password: hashedPassword,
        //displayName: req.body.displayName,
        phone : req.body.phone,
        provider: 'local',
        created: Date.now(),
        updated: Date.now()
    }, function (err, Contact) {
        if (err) {
            console.log(err);
            res.end(err);
        }
        else {
            res.redirect('/bcontacts');
        }
    });
});

/* Render the Contact Edit Page */
router.get('/:id', requireAuth, function (req, res, next) {
    // create an id variable
    var id = req.params.id;
    // use mongoose and our model to find the right user
    Contact.findById(id, function (err, contact) {
        if (err) {
            console.log(err);
            res.end(err);
        }
        else {
            //show the edit view
            res.render('contacts/edit', {
                title: 'Edit Contact',
                contact: contact,
                displayName: req.user ? req.user.displayName : ''
            });
        }
    });
});

/* process the edit form submission */
router.post('/:id', requireAuth, function (req, res, next) {
    var id = req.params.id;
    var contact = new Contact(req.body);
    //user.password = user.generateHash(user.password);
    contact.contactName = req.body.contactname;
    contact.phone = req.body.phone;
    contact.email = req.body.email;
    contact._id = id;
    contact.updated = Date.now();
    
    // use mongoose to do the update
    Contact.update({ _id: id }, contact, function (err) {
        if (err) {
            console.log(err);
            res.end(err);
        }
        else {
            res.redirect('/bcontacts');
        }
    });
});

/* run delete on the selected contact*/ 
router.get('/delete/:id', requireAuth, function (req, res, next) {
    var id = req.params.id;
    Contact.remove({ _id: id }, function (err) {
        if (err) {
            console.log(err);
            res.end(err);
        }
        else {
            res.redirect('/bcontacts');
        }
    });
});

module.exports = router;
