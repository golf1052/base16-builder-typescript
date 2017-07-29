'use strict';

import * as fs from 'fs';
import * as path from 'path';
import * as jsyaml from 'js-yaml';
import * as mkdirp from 'mkdirp';
import * as shelljs from 'shelljs';
import * as helpers from './helpers';
import * as mustache from 'mustache';
import * as color from 'color';
const slugify = require('slugify');

export function builder(options?: any) {
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
        mkdirp.sync(themesDir, helpers.mkdirpErrorHandler);
    }
    shelljs.rm('-rf', `${themesDir}/*`);

    // for each template folder (alacritty, c_header, crosh, etc.)
    templateFolders.forEach(templateFolder => {
        if (options.template && templateFolder != options.template) {
            return;
        }
        let currentTemplateDirectory = path.resolve(templatesDir, templateFolder);
        // if (!fs.existsSync(currentTemplateDirectory)) {
        //     mkdirp.sync(currentTemplateDirectory, helpers.mkdirpErrorHandler);
        // }
        // load the config in template_folder/templates/config.yaml
        let config: any = jsyaml.safeLoad(fs.readFileSync(path.resolve(currentTemplateDirectory, 'templates/config.yaml'), 'utf8'));
        // get the keys inside the template folder (default, default-256, etc.)
        let configKeys = Object.keys(config);
        // then for each key
        configKeys.forEach(key => {
            // create the output directory at themes/template_folder/output
            let outputDir = path.join(themesDir, templateFolder, config[key].output);
            if (!fs.existsSync(outputDir)) {
                mkdirp.sync(outputDir, helpers.mkdirpErrorHandler);
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
                    let yaml = jsyaml.safeLoad(fs.readFileSync(path.resolve(currentSchemeDirectory, yamlFile), 'utf8'));
                    if (!yaml.base00) {
                        // test checking if scheme file is properly formatted
                        return;
                    }
                    let filename = yamlFile;
                    if (yamlFile.lastIndexOf('.') != -1) {
                        filename = yamlFile.substring(0, yamlFile.lastIndexOf('.'));
                    }
                    let slug = slugify(filename).toLowerCase();
                    // create the view
                    let view = createView(yaml, slug);
                    // load the mustache file
                    let mustacheFile = fs.readFileSync(path.resolve(currentTemplateDirectory, 'templates', `${key}.mustache`), 'utf8');
                    // render the file
                    let renderedFile = mustache.render(mustacheFile, view);
                    // and write it out to the output directory with the appropriate name
                    fs.writeFileSync(path.resolve(outputDir, `base16-${slug}${fileExtension}`), renderedFile);
                });
            });
        });
    });
}

function createView(yaml: any, slug: string): Object {
    let final = {};
    final['scheme-name'] = yaml.scheme;
    final['scheme-author'] = yaml.author;
    final['scheme-slug'] = slug;
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
        final[`${id}-hex-r`] = yaml[id].slice(0, 2);
        final[`${id}-hex-g`] = yaml[id].slice(2, 4);
        final[`${id}-hex-b`] = yaml[id].slice(4, 6);
        final[`${id}-rgb-r`] = color(`#${yaml[id]}`).red();
        final[`${id}-rgb-g`] = color(`#${yaml[id]}`).green();
        final[`${id}-rgb-b`] = color(`#${yaml[id]}`).blue();
        final[`${id}-dec-r`] = color(`#${yaml[id]}`).red() / 255;
        final[`${id}-dec-g`] = color(`#${yaml[id]}`).green() / 255;
        final[`${id}-dec-b`] = color(`#${yaml[id]}`).blue() / 255;
    });
    return final;
}
