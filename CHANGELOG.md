# [2.0.0](https://github.com/pixelfactoryio/privatebin-cli/compare/v1.0.2...v2.0.0) (2020-11-05)


* Prepare release 2.0.0 (#27) ([4e61480](https://github.com/pixelfactoryio/privatebin-cli/commit/4e61480f1f939f2a74bede3393794d1a5be33b8d)), closes [#27](https://github.com/pixelfactoryio/privatebin-cli/issues/27)


### BREAKING CHANGES

* - rename class Privatebin to PrivatebinClient
- make default baseUrl = privatebin.net
- rename function encryptPaste to sendText
- rename function decryptPaste to getText

* Update types names:
- prefix all types with Privatebin
- export types

* chore(ci): add semantic-release
