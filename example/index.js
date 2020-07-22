const Discordia = require('../index');
const bot = new Discordia.Client(require('./config.json'), {
	env: true,
	genericEmbed: {
		color: 0x38B1D0,
		timestamp: new Date()
	},
	clientValues: {version: require('./package.json').version}
});

bot.on('ready', () => {
	bot.addGenericValues({
		author: {
			'icon_url': bot.user.avatarURL,
			name: bot.user.username
		},
		footer: {text: `Version ${bot.version}`}
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
	bot.addGenericValues({footer: {'icon_url': msg.author.avatarURL} });

	const args = msg.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();
	try {
		switch (command) {
			case 'ping':
				msg.channel.createMessage('Pong...?').then(m => {
					m.edit({
						content: '',
						embed: {
							generic: true,
							color: 0x47aef0,
							description: `📬 Latency: \`${bot.shards.get(0).latency}ms\``
						}
					});
				});
				break;

			case 'embed':
				msg.channel.createMessage({embed: {generic: true, description: 'hi lul'} });
				break;

			case 'stats':
				msg.channel.createMessage({
					embed: {
						generic: true, 
						color: 0x47aef0,
						description: `⚒️ Library: [Discordia \`${Discordia.version}\`](https://github.com/Luvella/Discordia) Eris \`${Discordia.erisVersion}\`
						🏘️ Guilds: ${bot.guilds.size}`
					}
				});

			// No default
		}
	} catch (err) {
		bot.logger.error(err);
	}
});

bot.on('messageUpdate', (msg) => bot.emit('messageCreate', msg));

bot.connect();
