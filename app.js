const cluster = require('cluster');

if (cluster.isMaster) {

    const cpuCount = require('os').cpus().length;

    for (let i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

} else {
const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const Strategy = require('passport-local').Strategy;
const authUtils = require('./utils/auth');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.mongo_products, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
});

MongoClient.connect(process.env.mongo_users, (err, client) => {
  if (err) {
    throw err;
  }
  { useNewUrlParser: true }
  { useUnifiedTopology: true }
  { useCreateIndex: true }
  const db = client.db(process.env.db_clients);
  const users = db.collection(process.env.db_clients_collection);
  app.locals.users = users;
});

const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const products = require('./routes/products');
const tenders = require('./routes/tenders');

const hbs = exphbs.create({
  defaultLayout: 'default',

  helpers: {
    color: function(a, b, opts) {
      if (a == b) {
          return opts.fn(this);
      }
  },
    status: function(c, d, opts) {
      if (c == d) {
          return opts.fn(this);
      }
  },
    priceFixed: function(value, options) {
      var dl = options.hash['decimalLength'] || 2;
      var ts = options.hash['thousandsSep'] || ',';
      var ds = options.hash['decimalSep'] || '.';

      var value = parseFloat(value);

      var re = '\\d(?=(\\d{3})+' + (dl > 0 ? '\\D' : '$') + ')';

      var num = value.toFixed(Math.max(0, ~~dl));

      return (ds ? num.replace('.', ds) : num).replace(new RegExp(re, 'g'), '$&' + ts);

    },
    divideMyThings: function(thing1, thing2) {
      return thing1[0].item / thing2[0].item;
    },
    divideMyThingsArray: function(thing1, thing2) {
      return thing1 * thing2;
    }
  }
})

app.engine('handlebars', hbs.engine );
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect('landing')
  } else {
    res.render('index-non-auth', { layout: 'non-auth' })
  }
})
app.get('/landing', (req, res) => {
  res.render('index', { layout: 'main' })
})

passport.use(new Strategy(
	(username, password, done) => {
	  app.locals.users.findOne({ username }, (err, user) => {
		if (err) {
		  return done(err);
		}
  
		if (!user) {
		  return done(null, false);
		}
  
		if (user.password != authUtils.hashPassword(password)) {
		  return done(null, false);
		}
  
		return done(null, user);
	  });
	}
  ));
  
passport.serializeUser((user, done) => {
done(null, user._id);
});

passport.deserializeUser((id, done) => {
done(null, { id });
});

app.use(session({
  name: 'sid',
  cookie: {
    maxAge: 1000 * 60 * 60 * 2,
    sameSite: true
  },
	secret: process.env.secrete,
	resave: false,
	saveUninitialized: false,
}));
  
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated();
  next();
});

app.use('/products', products);
app.use('/tenders', tenders);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

// 404
app.use((req, res, next) => {
    const err = new Error('not found');
    err.status = 404;
    next(err);
})

app.use((error, req, res, next) => {
    const err = app.get('env') === 'development' ? err: {};
    const status = err.status || 500;
})

const port = app.get('port') || process.env.PORT;
app.listen(port, () => console.log(`Server is listening on port ${port}`));
}
