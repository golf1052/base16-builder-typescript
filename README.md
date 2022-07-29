# base16-builder-typescript

A Base16 builder for node written in Typescript

## Installation

`npm install -g base16-builder-typescript`

## Requirements

git

## Usage

Supports [base16 builder spec 1.0.0](https://github.com/chriskempson/base16/blob/main/builder.md).

Example usage: `cat tomorrow-night.yaml | base16-builder --template vim.mustache > tomorrow-night.vim`

### Other Usage

First pull down all known schemes and templates  
`base16-builder update`  
This will pull down known sources into `sources` and then will clone schemes and templates into `sources/schemes` and `sources/templates` respectively. If schemes and templates are already cloned then they will be updated. 

Then build the themes  
`base16-builder build`  
Themes will be placed in `themes` in the directory where you ran `base16-builder`.

## Additional Features

`base16-builder build --template [template]`  
This will build with only the specified template. The template names are specified [here](https://github.com/chriskempson/base16-templates-source/blob/master/list.yaml). For example `base16-builder build --template textmate` will build only the Textmate templates with all schemes.

`base16-builder build --scheme [scheme]`  
This will build with only the specified scheme. The scheme names are specified [here](https://github.com/chriskempson/base16-schemes-source/blob/main/list.yaml). For example `base16-builder build --scheme default` will build all templates with only the default schemes.

These options can be used with each other. For example `base16-builder build --template textmate --scheme default` will only build the Textmate theme with only the default schemes.

## References

[Builder Guidelines](https://github.com/chriskempson/base16/blob/main/builder.md)  
[Base16 Repository](https://github.com/chriskempson/base16)  
