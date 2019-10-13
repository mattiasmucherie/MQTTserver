const mqtt = require("mqtt");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const morgan = require("morgan");

var app = express();
app.use(express.static(path.join(__dirname, "/index.html")));
const port = process.env.PORT || 3000;
class MqttHandler {
  constructor() {
    this.mqttClient = null;
    this.host = "mqtt://farmer.cloudmqtt.com:15554";
    this.username = "uebojplm";
    this.password = "OKy_58VmsWX9";
  }

  connect() {
    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
    this.mqttClient = mqtt.connect(this.host, {
      username: this.username,
      password: this.password
    });

    // Mqtt error calback
    this.mqttClient.on("error", err => {
      console.log(err);
      this.mqttClient.end();
    });

    // Connection callback
    this.mqttClient.on("connect", () => {
      console.log(`mqtt client connected`);
    });

    // mqtt subscriptions
    this.mqttClient.subscribe("mytopic", { qos: 0 });

    // When a message arrives, console.log it
    this.mqttClient.on("message", function(topic, message) {
      console.log(message.toString());
    });

    this.mqttClient.on("close", () => {
      console.log(`mqtt client disconnected`);
    });
  }

  // Sends a mqtt message to topic: mytopic
  sendMessage(message) {
    this.mqttClient.publish("test", message);
  }
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("combined"));
var mqttClient = new MqttHandler();
mqttClient.connect();

// Routes

app.post("/send-mqtt", function(req, res) {
  if (req.body.message) {
    mqttClient.sendMessage(req.body.message);
  }
  // console.log(req.body.message);
  // mqttClient.sendMessage(req.body.message);
  res.status(200).send("Message sent to mqtt");
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

var server = app.listen(port, function() {
  console.log("app running on port.", server.address().port);
});
