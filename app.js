/* comment */
/**
 * Module dependencies
 */

var express = require('express'),
  routes = require('./routes'),
  http = require('http'),
  path = require('path'),
  engines = require('consolidate');
  clientSecrets = require('./client_secrets.json');
  mcapi = require('mailchimp-api');
  mc = new mcapi.Mailchimp(clientSecrets.mcapiKey);
  list_id = clientSecrets.mcListId;

var app = module.exports = express();

/**
* Configuration
*/

// all environments
app.set('port', process.env.PORT || 1919);
app.set('views', __dirname + '/views');
app.engine('html', engines.mustache);
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/public'));
app.use(app.router);

// development only
if (app.get('env') === 'development') {
   app.use(express.errorHandler());
};

// production only
if (app.get('env') === 'production') {
  // TODO
}; 

//mailchimp stuff
//app.post('/subscribe', api.subscribe);
//app.post('/mail', api.mail);

// Email Registration
app.post('/signup', function (req, res) {

    // mailchimp subscribe
      if (req.body && req.body.EMAIL) {
      mc.lists.subscribe({id: list_id, email:{email:req.body.EMAIL}}, function(data) {
          // res.contentType('json');
          // res.send({response:'success'});
        },
        function(error) {
          // res.contentType('json');
          // res.send({response:error.error});
      });
  } else {
    res.send({response:'could not find email'});
  }
});

// redirect all routes to index
app.get('*', routes.index);

/**
* Start Server
*/

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
