var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var request = require('request-promise');

var app = express();

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({extended: false}));

app.post("/", function(req, res, next) {
  res.type("text");
  switch (req.body.command) {
    case "/whereis":
      var user = req.body.text;
      if (user[0] === "@") user = user.slice(1);
      var url = "https://calendar.google.com/calendar/embed?mode=AGENDA&amp;height=600&amp;wkst=1&amp;bgcolor=%23FFFFFF&amp;src=" + user + "%40goodeggs.com&amp;color=%2329527A&amp;ctz=America%2FLos_Angeles"
      res.status(200).send("Click to open <" + url + "|@" + user + "'s calendar>");
      break;

    case "/helpscout":
      var newConvo = req.body.text.split(" ");
      var customer = newConvo[0];
      var mailbox = newConvo[1];
      var removeItems = newConvo.splice(0, 2);
      var subject = newConvo.toString(",").replace(/,/g, " ");

      if (mailbox === "it") {
        mailbox = 19176;
      } else if (mailbox === "devops") {
        mailbox = 98082;
      }
      else if (mailbox === "ops-eng") {
        mailbox = 23490;
      }
      else if (mailbox === "shopping") {
        mailbox = 35872;
      } else {
        throw Error;
      }

      var conversation = {
        "type": "email",
        "customer": {
          "email": customer,
          "type": "customer"
        },
        "subject": subject,
        "mailbox": {
          "id": mailbox
        },
        "tags": [
          "source-human",
          "source-slack"
        ],
        "threads": [
          {
            "type": "customer",
            "createdBy": {
              "email": customer,
              "type": "customer"
            },
            "body": "This ticket was created via slack."
          }
        ]
      }

      request.post("https://api.helpscout.net/v1/conversations.json", {
        auth: {
          user: process.env.HELPSCOUT,
          password: process.env.HELPSCOUT_PASSWORD
        },
        body: conversation,
        json: true,
        resolveWithFullResponse: true,
      })
      .then(function(response) {
        //do some stuff
        var url = response.headers.location
        ticket = url.split('/').pop().split('.').shift();
        return res.send("Helpscout Ticket: " + "https://secure.helpscout.net/conversation/" + ticket);
      })
      .catch(function(err) {
        res.send(err);
      })
      break;

    default:
      next();
  }
});


app.use(function(req, res, next) {
  res.status(404).send("command not found");
});

var server = app.listen(process.env.PORT || "3000", "0.0.0.0", function() {
  console.log("listening on " + server.address().address + ":" + server.address().port);
});

process.once('SIGTERM', server.close.bind(server));
process.once('SIGINT', server.close.bind(server));
