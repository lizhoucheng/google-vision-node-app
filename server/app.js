const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const Vision = require('@google-cloud/vision');
const fs = require('fs');

var gCloudConfig = {
  keyFilename: 'your key file path',
  projectId: 'your project id'
};

var visionClient = new Vision.ImageAnnotatorClient(gCloudConfig);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());
app.use('/public', express.static(__dirname + '/public'));

app.post('/upload', (req, res, next) => {
  let imageFile = req.files.file;
  const imageFilePath = `${__dirname}/public/${imageFile.name}`;
  var types = ['labels'];
  let contents = [];

  imageFile.mv(imageFilePath, async function(err) {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    try {
      const visionResults = await visionClient.labelDetection(imageFilePath);
      let labels = [];
      visionResults[0].labelAnnotations.forEach(label => labels.push(label.description));
      contents.push(`Labels: ${labels.join(', ')}`);
      // contents.push.apply(contents, await generateContent('_all', labels));
    } catch(err) {
      console.log(err)
    } finally {
      fs.unlinkSync(imageFilePath);
      
      res.json({
        result: contents
      });
    }
  });
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(8000, () => {
  console.log('8000');
});

module.exports = app;