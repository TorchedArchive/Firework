'use strict';

class FireworkCommand {
	constructor(bot, opts) {
		this.bot = bot;
		if (!opts.name) throw new Error('A name is required for a command.');
		if (typeof opts.name !== 'string') throw new Error('The command\'s name should be a string.');
		if (opts.aliases && !Array.isArray(opts.aliases)) bot.logger.warn('Aliases should be an array of strings.');
		if (opts.examples && !Array.isArray(opts.examples)) bot.logger.warn('Examples should be an array of strings.');
		
		this.settings = {
			name: opts.name,
			aliases: Array.isArray(opts.aliases) ? opts.aliases : [],
			hidden: opts.hidden || false,
			description: opts.description || 'No description set.',
			usage: opts.usage || 'No usage format set.',
			examples: Array.isArray(opts.examples) ? opts.examples : [],
			devOnly: opts.devOnly || false
		};
	}

	run() {
		this.bot.logger.commands(`The {bold}${this.settings.name}{bold-off} command has not been implemented yet.`)
	}
}

module.exports = FireworkCommand;
