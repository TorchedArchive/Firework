const Discordia = require('../index');
const bot = new Discordia.Client(require('./config.json'), {env: true});

bot.on('messageCreate', (msg) => {
	if (msg.author.bot) return;
	if (msg.channel.type === 'dm') return;

	const mssg = msg.content.toLowerCase() || msg.content.toUpperCase();
	const prefixes = [`<@!${bot.user.id}>`, `<@${bot.user.id}>`, 'bot ', 'v, '];
	let prefix = false;
	for (const pref of prefixes) if (mssg.startsWith(pref)) prefix = pref;

	if (!prefix) return;

	const args = msg.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();
	try {
		if (!['ping'].includes(command)) return;
		msg.channel.createMessage({embed: {generic: true} });
	} catch (err) {
		bot.log.error(err);
	}
});

bot.connect();
