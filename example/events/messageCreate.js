const Firework = require('../../lib');

class MessageCreateEvent extends Firework.Event {
	constructor(bot) {
		super(bot, {name: 'messageCreate'})
	}

	run(msg) {
		const prefix = '!';
		if (!msg.content.startsWith(prefix)) return;
		if (msg.author.bot) return;

		const args = msg.content.slice(prefix.length).trim().split(' ');
		const command = args.shift().toLowerCase();		

		try {
			const cmd = bot.getCommand(msg.content) // works with the name and aliases as well
			if (!cmd) return;

			cmd.run({ msg, args });
		} catch (err) {
			this.bot.logger.error(err);
		}
	}
}

module.exports = MessageCreateEvent;