// const signin = require('./signin')
// const signup = require('./signup')
const order = require('./order')
const store = require('./store')
const admin = require('./admin')


module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('signin.html')
    })
    // // app.use('/signup', require('./signup'))
    // signup(app);
    // signin(app);
    order(app);
    store(app);
    admin(app);
    // app.use('/signout', require('./signout'))


    app.get('*', function(req, res) {
        res.render('404.html', {
            title: '404',
        });
    })
}