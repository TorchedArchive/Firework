'use strict';

const Eris = require('eris');
const Collection = require('./Collection');
const Log = require('./Log');
const utils = require('./Utils');
const fs = require('fs');
const path = require('path').posix;

class DiscordiaClient extends Eris.Client {
	constructor(config, options = {}) {
		if (Array.isArray(config) || typeof config !== 'object' && config !== null) throw new TypeError('"config" has to be an object');
		if (Array.isArray(options) || typeof options !== 'object' && options !== null) throw new TypeError('"config" has to be an object');

		if (!config.token && !options.env) throw new Error('Missing field "token" in config.');
		if (options.env) {
			try {
				require('dotenv').config();
			} catch (err) {
				throw new Error('Missing dotenv package which is required for environment variables.');
			}
		}
		super(options.env ? process.env.TOKEN : config.token, options);

		this.config = config;
		this._options = Object.assign({
			templateEmbed: {},
			clientValues: {}
		}, options);
		this.commands = new Collection();
		this.commands.aliases = new Collection();
		this.logger = new Log(this._options.loggaby);

		if (Array.isArray(this._options.clientValues) || typeof this._options.clientValues !== 'object' && this._options.clientValues !== null) throw new TypeError('When specifying "clientValues" it should be an object');
		for (const key in this._options.clientValues) this[key] = this._options.clientValues[key];
	}
	
	addTemplateValues(embed) {
		if (Array.isArray(embed) || typeof embed !== 'object' && embed !== null) throw new TypeError('templateEmbed has to be an object');
		return this._options.templateEmbed = utils.objDeepMerge(this._options.templateEmbed, embed);
	}

	createMessage(channelID, content, file) {
		if (content || content === null) {
			if (typeof content !== 'object' || content === null) content = {content: `${content}`};
			else if ((content.content || content.content === null) && typeof content.content !== 'string') content.content = `${content.content}`;
			else if ((content.content || content.content === null) && !content.embed && !file) return Promise.reject(new Error('No content, file, or embed'));
			
			content['allowed_mentions'] = this._formatAllowedMentions(content.allowedMentions); // eslint-disable camelcase
			content.embed = content.embed || {};
			if (content.embed.template) Object.assign(content.embed, this._options.templateEmbed);
		} else if (!file) {
			return Promise.reject(new Error('No content, file, or embed'));
		}
		return this.requestHandler.request('POST', `/channels/${channelID}/messages`, true, content, file).then((message) => new Eris.Message(message, this));
	}

	editMessage(channelID, messageID, content) {
		if (content || content === null) {
			if (typeof content !== 'object' || content === null) content = {content: `${content}`};
			else if ((content.content || content.content === null) && typeof content.content !== 'string') content.content = `${content.content}`;
			else if ((content.content || content.content === null) && !content.embed && (content.flags || content.flags === null)) content['allowed_mentions'] = this._formatAllowedMentions(content.allowedMentions);
			
			content.embed = content.embed || {};
			if (content.embed.template) Object.assign(content.embed, this._options.templateEmbed);
		}
		return this.requestHandler.request('PATCH', `/channels/${channelID}/messages/${messageID}`, true, content).then((message) => new Eris.Message(message, this));
	}

	initCommands(dir) {
		if (!fs.existsSync(dir)) throw new Error(`Could not find directory "${dir}" to load commands from`);
		const categories = fs.readdirSync(dir, {withFileTypes: true}).filter(f => f.isDirectory());

		for (const c of categories) {
			const commands = fs.readdirSync(path.join(dir, c.name), {withFileTypes: true}).filter(f => !f.isDirectory() && f.name.split('.').pop() === 'js').map(f => f.name.slice(0, -3));
			if (commands.length === 0) return this.logger.commands(`None found for category "${c.name}"`);

			let loaded = 0;
			for (const cmd of commands) {
				try {
					const props = new (require(path.join(dir, c.name, `${cmd}.js`)))(this);
					props.settings.category = c.name;
					this.commands.set(props.settings.name, props);
					for (const a of props.settings.aliases) this.commands.aliases.set(a, props.settings.name);
					this.logger.commands(`${cmd} loaded successfully`);
					loaded++;
				} catch (err) {
					this.logger.error(err.message);
				}
			}
			this.logger.commands(`Loaded ${loaded}/${commands.length} commands in the ${c.name} category`);
		}
	}

	overrideTemplateEmbed(embed) {
		if (Array.isArray(embed) || typeof embed !== 'object' && embed !== null) throw new TypeError('templateEmbed has to be an object');
		return this._options.templateEmbed = embed;
	}

};

module.exports = DiscordiaClient;
