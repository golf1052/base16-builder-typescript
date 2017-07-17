'use strict';

import * as commander from 'commander';
import * as shelljs from 'shelljs';
import * as update from './update';
import * as builder from './builder';

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
