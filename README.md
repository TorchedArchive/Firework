<div align="center">
	<h2>Firework</h2>
	<blockquote align="center">🎆 Command framework and utilities for the Eris Discord library.</blockquote>
	<img src="https://app.fossa.com/api/projects/git%2Bgithub.com%2FLuvella%2FFirework.svg?type=shield" href="https://app.fossa.com/projects/git%2Bgithub.com%2FLuvella%2FFirework?ref=badge_shield">
	<p>
    	Firework is a simple, easy to use command framework for <a href="https://abal.moe/Eris/">Eris</a>. It mostly only helps you with loading, managing, etc. and leaves running the command and anything else to the user (you). 
    	<hr>
	</p>
</div>

## Table of Contents
- [Install](#install)
- [Example](#example)
- [Links](#links)
- [License](#license) 

### Install 
`npm install @luvella/firework`

### Example
[See here](example/) for an example bot.  

Or...  
```js
const Firework = require('@luvella/firework');
const bot = new Firework.Client('token');

const ping = new Firework.Command(bot, {
	name: 'ping',
	aliases: ['pong']
}).executor(function ({ msg, args }) {
	msg.channel.createMessage(`Ponged ${args[0]}!`);
	// Think of `this.bot` as `bot`
	this.bot.logger.debug('ponged');
});
bot.addCommand(ping);

bot.on('messageCreate', (msg) => {
	const prefix = '!';
	if (!msg.content.startsWith(prefix)) return;

	const args = msg.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

	const cmd = bot.getCommand(command); // works with the name and aliases as well
	if (!cmd) return;

	cmd.run({ msg, args });
})
```

### Links
- Documentation: Soon at https://luvella.github.io/Firework
- Alternative(s)
  - [hibiscus](https://github.com/hibiscus-eris/hibiscus) for a higher level solution

### License
Firework is licensed under the MIT license.  
[Read here](LICENSE) for more info.


[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FLuvella%2FFirework.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FLuvella%2FFirework?ref=badge_large)
