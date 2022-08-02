import * as fs from 'fs';
import * as path from 'path';
import * as jsyaml from 'js-yaml';
import * as mkdirp from 'mkdirp';
import * as shelljs from 'shelljs';

export function update() {
    let sourcesDir = path.resolve('.', 'sources');
    if (!fs.existsSync(sourcesDir)) {
        try {
            mkdirp.sync(sourcesDir);
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
    }

    let sources: any = jsyaml.load(fs.readFileSync(path.resolve(__dirname, '../../sources.yaml'), 'utf8'));
    gitUpdate(sources, sourcesDir);

    // Only gitUpdate schemes if the repository is from chriskempson.
    // let schemesDir = path.resolve(sourcesDir, 'schemes');
    // let schemes: any = jsyaml.load(fs.readFileSync(path.resolve(schemesDir, 'list.yaml'), 'utf8'));
    // gitUpdate(schemes, schemesDir);

    let templatesDir = path.resolve(sourcesDir, 'templates');
    let templates: any = jsyaml.load(fs.readFileSync(path.resolve(templatesDir, 'list.yaml'), 'utf8'));
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
            try {
                mkdirp.sync(keyDir);
            } catch(err) {
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
