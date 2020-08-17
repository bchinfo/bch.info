<div align="center">
  <img src="app/static/img/bitcoin-cash-logo-flag.svg" height="70">
  <h4><a href="https://bch.info" target="_blank">bch.info</a></h4>
  <p>Bitcoin Cash informational website</p>
</div>

<hr>

[![Netlify Status](https://api.netlify.com/api/v1/badges/52d9f701-354f-4e58-9223-d4da49906174/deploy-status)](https://app.netlify.com/sites/bch/deploys) [![CodeFactor](https://www.codefactor.io/repository/github/merc1er/bch.info/badge/master)](https://www.codefactor.io/repository/github/merc1er/bch.info/overview/master) [![Crowdin](https://badges.crowdin.net/bchinfo/localized.svg)](https://crowdin.com/project/bchinfo)

### Table of contents

- [Run the develoment server](#run-the-develoment-server)
- [Contribute](#contribute)
- [Deployment](#deployment)
- [Translate](#translate)

<hr>

### 💻 Run the develoment server

You will need [nodeJS](https://nodejs.org/en/) installed on your machine, then run:

```shell
npm install -g gulp-cli  # if you don't have Gulp already
npm install
gulp
```

Hit `ctrl + C` to stop the server.

<hr>

### ➕ Contribute

##### Coding style

Use the coding style recommended by [codeguide.co](https://codeguide.co).

##### Structure

- HTML files are located in `/app/`. `.njk` files are template ([Nunjucks](https://mozilla.github.io/nunjucks/)) files.

- CSS files are located in `/scss/`. Use [Sass](https://sass-lang.com) syntax if possible.

- JavaScript files are located in `/js/`. All files will be concatenated in alphabetical order unless specified otherwise.

<hr>

### 🚀 Deployment

The `master` branch is automatically deployed.

<hr>

### 🇬🇧 Translate

Translations are managed through [Crowdin](https://crowdin.com/project/bchinfo). If you wish to translate this website into your own language, please open an issue at this repo.

Pull requests are automatically created when a translation is updated.
