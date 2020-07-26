const Discordia = require('../index');
const bot = new Discordia.Client(require('./config.json'), {
	env: true,
	templateEmbed: {
		color: 0x38B1D0,
		timestamp: new Date()
	},
	clientValues: {
		version: require('./package.json').version,
		dev: '439373663905513473' // Feel free to change this to your user id :)
	}
});

bot.initCommands(`${__dirname}/src/commands`);
bot.on('ready', () => {
	bot.addTemplateValues({
		author: {
			'icon_url': bot.user.avatarURL,
			name: bot.user.username
		},
		footer: {text: `Running v${bot.version}`}
	});
	bot.logger.log(`${bot.user.username} is online, running v${bot.version}.`);
});

bot.on('messageCreate', (msg) => {
	if (msg.author.bot) return;
	if (msg.channel.type === 'dm') return;

	const mssg = msg.content.toLowerCase() || msg.content.toUpperCase();
	const prefixes = [`<@!${bot.user.id}> `, `<@${bot.user.id}>`, 'bot ', 'b^'];
	let prefix = false;
	for (const pref of prefixes) if (mssg.startsWith(pref)) prefix = pref;

	if (!prefix) return;
	bot.addTemplateValues({footer: {'icon_url': msg.author.avatarURL} });

	const args = msg.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();
	try {
		if (!bot.commands.has(command)) return;
		const cmd = bot.commands.get(command) || bot.commands.get(bot.commands.aliases.get(command));

		if (cmd.settings.devOnly && msg.author.id !== bot.dev || cmd.settings.category === 'Developer' && msg.author.id !== bot.dev) {
			return msg.channel.createMessage({
				embed: {
					template: true,
					description: 'As this is a developer only command, you are not allowed to run it.'
				}
			});
		}
		cmd.run(msg, args, prefix);
	} catch (err) {
		bot.logger.error(err);
	}
});

bot.on('messageUpdate', (msg) => bot.emit('messageCreate', msg));

bot.connect();
