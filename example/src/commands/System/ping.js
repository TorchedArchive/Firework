const Discordia = require('../../../../index');

class PingCommand extends Discordia.Command {
	constructor(bot) {
		super(bot, {name: 'ping'});
	}

	run(msg) {
		const start = Date.now();
		msg.channel.createMessage('Pong...?').then(m => {
			m.edit({
				content: '',
				embed: {
					template: true,
					description: `❤️ Websocket: \`${this.bot.shards.get(0).latency}ms\`
					📬 Message: \`${Date.now() - start}ms\``
				}
			});
		});
	}
}

module.exports = PingCommand;
