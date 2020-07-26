const Discordia = require('../../../../index');

class StatsCommand extends Discordia.Command {
	constructor(bot) {
		super(bot, {name: 'stats'});
	}

	run(msg) {
		msg.channel.createMessage({
			embed: {
				template: true, 
				description: `⚒️ Library: [Discordia \`${Discordia.version}\`](https://github.com/Luvella/Discordia) Eris \`${Discordia.erisVersion}\`
				🏘️ Guilds: ${this.bot.guilds.size}`
			}
		});
	}
}

module.exports = StatsCommand;
