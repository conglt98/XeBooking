const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;


var userController = require('./controllers/users');
passport.use(
    new GoogleStrategy({
        clientID: '626006363343-nml4fuhofnochvj65fmrh91fpu4c3hai.apps.googleusercontent.com',
        clientSecret: 'tzHaJ2RGLbIsomWMz5NgIIKC',
        callbackURL: '/auth/google/callback',
        proxy:true
    }, function (accessToken, refreshToken, profile, cb) {
        userController.findOrCreate(profile, function (user) {

            cb(null, user);
        });
    })
);

passport.use(new FacebookStrategy({
        clientID: "901895663494148",
        clientSecret: "df7ccecc5b070ee134619de69adecf5b",
        callbackURL: "/auth/facebook/callback",
        proxy:true,
        profileFields: ['id', 'displayName', 'photos', 'email']
    },
    function (accessToken, refreshToken, profile, cb) {
        profile.photos[0].value = "https://graph.facebook.com/" + profile.id + "/picture" + "?width=500&height=500" + "&access_token=" + accessToken;
        userController.findOrCreate(profile, function (user) {
            cb(null, user);
        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});



module.exports = passport;