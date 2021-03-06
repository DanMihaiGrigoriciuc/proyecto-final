const express    = require('express');
const authRoutes = express.Router();

const passport   = require('passport');
const bcrypt     = require('bcryptjs');


// require the user model !!!!
const User       = require('../models/User');


authRoutes.post('/signup', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const role = req.body.role;

    if (!username || !password) {
      res.status(400).json({ message: 'Provide username and password' });
      return;
    }

    if(password.length < 7){
        res.status(400).json({ message: 'Please make your password at least 8 characters long for security purposes.' });
        return;
    }
  
    User.findOne({ username }, (err, foundUser) => {

        if(err){
            res.status(500).json({message: "Username check went bad."});
            return;
        }

        if (foundUser) {
            res.status(400).json({ message: 'Username taken. Choose another one.' });
            return;
        }
  
        const salt     = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(password, salt);
  
        const aNewUser = new User({
            username:username,
            password: hashPass,
            role: role
        });
  
        aNewUser.save(err => {
            if (err) {
                res.status(400).json({ message: 'Saving user to database went wrong.' });
                return;
            }
            
            // Automatically log in user after sign up
            // .login() here is actually predefined passport method
            req.login(aNewUser, (err) => {

                if (err) {
                    console.log(err)
                    res.status(500).json({ message: 'Login after signup went bad.' });
                    return;
                }
            
                // Send the user's information to the frontend
                // We can use also: res.status(200).json(req.user);
                res.status(200).json(aNewUser);
            });
        });
    });
});



authRoutes.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, theUser, failureDetails) => {
        if (err) {
            res.status(500).json({ message: 'Something went wrong authenticating user' });
            return;
        }
        
        if (!theUser) {
            // "failureDetails" contains the error messages
            // from our logic in "LocalStrategy" { message: '...' }.
            res.status(401).json(failureDetails);
            return;
        }
        // if(!theUser.role) comsole.log("Este no es tu rol")

        // save user in session
        req.login(theUser, (err) => {
            console.log(theUser.role)
            if (err) {
                res.status(500).json({ message: 'Session save went bad.' });
                return;
            }
            
            // We are now logged in (that's why we can also send req.user)
            res.status(200).json(theUser);
        });
    })(req, res, next);
});



authRoutes.post('/logout', (req, res, next) => {
    // req.logout() is defined by passport
    req.logout();
    res.status(200).json({ message: 'Log out success!' });
});


authRoutes.get('/loggedin', (req, res, next) => {
    // req.isAuthenticated() is defined by passport
    console.log(req.isAuthenticated())
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
        return;
    }
    res.status(403).json({ message: 'Unauthorized' });
});

//Roles


function checkRoles(role) {
    return function(req, res, next) {
       
        if (req.isAuthenticated() && req.user.role === role) {
            return next();
        } else {
            res.status(403).json({ message: 'Unauthorized' });
        }
    

const checkUser = checkRoles('User');
const checkArtist = checkRoles('Artist');


authRoutes.get('/subasta', (req, res) => {
    // req.isAuthenticated() is defined by passport
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
        return;
    }
    res.status(403).json({ message: 'Unauthorized' });
});









authRoutes.get('/private', checkUser, (req, res) => {
    res.render('private', {user: req.user});
  });
  
  authRoutes.get('/posts', checkArtist, (req, res) => {
    res.render('private', {user: req.user});
  });  

    }
}




module.exports = authRoutes;