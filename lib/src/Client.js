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

/**
 * Firework Client class.
 * @module Firework
 * @extends {Eris.Client}
 */
class FireworkClient extends Eris.Client {
	/**
	 * Create a new Firework client.
	 * @param  {object | string} [config] Bot's config or token
	 * @param  {object} [options] Client options
	 * @param  {boolean} [options.connectOnDeclare=true] Whether to try to connect to Discord on Client declaration
	 * @param  {object} [options.logger] Class for logging 
	 * @return {FireworkClient}
	 */
	constructor(config = {}, options = {}) {
		if (options.env) {
			try {
				require('dotenv').config();
			} catch (err) {
				throw new Error('missing dotenv package which is required for environment variables');
			}
		}

		const token = options.env ? process.env[options.env] : config.token;
		super(typeof config === 'string' ? config : token, options);

		Object.assign(this.options, {
			connectOnDeclare: true,
			logger
		}, options);

		this.aliases = new Collection();
		this.commands = new Collection();
		this.commands.categories = [];
		this.logger = this.options.logger;

		if (this.options.connectOnDeclare) this.connect();
		if (typeof config !== 'string') this.config = config;
	}

	addCommand(cmd) {
		if (this.getCommand(cmd.settings.name)) return;
		this.commands.fileName = null;
		if (!this.commands.categories.includes(cmd.settings.category)) this.commands.categories.push(cmd.settings.category)

		this.commands.set(cmd.settings.name, cmd);
		for (const a of cmd.settings.aliases) this.aliases.set(a, cmd.settings.name);

		return this;
	}

	getCommand(name) {
		const cmd = this.commands.get(name) || this.commands.get(this.aliases.get(name));
		if (!cmd) return null;

		return cmd;
	}

	/**
	 * Loads all commands in <code>dir</code>
	 * @param  {string} dir 
	 * @return {this}
	 */
	loadCommands(dir) {
		if (!fs.existsSync(dir)) throw new Error(`Path '${dir}' does not exist`);
		const categories = fs.readdirSync(dir, {withFileTypes: true}).filter(f => f.isDirectory()).map(f => f.name);

		for (let i = 0; i < categories.length; i++) {
			const commands = fs.readdirSync(`${dir}/${categories[i]}`, {withFileTypes: true}).filter(f => !f.isDirectory() && f.name.split('.').pop() === 'js').map(f => f.name.slice(0, -3));
			if (commands.length === 0) return this.logger.commands('None found for category', categories[i]);
			this.commands.categories.push(categories[i]);

			let loaded = 0;
			for (let j = 0; j < commands.length; j++) {
				const cmd = commands[j];
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

		return this;
	}

	/**
	 * Loads all events in <code>dir</dir> and listens to them
	 * @param  {string} dir Should have <code>./</code> at the beginning
	 * @return {this}
	 */
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

		return this;
	}
}

module.exports = FireworkClient;
