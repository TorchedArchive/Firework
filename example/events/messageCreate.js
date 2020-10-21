const Firework = require('../../lib');

class MessageCreateEvent extends Firework.Event {
	constructor(bot) {
		super(bot, {name: 'messageCreate'})
	}

	run(msg) {
		const prefix = '!';
		if (msg.author.bot) return;
		if (!msg.content.startsWith(prefix)) return;		

		const args = msg.content.slice(prefix.length).trim().split(' ');
		const command = args.shift().toLowerCase();

		try {
			if (!this.bot.commands.has(command)) return;
			const cmd = this.bot.commands.get(command) || this.bot.commands.get(this.bot.aliases.get(command));

			cmd.run({msg, args});
		} catch (err) {
			this.bot.logger.error(err);
		}
	}
}

module.exports = MessageCreateEvent;