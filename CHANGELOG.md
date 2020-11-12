# [2.3.0](https://github.com/pixelfactoryio/privatebin-cli/compare/v2.2.0...v2.3.0) (2020-11-12)


### Features

* **browser:** build browser umd module ([#32](https://github.com/pixelfactoryio/privatebin-cli/issues/32)) ([2d16101](https://github.com/pixelfactoryio/privatebin-cli/commit/2d16101f4edfe67fd7631433a8f96e883de5a58f))

# [2.2.0](https://github.com/pixelfactoryio/privatebin-cli/compare/v2.1.0...v2.2.0) (2020-11-09)


### Features

* **esm:** publish ES module using Rollup.js ([#31](https://github.com/pixelfactoryio/privatebin-cli/issues/31)) ([9fdee38](https://github.com/pixelfactoryio/privatebin-cli/commit/9fdee38665585c814d30573aa8509bd904786e9f))

# [2.1.0](https://github.com/pixelfactoryio/privatebin-cli/compare/v2.0.3...v2.1.0) (2020-11-07)


### Bug Fixes

* use @peculiar/webcrypto instead of isomorphic-webcrypto ([#30](https://github.com/pixelfactoryio/privatebin-cli/issues/30)) ([82a74bc](https://github.com/pixelfactoryio/privatebin-cli/commit/82a74bc6eba086bb9b3ec37c0cd774b7d3bc0169))


### Features

* **crypto:** use isomorphic-webcrypto ([#29](https://github.com/pixelfactoryio/privatebin-cli/issues/29)) ([185e8cc](https://github.com/pixelfactoryio/privatebin-cli/commit/185e8cc8870f88bb6b2682aa3ac953d28d328e5e))

## [2.0.3](https://github.com/pixelfactoryio/privatebin-cli/compare/v2.0.2...v2.0.3) (2020-11-05)


### Bug Fixes

* **ci:** add package.json to semantic-release/git file list ([66fa803](https://github.com/pixelfactoryio/privatebin-cli/commit/66fa803a2eb15578677d7fb4cf250a9546af708a))
* **ci:** build application before running semantic-release ([7b5f8d1](https://github.com/pixelfactoryio/privatebin-cli/commit/7b5f8d197068bc08ba2adc6c91dedeb42c3aff4a))

## [2.0.2](https://github.com/pixelfactoryio/privatebin-cli/compare/v2.0.1...v2.0.2) (2020-11-05)


### Bug Fixes

* **ci:** configure semantic-release to publish to NPM registry ([#28](https://github.com/pixelfactoryio/privatebin-cli/issues/28)) ([f9e86d0](https://github.com/pixelfactoryio/privatebin-cli/commit/f9e86d04d6f874d394c8e8692e4ec95ddab46e10))

## [2.0.1](https://github.com/pixelfactoryio/privatebin-cli/compare/v2.0.0...v2.0.1) (2020-11-05)


### Bug Fixes

* reformat CHANGELOG.md ([3a344e4](https://github.com/pixelfactoryio/privatebin-cli/commit/3a344e48f97c442bc47f49dda93c7e98772ac2e3))
* remove `-development` from version in package.json ([94205cc](https://github.com/pixelfactoryio/privatebin-cli/commit/94205cc48b7088c3f49784b6738cb55180500f88))

## [2.0.0](https://github.com/pixelfactoryio/privatebin-cli/compare/v1.0.2...v2.0.0) (2020-11-05)


* Prepare release 2.0.0 (#27) ([4e61480](https://github.com/pixelfactoryio/privatebin-cli/commit/4e61480f1f939f2a74bede3393794d1a5be33b8d)), closes [#27](https://github.com/pixelfactoryio/privatebin-cli/issues/27)


### BREAKING CHANGES

- rename Class `Privatebin` to `PrivatebinClient`
- make `baseUrl` defaults to `privatebin.net`
- rename function `encryptPaste()` to `sendText()`
- rename function `decryptPaste()` to `getText()`
- prefix all types with `Privatebin`
- export types
