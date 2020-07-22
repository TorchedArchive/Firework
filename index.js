module.exports = {
	Client: require('./src/Client'),
	// Command: require('./src/BaseCommand'),
	Collection: require('./src/Collection'),
	Log: require('./src/Log'),
	version: require('./package.json').version,
	erisVersion: require('./package.json').dependencies.eris.slice(1)
};
