## [2.0.1](https://github.com/pixelfactoryio/privatebin-cli/compare/v2.0.0...v2.0.1) (2020-11-05)


### Bug Fixes

* reformat CHANGELOG.md ([3a344e4](https://github.com/pixelfactoryio/privatebin-cli/commit/3a344e48f97c442bc47f49dda93c7e98772ac2e3))
* remove `-development` from version in package.json ([94205cc](https://github.com/pixelfactoryio/privatebin-cli/commit/94205cc48b7088c3f49784b6738cb55180500f88))

# [2.0.0](https://github.com/pixelfactoryio/privatebin-cli/compare/v1.0.2...v2.0.0) (2020-11-05)


* Prepare release 2.0.0 (#27) ([4e61480](https://github.com/pixelfactoryio/privatebin-cli/commit/4e61480f1f939f2a74bede3393794d1a5be33b8d)), closes [#27](https://github.com/pixelfactoryio/privatebin-cli/issues/27)


### BREAKING CHANGES

- rename Class `Privatebin` to `PrivatebinClient`
- make `baseUrl` defaults to `privatebin.net`
- rename function `encryptPaste()` to `sendText()`
- rename function `decryptPaste()` to `getText()`
- prefix all types with `Privatebin`
- export types
