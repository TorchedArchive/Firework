const Client = require('./src/Client');

function Firework(conf, options) {
	return new Client(conf, options);
}

Firework.Client = Client;
Firework.Collection = require('./src/Collection');
Firework.Command = require('./src/Command');

module.exports = Firework;
