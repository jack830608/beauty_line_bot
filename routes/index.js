const order = require('./order')
const store = require('./store')
const admin = require('./admin')
const user = require('./user')
const init = require('./init')
module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('signin.html')
    })
    order(app);
    store(app);
    admin(app);
    user(app);
    init(app);

    app.get('*', function(req, res) {
        res.render('404.html', {
            title: '404',
        });
    })
}