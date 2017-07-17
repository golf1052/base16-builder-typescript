'use strict';

import * as fs from 'fs';
import * as path from 'path';
import * as jsyaml from 'js-yaml';
import * as mkdirp from 'mkdirp';
import * as shelljs from 'shelljs';
import * as helpers from './helpers';

export function update() {
    let sourcesDir = path.resolve('.', 'sources');
    if (!fs.existsSync(sourcesDir)) {
        mkdirp(sourcesDir, helpers.mkdirpErrorHandler);
    }

    let sources: any = jsyaml.safeLoad(fs.readFileSync(path.resolve(__dirname, '../../sources.yaml'), 'utf8'));
    gitUpdate(sources, sourcesDir);

    let schemesDir = path.resolve(sourcesDir, 'schemes');
    let schemes: any = jsyaml.safeLoad(fs.readFileSync(path.resolve(schemesDir, 'list.yaml'), 'utf8'));
    gitUpdate(schemes, schemesDir);

    let templatesDir = path.resolve(sourcesDir, 'templates');
    let templates: any = jsyaml.safeLoad(fs.readFileSync(path.resolve(templatesDir, 'list.yaml'), 'utf8'));
    gitUpdate(templates, templatesDir);
}

function gitUpdate(yaml: any, dir: string): void {
    if (!yaml) {
        return;
    }
    let keys = Object.keys(yaml);
    keys.forEach(k => {
        let keyDir = path.resolve(dir, k);
        if (!fs.existsSync(keyDir)) {
            mkdirp(keyDir, helpers.mkdirpErrorHandler);
            shelljs.exec(`git clone ${yaml[k]} ${keyDir}`);
        }
        else {
            shelljs.exec(`git pull ${keyDir}`);
        }
    });
}
