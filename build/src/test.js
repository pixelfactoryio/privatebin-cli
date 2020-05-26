"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const commander = require('commander'); // (normal include)
const commander_1 = __importDefault(require("commander")); // include commander in git clone of commander repo
const program = new commander_1.default.Command();
// Commander supports nested subcommands.
// .command() can add a subcommand with an action handler or an executable.
// .addCommand() adds a prepared command with an action handler.
// Example output:
//
// $ node nestedCommands.js brew tea
// brew tea
// $ node nestedCommands.js heat jug
// heat jug
// Add nested commands using `.command()`.
const brew = program.command('brew');
brew.command('tea').action(() => {
    console.log('brew tea');
});
brew.command('coffee').action(() => {
    console.log('brew coffee');
});
// Add nested commands using `.addCommand().
// The command could be created separately in another module.
function makeHeatCommand() {
    const heat = new commander_1.default.Command('heat');
    heat.command('jug').action(() => {
        console.log('heat jug');
    });
    heat.command('pot').action(() => {
        console.log('heat pot');
    });
    return heat;
}
program.addCommand(makeHeatCommand());
program.parse(process.argv);
//# sourceMappingURL=test.js.map