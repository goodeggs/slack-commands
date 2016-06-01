var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
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
