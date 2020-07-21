'use strict';

const Eris = require('eris');
const Collection = require('./Collection');
const Log = require('./Log');

class DiscordiaClient extends Eris.Client {
	constructor(config, options = {}) {
		if (Array.isArray(config) || typeof config !== 'object' && config !== null) throw new TypeError('"config" has to be an object.');
		if (Array.isArray(options) || typeof options !== 'object' && options !== null) throw new TypeError('"config" has to be an object.');

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
		this.commands = new Collection();
		this.aliases = new Collection();
		this.log = new Log(this.options.loggaby);
	}

	createMessage(channelID, content, file) {
		if (content || content === null) {
			if (typeof content !== 'object' || content === null) {
				content = {content: '' + content};
			} else if(content.content !== undefined && typeof content.content !== 'string') {
				content.content = '' + content.content;
			} else if(!content.content === undefined && !content.embed && !file) {
				return Promise.reject(new Error('No content, file, or embed'));
			}
			content.allowed_mentions = this._formatAllowedMentions(content.allowedMentions); // eslint disable camelcase
			if (content.embed.generic) Object.assign(content.embed, this.config.genericEmbed)
		} else if(!file) {
			return Promise.reject(new Error('No content, file, or embed'));
		}
		return this.requestHandler.request('POST', `/channels/${channelID}/messages`, true, content, file).then((message) => new Eris.Message(message, this));
	}
};

module.exports = DiscordiaClient;
