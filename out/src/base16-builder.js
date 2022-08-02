"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander = require("commander");
const shelljs = require("shelljs");
const update = require("./update");
const builder = require("./builder");
if (!shelljs.which('git')) {
    console.error('Could not find git on path. Exiting.');
    process.exit(1);
}
const chunks = [];
const program = new commander.Command();
program.version('1.0.0');
program.command('build')
    .description('builds all themes')
    .option('-t, --template [template]', 'build with only the specified template')
    .option('-s, --scheme [scheme]', 'build with only the specified scheme')
    .action(function () {
    const options = program.opts();
    builder.builder(options);
});
program.command('update')
    .description('clones or pulls sources, schemes, and template repositories')
    .action(() => {
    update.update();
});
program
    .option('-t, --template [template file]')
    .action(function () {
    const options = program.opts();
    if (process.stdin.isTTY) {
        if (process.argv.length === 2) {
            program.help();
        }
        else {
            console.error('Please pipe in a scheme file.');
            process.exit(1);
        }
    }
    else {
        process.stdin.on('readable', () => {
            let chunk;
            while ((chunk = process.stdin.read()) !== null) {
                chunks.push(chunk);
            }
        });
        process.stdin.on('end', () => {
            const content = chunks.join('');
            builder.buildFromPipe(content, options);
        });
    }
});
program.parse(process.argv);
//# sourceMappingURL=base16-builder.js.map