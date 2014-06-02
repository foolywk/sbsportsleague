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
  nodemailer = require("nodemailer");  
  transport = nodemailer.createTransport("SMTP", {
    host: "smtpout.secureserver.net",
	secureConnection: true,
	port: 465,
    auth: {
        user: "mail@bruinentrepreneurs.org",
        pass: clientSecrets.mailPass
    }
});

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

// Mailchimp Email Registration
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

// Contact Form Nodemailer 
app.post('/sendMail', function (req, res) {

    var mailOptions = {
        from: req.body.email, 
        to: "brandon@bruinentrepreneurs.org", // list of receivers
        subject: req.body.name + ": " + req.body.subject, // Subject line
        generateTextFromHTML: true,
        html: req.body.message + 
        	  "<br><br>" +
        	  "--<br>" +
        	  "Sent with love from bruinentrepreneurs.org"
    }
    
    transport.sendMail(mailOptions, function(error, response){
        if(error) {
            console.log(error);
        } else {
            console.log("Message sent: " + response.message);
        }
        transport.close(); // shut down the connection pool, no more messages
    }); 
    res.render('mailConfirmation')
});


// redirect all routes to index
app.get('*', routes.index);

/**
* Start Server
*/

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
