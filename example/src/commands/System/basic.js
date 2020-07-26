const Discordia = require('../../../../index');

class BasicCommand extends Discordia.Command {
	constructor(bot) {
		super(bot, {
			name: 'basic',
			aliases: ['b'],
			hidden: false,
			description: 'Just a basic command',
			usage: 'basic',
			devOnly: true
		});
	}

	run(msg) {
		msg.channel.createMessage({
			embed: {
				template: true, 
				description: `Here is a basic command, showing info about itself.

Name: \`${this.settings.name}\`
Aliases: \`${this.settings.aliases}\`
Is hidden: \`${this.settings.hidden}\`
Description: \`${this.settings.description}\`
Usage: \`${this.settings.usage}\`
Example(s): \`${this.settings.examples.length === 0 ? 'None' : this.settings.examples.join(', ')}\`
Developer Only: \`${this.settings.devOnly}\``
			}
		});
	}
}

module.exports = BasicCommand;
