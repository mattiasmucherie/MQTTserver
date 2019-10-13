const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const morgan = require("morgan");
const MqttHandler = require("./mqttHandler");

var app = express();
app.use(express.static(path.join(__dirname, "/../client/build")));
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("combined"));

var mqttClient = new MqttHandler();
mqttClient.connect();

// Routes
app.post("/send-mqtt", function(req, res) {
  if (req.body.message) {
    console.log(`Sending message ${req.body.message}`);
    mqttClient.sendMessage(req.body.message);
  }
  res.status(200).send("Message sent to mqtt");
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/../client/build/index.html"));
});

var server = app.listen(port, function() {
  console.log("app running on port.", server.address().port);
});
