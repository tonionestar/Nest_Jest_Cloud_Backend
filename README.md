# User Backend guide

Hello and welcome to the clippic user backend :tada:

[[_TOC_]]

## Getting started

Please check the [Contribution Guide](CONTRIBUTION.md).

## Conventions

### Commit style

The release process is fully automated, so we do not take care of any versioning - but this process rely and a good 
quality of commits.

All commits have to be compatible with [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) commit 
style.

```text
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─> Summary in present tense, not capitalized, with no period at the end.
  │       │
  │       └─> Commit Scope: e.g.: eth, rpc
  │
  └─> Commit Type: build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test
```

### Branching style

Branch names can be created by checking `Git Flow` convention, so `feature/` and `hotfix/` are allowed as branch prefix.

### Git strategy

The release process is using our commit history to generate releases, this means, that we don't want to have 
`Merge commits` in our history. Therefore, please respect the **Fast-Forward/Rebase** flow. 

### Security

#### GPG signing

All the commits must be signed via GPG key with the email address you are registered within Gitlab.


You can generate a GPG key with the [GPG command line tool](https://www.gnupg.org/download/)

1. Start generation process:
```shell
gpg --expert --full-gen-key
```
2. Choose `(9) ECC and ECC`.
3. Select `(1) Curve 25519` as elliptic curve.
4. Please specify max of `1y` one year as validity.
5. Enter your Real name and Email address.
6. Get the key id:
```shell
gpg --list-secret-keys --keyid-format=long
```
7. Your key id will be `87E84BCC931E3A5B` like in this example:
```text
sec   ed25519/87E84BCC931E3A5B 2023-04-26 [SC] [expires: 2024-04-25]
      3C68596A18122EA2319E931987E84BCC931E3A5B
uid                 [ultimate] Dominik Kaminski <dominik@clippic.app>
ssb   cv25519/AE38B32B68306363 2023-04-26 [E] [expires: 2024-04-25]
```
8. Export your key:
```shell
gpg --armor --export 87E84BCC931E3A5B
```
9. Paste the code in [GPG Keys](https://gitlab.clippic.app/-/profile/gpg_keys) section in your Gitlab User Settings.
10. Update your repository settings:
```shell
git config user.email "dominik@clippic.app"
git config user.name "Dominik Kaminski"
git config user.signingkey 87E84BCC931E3A5B
```

#### Unverified users

You can only commit to this repository with your email address that is registered in the Gitlab instance.
