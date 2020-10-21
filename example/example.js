const Firework = require('../lib/index')
const bot = new Firework('token');

bot.loadCommands('./commands').loadEvents('./events');