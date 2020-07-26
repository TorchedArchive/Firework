const Discordia = require('../../../../index');

class EvalCommand extends Discordia.Command {
	constructor(bot) {
		super(bot, {name: 'eval'});
	}

	run(msg, args) {
		if (!args[0]) return msg.channel.createMessage("So.. where is the code?")
        try {
            let code = args.join(" ")
            var evaled = eval(code.replace(new RegExp('--silent', 'g'), ''));
            if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
            if (code.includes("--silent")) {
                msg.channel.createMessage(this.clean(evaled))
            } else {
                msg.channel.createMessage({
                    embed: {
                    	generic: true,
                        description: `\`\`\`js\n${this.clean(evaled)}\n\`\`\``
                    }
                })
            }
        } catch (err) {
        	msg.channel.createMessage({
                embed: {
                 	generic: true,
                    description: `\`\`\`js\n${this.clean(err.stack)}\n\`\`\``
                }
            })
        }
	}

	clean(text) {
	    if (typeof(text) === "string") {
	    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
	    } else {
	        return text;
	    }
	}
}

module.exports = EvalCommand;
