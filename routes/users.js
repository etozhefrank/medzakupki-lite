const express = require('express');
const router = express.Router();
const ObjectID = require('mongodb').ObjectID;

router.get('/', function(req, res, next) {
  if (!req.isAuthenticated()) { 
    res.redirect('/auth/login');
  }
  const users = req.app.locals.users;
  const _id = ObjectID(req.session.passport.user);
  
  users.findOne({ _id }, (err, results) => {
    if (err) {
      throw err;
    }
    res.render('profile', { ...results });
  });
});

router.get('/:username', (req, res, next) => {
  const users = req.app.locals.users;
  const username = req.params.username;

  users.findOne({ username }, (err, results) => {
    if (err || !results) {
      res.render('public-profile');
    }
    res.render('profile', { ...results });
  });
})

router.post('/:username', (req, res, next) => {
  const users = req.app.locals.users;
  const { password, email  } = req.body;
  const _id = ObjectID(req.session.passport.user);

  users.updateOne({ _id }, { $set: { password, email } }, (err) => {
    if (err) {
      throw err;
    }
    console.log('did')
    res.redirect('/:username');
  });
})

router.get('/profile', (req, res, next) => {
  const users = req.app.locals.users;
  const username = req.params.username;

  users.findOne({ username }, (err, results) => {
    if (err || !results) {
      res.render('public-profile');
    }
    res.render('profile', { ...results, username });
  });
})

router.post('/profile', (req, res, next) => {
  const users = req.app.locals.users;
  const { password, email  } = req.body;
  const _id = ObjectID(req.session.passport.user);

  users.updateOne({ _id }, { $set: { password, email } }, (err) => {
    if (err) {
      throw err;
    }
    res.redirect('/:username');
  });
})

router.get('/:username/admin', (req, res, next) => {
  if (!req.isAuthenticated()) { 
    res.redirect('/auth/login');
  }
  const users = req.app.locals.users;
  const _id = ObjectID(req.session.passport.user);

  users.findOne({ _id }, (err, results) => {
    if (err) {
      throw err;
    }
    if(results.role == 'admin'){
      
      res.render('admin-panel', results)
    } else {
    res.render('profile')
    }
  });
})

router.post('/', (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect('/auth/login');
  }
  const users = req.app.locals.users;
  const { username, email } = req.body;
  const _id = ObjectID(req.session.passport.user);

  users.updateOne({ _id }, { $set: { username, email } }, (err) => {
    if (err) {
      throw err;
    }
    res.redirect('/');
  });
});

module.exports = router;