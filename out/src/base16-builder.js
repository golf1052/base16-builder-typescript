'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const commander = require("commander");
const shelljs = require("shelljs");
const update = require("./update");
const builder = require("./builder");
if (!shelljs.which('git')) {
    console.error('Could not find git on path. Exiting.');
    process.exit(1);
}
commander.version('1.0.0');
commander.command('build')
    .description('builds all themes')
    .action(() => {
    builder.builder();
});
commander.command('update')
    .description('clones or pulls sources, schemes, and template repositories')
    .action(() => {
    update.update();
});
commander.command('*')
    .action(() => {
    commander.outputHelp();
});
commander.parse(process.argv);
if (!process.argv.slice(2).length) {
    commander.outputHelp();
}
//# sourceMappingURL=base16-builder.js.map