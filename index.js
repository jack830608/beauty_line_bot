const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser')
const app = express();
const routes = require('./routes')
const flash = require('connect-flash')
const session = require('express-session');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser')
const database = require('./lib/database')
const Store = require('./models/store')
const sendMessage = require('./lib/sendMessage')

nunjucks.configure('views', {
    autoescape: true,
    express: app,
    watch: true
});
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
    cookie: { maxAge: 60000 },
    secret: 'woot',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
routes(app);
database.connect()



let port = process.env.PORT || 3000


app.listen(port), console.log("Server is listening on", port)