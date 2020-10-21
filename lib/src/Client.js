'use strict';
const Collection = require('./Collection');

const Eris = require('eris');
const Loggaby = require('loggaby');
const logger = new Loggaby({
	levels: [{
		name: 'Commands',
		color: 'magenta'
	}]
});

class FireworkClient extends Eris.Client {
	constructor(conf = {}, options = {}) {
		if (options.env) {
			try {
				require('dotenv').config();
			} catch (err) {
				throw new Error('Missing dotenv package which is required for environment variables.');
			}
		}

		const token = options.env ? process.env[options.env] : conf.token;
		super(typeof conf === 'string' ? conf : token, options);

		Object.assign(this.options, {
			connectOnDeclare: true,
			logger
		}, options);

		this.aliases = new Collection();
		this.commands = new Collection();
		this.logger = this.options.logger;
		if (this.options.connectOnDeclare) this.connect();
	}

	loadEvents(dir) {
		// TODO
	}
}

module.exports = FireworkClient;
