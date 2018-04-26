const order = require('./order')
const store = require('./store')
const admin = require('./admin')

module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('signin.html')
    })
    order(app);
    store(app);
    admin(app);

    app.get('*', function(req, res) {
        res.render('404.html', {
            title: '404',
        });
    })
}