const Discordia = require('../index');
const bot = new Discordia.Client(require('./config.json'), {env: true, clientValues: {version: require('./package.json').version} });

bot.on('ready', () => {
	bot.setGenericEmbed({
		color: 0x38B1D0,
		footer: {text: `Version ${bot.version}`},
		timestamp: new Date()
	});
	bot.log.log(`${bot.user.username} is online! Version ${bot.version}`);
});

bot.on('messageCreate', (msg) => {
	if (msg.author.bot) return;
	if (msg.channel.type === 'dm') return;

	const mssg = msg.content.toLowerCase() || msg.content.toUpperCase();
	const prefixes = [`<@!${bot.user.id}>`, `<@${bot.user.id}>`, 'bot ', 'v, '];
	let prefix = false;
	for (const pref of prefixes) if (mssg.startsWith(pref)) prefix = pref;

	if (!prefix) return;
	// TODO: change to function (Client#setGenericValue) for example.
	// eslint-disable-next-line camelcase
	bot._options.genericEmbed.footer.icon_url = msg.author.avatarURL;

	const args = msg.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();
	try {
		switch (command) {
			case 'ping':
				msg.channel.createMessage('Pong...?').then(m => {
					m.edit({
						content: 'Pong with no generics',
						embed: {
							color: 0x47aef0,
							description: `📬 Latency: \`${bot.shards.get(0).latency}ms\``
						}
					});
					setTimeout(() => {
						m.edit({
							content: 'Pong with generics',
							embed: {
								generic: true,
								color: 0x47aef0,
								description: `📬 Latency: \`${bot.shards.get(0).latency}ms\``
							}
						});
					}, 5000);
				});
				break;

			case 'wip':
				msg.channel.createMessage({embed: {generic: true, description: 'Hi, this is a WIP command as you can tell.'} });
				break;

			case 'info':
				msg.channel.createMessage({content: `This is the example bot for \`Discordia\`, located at https://github.com/Luvella/Discordia which is based on Eris.\nBelow are some stats.`, embed: {
					generic: true, 
					color: 0x47aef0,
					description: `⚒️ Library: Discordia v\`${Discordia.version}\` & Eris v\`${Discordia.erisVersion}\`
					🏘️ Guilds: ${bot.guilds.size}`
				}})
			// No default
		}
	} catch (err) {
		bot.log.error(err);
	}
});

bot.connect();
