'use strict';

const Logger = require('./Log');

class DiscordiaCommand {
	constructor(bot, opts) {
		if (!opts.name) return new Error('A name is required for a command');
		if (typeof opts.name !== 'string') return new Error('Command name should be a string')
		if (opts.aliases && !Array.isArray(opts.aliases)) new Logger().warn("aliases should be an array of strings");
		if (opts.examples && !Array.isArray(opts.examples)) new Logger().warn("examples should be an array of strings")

		this.bot = bot;
		this.settings = {
			name: opts.name,
			aliases: Array.isArray(opts.aliases) ? opts.aliases : [],
			hidden: opts.hidden,
			description: opts.description || 'No description set.',
			usage: opts.usage || 'No usage format set.',
			examples: Array.isArray(opts.examples) ? opts.examples : [],
			devOnly: opts.devOnly
		};
	}

	run() {
		new Logger().commands(`${this.settings.name} command is running, using the default function.`)
	}
}

module.exports = DiscordiaCommand;
