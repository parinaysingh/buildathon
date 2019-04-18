const express = require('express')
    , app = express()
    , bodyParser = require('body-parser')
    , mongoose = require('mongoose')
    , dotenv = require('dotenv')
    , Promise = require('bluebird')
    , auth = require('./routes/auth')
    // , posts = require('./routes/posts')
    // , contribs = require('./routes/contribs')
    , compression = require('compression')
    , path = require('path');

dotenv.config();

mongoose.connect(process.env.MONGODB_URL, {useMongoClient: true});
mongoose.Promise = Promise;
mongoose.connection.on('open', () => {
    console.log('connected to db')
});

app.use(compression());
app.use(bodyParser.json({
    limit: '20mb'
}));
app.use(bodyParser.urlencoded({
    limit: '20mb',
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: 122894884
}));
//
app.use('/auth', auth);
// // app.use('/posts', posts);
// // app.use('/contribs', contribs);

app.get('/', function (req, res) {
    res.json({
        headers: req.headers
    })
});

app.listen(8080, function () {
    console.log("Listening on localhost:8080")
});


