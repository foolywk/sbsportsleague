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
  nodemailer = require("nodemailer");  
  mcapi = require('mailchimp-api');
  mc = new mcapi.Mailchimp(clientSecrets.mcapiKey);
  list_id = clientSecrets.mcListId;
  transport = nodemailer.createTransport("SMTP", {
    service : "Gmail",
    auth: {
        user: "justin@sbsportsleague.com",
        pass: clientSecrets.gmailPass
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
app.post('/subscribe', function (req, res) {

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

app.post('/signup', function (req,res) {

    var mailOptions = {
        from: "justin@sbsportsleague.com", 
        to: "hello@sbsportsleague.com, " + req.body.EMAIL, // list of receivers
        subject: "Silicon Beach Sports Volleyball Tournament!", // Subject line
        generateTextFromHTML: true,
        html: "<p> Hey! </p> <p>My name is Justin, a startup entrepreneur living near the sands of Silicon Beach. Everyday, we see gorgeous beaches and an awesome community engaging in entrepreneurship and technology. My buddies and I have a vision for what our startup community could be in Los Angeles. It's about time we all meet up and play some sports together! :)</p> <p>I am excited to bring to you the Silicon Beach Sports League which will be an environment for you and your coworkers to build connections while staying fit! We plan to schedule all sorts of games: soccer, volleyball, ultimate frisbee, basketball, golf, and of course...DODGEBALL!</p> <p>In the wake of the recent Ebola Outbreak in African Countries, we have decided their inaugural Volleyball Tournament will be held in benefit of a charity that is in the position to provide aid. <a href='www.villagecare.com'>Village Care International</a> is a unique cause that enables lasting change in villages across 13 countries on the African continent. An entrance fee will be charged to teams with 100% of proceeds going directly to aid of those in Villages that need help. We ask that each team volley for the cause by donating $250 to Village Care International by following this link: <a href='http://villagecare.com'>Village Care International</a>.</p> <p>The Tournament will be held on Sunday, August 24th in Hermosa Beach with an after party at Ocean Bar & Lounge...oh yes! Each team will have 4 players! There will be 8 teams! First place will receive a secret prize from the Mayor of Hermosa Beach. </p> <p>See you on the sand at 1 pm :)</p><p><b>Justin Brezhnev</b><br>Commissioner | Silicon Beach Sports League<br><a href='mailto@justin@sbsportaleague.com'>justin@sbsportsleague.com</a><br>310.963.9976</p>"
    }
    transport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }
        transport.close(); // shut down the connection pool, no more messages
    }); 
});

// redirect all routes to index
app.get('*', routes.index);

/**
* Start Server
*/
http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
