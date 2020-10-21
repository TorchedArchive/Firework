'use strict';
const Collection = require('./Collection');

const Eris = require('eris');
const fs = require('fs');
const Loggaby = require('loggaby');
const logger = new Loggaby({
	levels: [
		{
			name: 'Commands',
			color: 'magenta'
		},
		{
			name: 'Events',
			color: 'blue'
		}
	]
});

class FireworkClient extends Eris.Client {
	constructor(conf = {}, options = {}) {
		if (options.env) {
			try {
				require('dotenv').config();
			} catch (err) {
				throw new Error('missing dotenv package which is required for environment variables');
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

	loadCommands(dir) {
		if (!fs.existsSync(dir)) throw new Error(`Path '${dir}' does not exist`);
		const categories = fs.readdirSync(dir, {withFileTypes: true}).filter(f => f.isDirectory()).map(f => f.name);

		for (let i = 0; i < categories.length; i++) {
			const commands = fs.readdirSync(`${dir}/${categories[i]}`, {withFileTypes: true}).filter(f => !f.isDirectory() && f.name.split('.').pop() === 'js').map(f => f.name.slice(0, -3));
			if (commands.length === 0) return this.logger.commands('None found for category', categories[i]);

			let loaded = 0;
			for (let i = 0; i < commands.length; i++) {
				const cmd = commands[i];
				try {
					const _cmd = require(`${process.cwd()}/${dir}/${categories[i]}/${cmd}`)
					const props = new _cmd(this);
					props.settings.category = categories[i];
					props.fileName = cmd;

					this.commands.set(props.settings.name, props);
					for (const a of props.settings.aliases) this.aliases.set(a, props.settings.name);

					this.logger.commands(props.settings.name, 'loaded successfully.');
					loaded++;
				} catch(e) {
					this.logger.error('\b', e, '\nFrom the command', cmd);
				}
			}
			this.logger.commands(`Loaded ${loaded}/${commands.length} commands in the ${categories[i]} category`);
		}
	}

	loadEvents(dir) {
		if (!fs.existsSync(dir)) throw new Error(`Path '${dir}' does not exist`);
		const events = fs.readdirSync(dir, {withFileTypes: true}).filter(f => !f.isDirectory() && f.name.split('.').pop() === 'js').map(f => f.name.slice(0, -3));
		
		for (let i = 0; i < events.length; i++) {
			const ename = events[i];
			try {
				const _event = require(`${process.cwd()}/${dir}/${ename}.js`)
				const event = new _event(this);
				event.fileName = ename;

				this.on(event.settings.name, (...args) => event.run(...args));
				this.logger.events(event.settings.name, 'loaded successfully.');
			} catch(e) {
				this.logger.error('\b', e, '\nFrom the event', ename)
			}
		}
	}
}

module.exports = FireworkClient;
