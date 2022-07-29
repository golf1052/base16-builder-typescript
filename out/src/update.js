"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = void 0;
const fs = require("fs");
const path = require("path");
const jsyaml = require("js-yaml");
const mkdirp = require("mkdirp");
const shelljs = require("shelljs");
function update() {
    let sourcesDir = path.resolve('.', 'sources');
    if (!fs.existsSync(sourcesDir)) {
        try {
            mkdirp.sync(sourcesDir);
        }
        catch (err) {
            console.error(err);
            process.exit(1);
        }
    }
    let sources = jsyaml.load(fs.readFileSync(path.resolve(__dirname, '../../sources.yaml'), 'utf8'));
    gitUpdate(sources, sourcesDir);
    let schemesDir = path.resolve(sourcesDir, 'schemes');
    let schemes = jsyaml.load(fs.readFileSync(path.resolve(schemesDir, 'list.yaml'), 'utf8'));
    gitUpdate(schemes, schemesDir);
    let templatesDir = path.resolve(sourcesDir, 'templates');
    let templates = jsyaml.load(fs.readFileSync(path.resolve(templatesDir, 'list.yaml'), 'utf8'));
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
            try {
                mkdirp.sync(keyDir);
            }
            catch (err) {
                console.error(err);
                process.exit(1);
            }
            shelljs.exec(`git clone ${yaml[k]} ${keyDir}`);
        }
        else {
            shelljs.exec(`git pull ${keyDir}`);
        }
    });
}
//# sourceMappingURL=update.js.map