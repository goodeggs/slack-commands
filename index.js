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
        var conversation = req.body.text.split(" ")
        var mailbox = conversation[0];
        conversation.pop(0);
        var customer = conversation[0];
        var subject = conversation.pop(0).toString(",").replace(",", " ");

        if (mailbox === "it") {
          mailbox = 19176;
        } else if (mailbox === "devops" {
          mailbox = 98082;
        })
        request.post("https://api.helpscout.net/v1/conversations.json", {
          auth: {
            user: process.env.HELPSCOUT,
            password: "x"
          },
          body: {
            conversation: {
              customer: customer,
              subject: subject,
              mailbox: mailbox,
              thread: {
                type: req.body.user_name,
                createdBy: req.body.user_name,
                body: subject
              }
            }
          },
          json: true,
        })
        .then(function(res) {
          res.status(200).send("Converstation created.")
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
