'use strict';
const Loggaby = require('loggaby');

class DiscordiaLog extends Loggaby {
	commands(msg, color = !this.options.color, logfunc = this.options.logFunction || console.log) {
		logfunc(color ? this._print(msg, 'magenta', 'Commands') : `${this._time} Commands > ${msg}`);
	}

	shard(msg, id = 0, color = !this.options.color, logfunc = this.options.logFunction || console.log) {
		logfunc(color ? this._print(msg, 'blue', `Shard ${id}`) : `${this._time} Shard ${id} > ${msg}`);
	};
}

module.exports = DiscordiaLog;
