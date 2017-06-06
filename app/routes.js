// app/routes.js
module.exports = function(app, passport) {

    // ==================================================
    // HOME PAGE (with login links and register) ========
    // ==================================================
    app.get('/', function(req, res) {
        res.render('index.ejs', {
            message: req.flash('loginMessage'),
            message1: req.flash('signupMessage')
        });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form


    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));


    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // EDITOR SECTION ======================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)

    app.get('/profile/startastory', isLoggedIn, function(req, res) {
        res.render('editor.ejs')

    });

    // =====================================
    // SCHEMA LOADED (story) ===============
    // =====================================    

    var Story = require('./models/story');

    Story.createStory = function(newFeature, callback) {
        newFeature.save(callback);
    }

    // =====================================
    // POST A NEW STORY ====================
    // =====================================
    // var Story = require('./models/story');

    app.post('/profile/startastory', function(req, res) {
        var category = req.body.category;
        var author = req.user.facebook.name;
        var title = req.body.title;
        var body = req.body.body;
        var created_at = Date();
        var newStory = new Story({
            category: category,
            title: title,
            body: body,
            author: author,
            created_at: created_at
        });
        // save the story
        newStory.save(function(err) {
            if (err) throw err;
            console.log('Story Done!');
        });
        res.redirect('/profile');
    });

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));


    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
