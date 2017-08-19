'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const jsyaml = require("js-yaml");
const mkdirp = require("mkdirp");
const shelljs = require("shelljs");
const helpers = require("./helpers");
function update() {
    let sourcesDir = path.resolve('.', 'sources');
    if (!fs.existsSync(sourcesDir)) {
        mkdirp(sourcesDir, helpers.mkdirpErrorHandler);
    }
    let sources = jsyaml.safeLoad(fs.readFileSync(path.resolve(__dirname, '../../sources.yaml'), 'utf8'));
    gitUpdate(sources, sourcesDir);
    let schemesDir = path.resolve(sourcesDir, 'schemes');
    let schemes = jsyaml.safeLoad(fs.readFileSync(path.resolve(schemesDir, 'list.yaml'), 'utf8'));
    gitUpdate(schemes, schemesDir);
    let templatesDir = path.resolve(sourcesDir, 'templates');
    let templates = jsyaml.safeLoad(fs.readFileSync(path.resolve(templatesDir, 'list.yaml'), 'utf8'));
    gitUpdate(templates, templatesDir);
}
exports.update = update;
function gitUpdate(yaml, dir) {
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
//# sourceMappingURL=update.js.map
