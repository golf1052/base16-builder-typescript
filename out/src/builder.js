"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFromPipe = exports.builder = void 0;
const fs = require("fs");
const path = require("path");
const jsyaml = require("js-yaml");
const mkdirp = require("mkdirp");
const shelljs = require("shelljs");
const mustache = require("mustache");
const color = require("color");
const slugify = require('slugify');
function builder(options) {
    let sourcesDir = path.resolve('.', 'sources');
    if (!fs.existsSync(sourcesDir)) {
        console.error('Could not find sources directory. Please run base16-builder update first. Exiting.');
        process.exit(1);
    }
    let schemesDir = path.resolve(sourcesDir, 'schemes');
    let schemeFolders = fs.readdirSync(schemesDir).filter(d => {
        return d.indexOf('.') == -1;
    });
    let templatesDir = path.resolve(sourcesDir, 'templates');
    let templateFolders = fs.readdirSync(templatesDir).filter(d => {
        return d.indexOf('.') == -1;
    });
    if (options.template && templateFolders.indexOf(options.template) == -1) {
        console.error(`Template ${options.template} does not exist. Exiting.`);
        process.exit(1);
    }
    if (options.scheme && schemeFolders.indexOf(options.scheme) == -1) {
        console.error(`Scheme ${options.scheme} does not exist. Exiting.`);
        process.exit(1);
    }
    let themesDir = path.resolve('.', 'themes');
    if (!fs.existsSync(themesDir)) {
        try {
            mkdirp.sync(themesDir);
        }
        catch (err) {
            console.error(err);
            process.exit(1);
        }
    }
    shelljs.rm('-rf', `${themesDir}/*`);
    // for each template folder (alacritty, c_header, crosh, etc.)
    templateFolders.forEach(templateFolder => {
        if (options.template && templateFolder != options.template) {
            return;
        }
        let currentTemplateDirectory = path.resolve(templatesDir, templateFolder);
        // load the config in template_folder/templates/config.yaml
        let config = jsyaml.load(fs.readFileSync(path.resolve(currentTemplateDirectory, 'templates/config.yaml'), 'utf8'));
        // get the keys inside the template folder (default, default-256, etc.)
        let configKeys = Object.keys(config);
        // then for each key
        configKeys.forEach(key => {
            // create the output directory at themes/template_folder/output
            let outputDir = path.join(themesDir, templateFolder, config[key].output);
            if (!fs.existsSync(outputDir)) {
                try {
                    mkdirp.sync(outputDir);
                }
                catch (err) {
                    console.error(err);
                    process.exit(1);
                }
            }
            // grab the file extension
            let fileExtension = config[key].extension;
            // then for each scheme folder
            schemeFolders.forEach(schemeFolder => {
                if (options.scheme && schemeFolder != options.scheme) {
                    return;
                }
                let currentSchemeDirectory = path.resolve(schemesDir, schemeFolder);
                // get all the scheme files
                let yamlFiles = fs.readdirSync(currentSchemeDirectory).filter(d => {
                    return d.endsWith('.yaml');
                });
                // then for each scheme file
                yamlFiles.forEach(yamlFile => {
                    // load the scheme file
                    let yaml = jsyaml.load(fs.readFileSync(path.resolve(currentSchemeDirectory, yamlFile), 'utf8'));
                    if (!yaml.base00) {
                        // test checking if scheme file is properly formatted
                        return;
                    }
                    // create the view
                    let view = createView(yaml);
                    // load the mustache file
                    let mustacheFile = fs.readFileSync(path.resolve(currentTemplateDirectory, 'templates', `${key}.mustache`), 'utf8');
                    // render the file
                    let renderedFile = mustache.render(mustacheFile, view);
                    // and write it out to the output directory with the appropriate name
                    fs.writeFileSync(path.resolve(outputDir, `base16-${view['scheme-slug']}${fileExtension}`), renderedFile);
                });
            });
        });
    });
}
exports.builder = builder;
function buildFromPipe(scheme, options) {
    if (!options.template) {
        console.error('Please specify a template file.');
        process.exit(1);
    }
    const yaml = jsyaml.load(scheme);
    if (!yaml.base00) {
        console.error('Scheme file is not properly formatted.');
        process.exit(1);
    }
    const mustacheFile = fs.readFileSync(options.template, 'utf8');
    const renderedFile = buildTemplate(yaml, mustacheFile);
    process.stdout.write(renderedFile);
}
exports.buildFromPipe = buildFromPipe;
function buildTemplate(schemeYaml, mustacheFile) {
    let view = createView(schemeYaml);
    let renderedFile = mustache.render(mustacheFile, view);
    return renderedFile;
}
function createView(yaml) {
    let final = {};
    final['scheme-name'] = yaml.scheme;
    final['scheme-author'] = yaml.author;
    final['scheme-slug'] = slugify(yaml.scheme).toLowerCase();
    const baseIds = [
        'base00',
        'base01',
        'base02',
        'base03',
        'base04',
        'base05',
        'base06',
        'base07',
        'base08',
        'base09',
        'base0A',
        'base0B',
        'base0C',
        'base0D',
        'base0E',
        'base0F'
    ];
    baseIds.forEach(id => {
        final[`${id}-hex`] = yaml[id];
        final[`${id}-hex-bgr`] = yaml[id].slice(4, 6) + yaml[id].slice(2, 4) + yaml[id].slice(0, 2);
        final[`${id}-hex-r`] = yaml[id].slice(0, 2);
        final[`${id}-hex-g`] = yaml[id].slice(2, 4);
        final[`${id}-hex-b`] = yaml[id].slice(4, 6);
        final[`${id}-rgb-r`] = color(`#${yaml[id]}`).red();
        final[`${id}-rgb-g`] = color(`#${yaml[id]}`).green();
        final[`${id}-rgb-b`] = color(`#${yaml[id]}`).blue();
        final[`${id}-dec-r`] = color(`#${yaml[id]}`).red() / 255;
        final[`${id}-dec-g`] = color(`#${yaml[id]}`).green() / 255;
        final[`${id}-dec-b`] = color(`#${yaml[id]}`).blue() / 255;
        final[`${id}-hsl-h`] = color(`#${yaml[id]}`).hsl().hue();
        final[`${id}-hsl-s`] = color(`#${yaml[id]}`).hsl().saturationl();
        final[`${id}-hsl-l`] = color(`#${yaml[id]}`).hsl().lightness();
    });
    return final;
}
//# sourceMappingURL=builder.js.map