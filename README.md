# Bitcoin Cash informational website

### Run the develoment server

You will need [nodeJS](https://nodejs.org/en/) installed on your machine, then run:

```shell
npm install -g gulp-cli  # if you don't have Gulp already
npm install
gulp
```

Hit `ctrl + C` to stop the server.

### Contribute

##### Coding style

Use the coding style recommended by [codeguide.co](https://codeguide.co).

##### Structure

- HTML files are located in `/app/`. `.njk` files are template ([Nunjucks](https://mozilla.github.io/nunjucks/)) files.

- CSS files are location in `/scss/`. Use [Sass](https://sass-lang.com) syntax if possible.

### Deployment

The `master` is automatically deployed.
