// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');

// define the user model
let UserModel = require('../models/users');
let User = UserModel.User; // alias for User Model - User object

// define the businesscontacts model
let businesscontact = require('../models/businesscontacts');

// create a function to check if the user is authenticated
function requireAuth(req, res, next) {
  // check if the user is logged in
  if(!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
}

/* GET businesscontacts List page. READ */
router.get('/', requireAuth, (req, res, next) => {
  // find all businesscontacts in the businesscontacts collection
  businesscontact.find( (err, businesscontacts) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('businesscontacts/index', {
        title: 'Business Contacts',
        businesscontacts: businesscontacts,
        displayName: req.user.displayName
      });
    }
  });
});

//  GET the Business Contact Details page in order to add a new Business Contact
router.get('/add', requireAuth, (req, res, next) => {
  res.render('businesscontacts/details', {
    title: "Add a new Business Contact",
    businesscontacts: '',
    displayName: req.user.displayName
  });
});

// POST process the Business Contact Details page and create a new Business Contact - CREATE
router.post('/add', requireAuth, (req, res, next) => {

  let newBusinessContact = businesscontact({
    "Name": req.body.name,
    "Number": req.body.number,
    "Email": req.body.email    
  });

  businesscontact.create(newBusinessContact, (err, businesscontact) => {
    if(err) {
      console.log(err);
      res.end(err);
    } else {
      res.redirect('/businesscontacts');
    }
  });
});

// GET the Business Contact Details page in order to edit an existing Business Contact
router.get('/:id', requireAuth, (req, res, next) => {

  try{
    // get a reference to the id
    let id = mongoose.Types.ObjectId.createFromHexString(req.params.id);

    // find the business contact by its id
    businesscontact.findById(id, (err, businesscontacts) => {
      if(err) {
        console.log(err);
        res.end(err);
      } else {
        // show the business contact details view
        res.render('businesscontacts/details', {
          title: 'Business Contact Details',
          businesscontacts: businesscontacts,
          displayName: req.user.displayName
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.redirect('/errors/404');
  }
});

// POST - process the information passed from the details form and update the document
router.post('/:id', requireAuth, (req, res, next) => {
  // get a reference to the id
  let id = req.params.id;

  let updateBusinessContact = businesscontact({
    "_id": id,
    "Name": req.body.name,
    "Number": req.body.number,
    "Email": req.body.email    
  });

  businesscontact.update({_id: id}, updateBusinessContact, (err) => {
    if(err) {
      console.log(err);
      res.end(err);
    } else {
      // refresh the business contact List
      res.redirect('/businesscontacts');
    }
  });
});

// GET - process the delete by user id
router.get('/delete/:id', requireAuth, (req, res, next) => {
  // get a reference to the id
  let id = req.params.id;
  
  businesscontact.remove({_id: id}, (err) => {
    if(err) {
      console.log(err);
       res.end(err);
    } else {
      // refresh the business contacts list
        res.redirect('/businesscontacts');
    }
  });
});

module.exports = router;
