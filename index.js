const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser')
const app = express();
const routes = require('./routes')
const flash = require('connect-flash')
const session = require('express-session');
const cookieParser = require('cookie-parser')
const database = require('./lib/database')
const Store = require('./models/store')
const sendMessage = require('./lib/sendMessage')
const morgan = require('morgan')
const lineBot = require('./resources/line')

nunjucks.configure('views', {
    autoescape: true,
    express: app,
    watch: true
});
app.use(lineBot)
// app.use('', require('./resources/line'))
app.use(morgan('dev'))
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use(session({
    name: 'session',
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 2592000000 },
    secret: 'J4ck1in'
}));
app.use(flash());
routes(app);

database.connect()



let port = process.env.PORT || 3000


app.listen(port), console.log("Server is listening on", port)