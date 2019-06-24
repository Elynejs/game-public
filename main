const Discord = require('discord.js');
const client = new Discord.Client();
const { Client, Attachment } = require('discord.js');
client.login(config.token);

//Miscallaneous variables
var playerCount = 0;
var marySue = {tier: "template", name: "Mary Sue", hp : 5000, atk : 500, def : 200, spd : 10, agi : 10, acr : 10, int : 200, mag : 2000, cd : 20, rgn : 100};
var c1 = {tier: "S", name : "Seize", hp : 3000, attack : 3000, defense : 40, vit : 8, agi : 9, acc : 6, mag : 0, int : 100};
var c2 = {};
var c3 = {};
var c4 = {};
var c5 = {};
var c6 = {};
var c7 = {};
var c8 = {};
var c9 = {};
var c10 = {};
var c11 = {};
var c12 = {};

client.on('ready', () => {
    client.user.setActivity('the game', { type: 'Playing' });
    console.log('Ready!');
});

client.on('message', msg => {
  if (msg.content === '!startgame') {
    if (playerCount === 0) {
      msg.channel.send(`${msg.author},`, " is registered as player 1! Waiting for another player...");
      var playerCount = 1;
  }else if (playerCount === 1) {
      msg.channel.send(`${msg.author},`, " is registered as player 2! Starting the game...");
      var playerCount = 2;
  }else {
      msg.reply("There is already two registered players.");
  }
  }
});
