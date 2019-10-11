const mqtt = require("mqtt");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();

class MqttHandler {
  constructor() {
    this.mqttClient = null;
    this.host = "mqtt://farmer.cloudmqtt.com:15554";
    this.username = "uebojplm"; // mqtt credentials if these are needed to connect
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
    this.mqttClient.publish("mytopic", message);
  }
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mqttClient = new MqttHandler();
mqttClient.connect();

// Routes
app.post("/send-mqtt", function(req, res) {
  mqttClient.sendMessage(req.body.message);
  res.status(200).send("Message sent to mqtt");
});

var server = app.listen(3000, function() {
  console.log("app running on port.", server.address().port);
});
