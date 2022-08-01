# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.1] - 2022-08-01
### Fixed
- Fixed bug where crash would happen if template config.yaml didn't exist.

## [1.2.0] - 2022-07-29
### Added
- Support for [base16 builder spec 1.0.0](https://github.com/chriskempson/base16/blob/main/builder.md)
  - Can now pipe in a scheme file and specify a template file to output the application theme to stdout.

## [1.1.3] - 2017-08-18
### Fixed
- Change line endings to LF to fix running as a binary on Unix systems.

## [1.1.2] - 2017-07-29
### Fixed
- Prepend `base16` to rendered filename.

## [1.1.1] - 2017-07-29
### Changed
- Use filename for `scheme-slug` instead of `scheme-name`. 0.9.0 builder requirement.

## [1.1.0] - 2017-07-16
### Added
- Option to build with a specified template or specified scheme

## [1.0.0] - 2017-07-16
### Added
- Initial release
