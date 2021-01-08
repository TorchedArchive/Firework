'use strict';

class FireworkEvent {
	constructor(bot, opts) {
		this.bot = bot;
		if (!opts.name) throw new Error('A name is required for an event.');
		if (typeof opts.name !== 'string') throw new Error('The event\'s name should be a string.');
		
		this.settings = {name: opts.name};
	}

	run() {
		this.bot.logger.events(`The {bold}${this.settings.name}{bold-off} event has not been implemented yet.`);
	}

	executor(fn) {
		if (typeof fn !== 'function') throw new TypeError('Expected executor to be a function');
		// read Command.js
		this.run = (...args) => fn.bind(this, ...args, this.bot)();
		return this;
	}
}

module.exports = FireworkEvent;
