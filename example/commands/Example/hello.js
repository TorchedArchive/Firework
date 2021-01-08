const Firework = require('../../../lib');

class HelloCommand extends Firework.Command {
	constructor(bot) {
		super(bot, {name: 'hello'});
	}

	run({msg}) {
		msg.channel.createMessage(`Hello ${msg.author.username}`);
	}
}

module.exports = HelloCommand;