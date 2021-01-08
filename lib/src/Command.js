'use strict';

class FireworkCommand {
	constructor(bot, opts) {
		this.bot = bot;
		if (!opts.name) throw new Error('A name is required for a command.');
		if (typeof opts.name !== 'string') throw new TypeError('The command\'s name should be a string.');
		if (opts.aliases && !Array.isArray(opts.aliases)) bot.logger.warn('Aliases should be an array of strings.');
		if (opts.examples && !Array.isArray(opts.examples)) bot.logger.warn('Examples should be an array of strings.');
		
		this.settings = {
			name: opts.name,
			aliases: Array.isArray(opts.aliases) ? opts.aliases : [],
			category: opts.category || 'Unspecified',
			description: opts.description || 'No description set.',
			devOnly: !!opts.devOnly,
			examples: Array.isArray(opts.examples) ? opts.examples : [],
			hidden: !!opts.hidden,
			usage: opts.usage || 'No usage format set.'
		};
	}

	run() {
		this.bot.logger.commands(`The {bold}${this.settings.name}{bold-off} command has not been implemented yet.`);
	}

	executor(fn) {
		if (typeof fn !== 'function') throw new TypeError('Expected executor to be a function');
		// Yes i know this looks weird no i won't make it better
		this.run = (...args) => fn.bind(this, ...args, this.bot)();
		return this;
	}
}

module.exports = FireworkCommand;
