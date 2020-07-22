'use strict';

const Eris = require('eris');
const Collection = require('./Collection');
const Log = require('./Log');

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
			genericEmbed: {},
			clientValues: {}
		}, options);
		this.commands = new Collection();
		this.aliases = new Collection();
		this.log = new Log(this._options.loggaby);

		if (Array.isArray(this._options.clientValues) || typeof this._options.clientValues !== 'object' && this._options.clientValues !== null) throw new TypeError('When specifying "clientValues" it should be an object');
		for (const key in this._options.clientValues) this[key] = this._options.clientValues[key];
	}

	createMessage(channelID, content, file) {
		if (content || content === null) {
			if (typeof content !== 'object' || content === null) {
				content = {content: `${content}`};
			else if ((content.content || content.content === null) && typeof content.content !== 'string')
				content.content = `${content.content}`;
			else if ((content.content || content.content === null) && !content.embed && !file)
				return Promise.reject(new Error('No content, file, or embed'));
			content.allowed_mentions = this._formatAllowedMentions(content.allowedMentions); // eslint-disable camelcase
			content.embed = content.embed || {};
			if (content.embed.generic) Object.assign(content.embed, this._options.genericEmbed);
		} else if (!file) {
			return Promise.reject(new Error('No content, file, or embed'));
		}
		return this.requestHandler.request('POST', `/channels/${channelID}/messages`, true, content, file).then((message) => new Eris.Message(message, this));
	}

	editMessage(channelID, messageID, content) {
		if(content || content === null) {
			if (typeof content !== 'object' || content === null) 
				content = {content: `${content}`};
			else if ((content.content || content.content === null) && typeof content.content !== 'string') 
				content.content = `${content.content}`;
			else if ((content.content || content.content === null) && !content.embed && (content.flags || content.flags === null)) {
				return Promise.reject(new Error('No content, embed or flags'));
			content.allowed_mentions = this._formatAllowedMentions(content.allowedMentions); // eslint-disable camelcase
			content.embed = content.embed || {};
			if (content.embed.generic) Object.assign(content.embed, this._options.genericEmbed);
		}
		return this.requestHandler.request('PATCH', `/channels/${channelID}/messages/${messageID}`, true, content).then((message) => new ErMessage(message, this));
	}

	setGenericEmbed(embed) {
		if (Array.isArray(embed) || typeof embed !== 'object' && embed !== null) throw new TypeError('genericEmbed has to be an object.');
		return this._options.genericEmbed = embed;
	}
};

module.exports = DiscordiaClient;
