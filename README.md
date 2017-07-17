# base16-builder-typescript

A Base16 builder for node written in Typescript

## Installation

`npm install -g base16-builder-typescript`

## Requirements

git

## Usage

First pull down all known schemes and templates  
`base16-builder update`  
This will pull down known sources into `sources` and then will clone schemes and templates into `sources/schemes` and `sources/templates` respectively. If schemes and templates are already cloned then they will be updated. 

Then build the themes  
`base16-builder build`  
Themes will be placed in `themes` in the directory where you ran `base16-builder`.

## References

[Builder Guidelines](https://github.com/chriskempson/base16/blob/master/builder.md)  
[Base16 Repository](https://github.com/chriskempson/base16)  

