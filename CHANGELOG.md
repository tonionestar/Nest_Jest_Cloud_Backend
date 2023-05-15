# [1.3.0](https://gitlab.clippic.app/clippic/backend/user-v2/compare/v1.2.0...v1.3.0) (2023-05-15)


### Features

* **controllers:** seperating logic from controllers ([767d383](https://gitlab.clippic.app/clippic/backend/user-v2/commit/767d38383565ac0d45f83c9905a9a89dbe4b8eb6))

# [1.2.0](https://gitlab.clippic.app/clippic/backend/user-v2/compare/v1.1.0...v1.2.0) (2023-05-11)


### Features

* **Quota:** added internal manage quota routes ([a79b8f9](https://gitlab.clippic.app/clippic/backend/user-v2/commit/a79b8f9499fc0b86ba99eb101a0e62c52f4e0bc3))

# [1.1.0](https://gitlab.clippic.app/clippic/backend/user-v2/compare/v1.0.0...v1.1.0) (2023-05-07)


### Features

* **Queries:** split userQueries to several files ([053f37c](https://gitlab.clippic.app/clippic/backend/user-v2/commit/053f37c867423a34aa39b1a445e5f5a7d0e24f0f))

# 1.0.0 (2023-05-07)


### Bug Fixes

* **billing:** add specific error codes, add codes to tests ([06eff94](https://gitlab.clippic.app/clippic/backend/user-v2/commit/06eff94ab7d58f53bec51ac6afe133970ae0f792))
* **billing:** define billing interfaces ([a15ebfe](https://gitlab.clippic.app/clippic/backend/user-v2/commit/a15ebfe71b0ad6aa1260449dd302aa4bc83f0767))
* **chart:** add additionals labels ([640ed15](https://gitlab.clippic.app/clippic/backend/user-v2/commit/640ed15da707718ea11f295e95457add8df57ba7))
* **chart:** add service account mount ([436fda2](https://gitlab.clippic.app/clippic/backend/user-v2/commit/436fda26e11c6c31927f23814822a00de210f5ed))
* **chart:** change pull secret user name ([3742914](https://gitlab.clippic.app/clippic/backend/user-v2/commit/3742914eb376ac282913e02ac5d474da76fb6305))
* **chart:** changes into from range to static ([42646e3](https://gitlab.clippic.app/clippic/backend/user-v2/commit/42646e39c4e20c383b26152d601c48c34357eb67))
* **chart:** fix image pull secret ([9dc2dc9](https://gitlab.clippic.app/clippic/backend/user-v2/commit/9dc2dc9dbdbbd0064abc02a9969cb604be746b7e))
* **chart:** fix repository name ([ac7eb86](https://gitlab.clippic.app/clippic/backend/user-v2/commit/ac7eb865414c6da752e20f7117460e31f847382a))
* **chart:** remove ro filesystem ([2394569](https://gitlab.clippic.app/clippic/backend/user-v2/commit/239456959585bb5f9e7c76cad96731132a83f2b5))
* **chart:** update liveness and readiness probes ([e7138ac](https://gitlab.clippic.app/clippic/backend/user-v2/commit/e7138ac05326f6683d4d113dda34b280b51c5aef))
* **container:** add emails and public files ([93a7bf3](https://gitlab.clippic.app/clippic/backend/user-v2/commit/93a7bf3e6ec44f79fc0cb7780b9f508cf5d3e38c))
* **database/entity:** renamed db columns to camelcase ([d9abcb8](https://gitlab.clippic.app/clippic/backend/user-v2/commit/d9abcb89a9842504f98662b6e329fc69c88e40af))
* **database:** add default for modified ([dcf5014](https://gitlab.clippic.app/clippic/backend/user-v2/commit/dcf501449afe9cd9bffff10541708c6ab464f7f0))
* **docker:** fix email copy behaviour ([5165f3d](https://gitlab.clippic.app/clippic/backend/user-v2/commit/5165f3d7e641f67eb2de3bb2cf10550bc0d309cf))
* **email:** add mail format check ([3d551dc](https://gitlab.clippic.app/clippic/backend/user-v2/commit/3d551dc1bbca4001aa6724ea465dd0fa53f202e4))
* **forename:** fix model issues ([e6bf96d](https://gitlab.clippic.app/clippic/backend/user-v2/commit/e6bf96d20d38533756873171dadd6f75661de7ce))
* **middleware:** exclude health endpoint from tracing ([48353bd](https://gitlab.clippic.app/clippic/backend/user-v2/commit/48353bd2f0480bb52ae0b1036af58911421e5cac))
* **package:** update dependencies ([41db80e](https://gitlab.clippic.app/clippic/backend/user-v2/commit/41db80efa0254becc9875e083f4d224f630af628))
* **Quota:** set default values for database ([e8fe5ec](https://gitlab.clippic.app/clippic/backend/user-v2/commit/e8fe5ecbdcd4dd322adc81e46b4801fcaea5ed7e))


### Features

* **billing:** add GET and PUT routes to /v2/users/billing ([8a45840](https://gitlab.clippic.app/clippic/backend/user-v2/commit/8a458409e4f9841ecaed1e198fab66fdd4c45ae0))
* Data Controllers done ([2cbb6dc](https://gitlab.clippic.app/clippic/backend/user-v2/commit/2cbb6dc5681ccad4b3c32edab6734cf0f7786b06))
* **email:** add email route ([22c5e42](https://gitlab.clippic.app/clippic/backend/user-v2/commit/22c5e4290ba274f4f8371649bc9582baf0c1b42e))
* initial commit ([c340f7d](https://gitlab.clippic.app/clippic/backend/user-v2/commit/c340f7d30ddf4b430f5618fb5dd7c20b73368f73))
* LoginController done ([7449ed3](https://gitlab.clippic.app/clippic/backend/user-v2/commit/7449ed362e251f0455eca16f1178e01bb23a1dda))
* **nodemon.json:** adding nodemon live reload ([56f9562](https://gitlab.clippic.app/clippic/backend/user-v2/commit/56f9562334d9be00306a36b031312db3a53ec95a))
* **password:** add password forgotten mail call ([f886ba9](https://gitlab.clippic.app/clippic/backend/user-v2/commit/f886ba91de08a424bd3e1b441a90b34b92880bc5))
* **Quota:** added consume quota routes ([cd1b823](https://gitlab.clippic.app/clippic/backend/user-v2/commit/cd1b823a6773fb27a98df26f8018c9fb78e24076))
* **Quota:** added internal quota routes ([a03ed8d](https://gitlab.clippic.app/clippic/backend/user-v2/commit/a03ed8d5e14a28e84f3a153095bcd0b15206f5b2)), closes [Issue#10](https://gitlab.clippic.app/Issue/issues/10)
* **Quota:** added quota test routes ([5e0d241](https://gitlab.clippic.app/clippic/backend/user-v2/commit/5e0d2419452c73eb8d9353bb9aa45c026cf45e46))
* **routes:** add /id route ([1051075](https://gitlab.clippic.app/clippic/backend/user-v2/commit/105107574ebf0c1c4bd86a59d57757e35e566850))
* **seed.ts:** added db seed script ([bdbccd8](https://gitlab.clippic.app/clippic/backend/user-v2/commit/bdbccd81e8996b340f7f96c826e6fd7350d2363c))
* **shipping:** added shipping routes ([5001527](https://gitlab.clippic.app/clippic/backend/user-v2/commit/5001527d406c4aca153d012e74750f799852e0bd))
* **signup:** add /signup route ([183834a](https://gitlab.clippic.app/clippic/backend/user-v2/commit/183834acf0b25ef4cd38d362ca8b662b548adb5d))
