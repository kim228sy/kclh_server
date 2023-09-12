/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable import/no-extraneous-dependencies */
const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://192.168.0.106:1884');
const topic = 'edukit1';

client.on('message', (topic, message) => {
  message = message.toString();
  console.log(message);
});

client.on('connect', () => {
  client.subscribe(topic);
});
