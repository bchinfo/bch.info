<div align="center">
  <img src="static/img/bitcoin-cash-logo-flag.svg" height="70">
  <h4><a href="https://bch.info" target="_blank">bch.info</a></h4>
  <p>Bitcoin Cash informational website</p>
</div>

<hr>

[![Netlify Status](https://api.netlify.com/api/v1/badges/52d9f701-354f-4e58-9223-d4da49906174/deploy-status)](https://app.netlify.com/sites/bch/deploys) [![CodeFactor](https://www.codefactor.io/repository/github/bchinfo/bch.info/badge)](https://www.codefactor.io/repository/github/bchinfo/bch.info) [![Crowdin](https://badges.crowdin.net/bchinfo/localized.svg)](https://crowdin.com/project/bchinfo)

### Table of contents

- [Run the development server](#-run-the-development-server)
- [Contribute](#-contribute)
- [Deployment](#-deployment)

<hr>

### 💻 Run the development server

The site is built with [Hugo](https://gohugo.io). Install Hugo 0.170 or newer, then run:

```shell
hugo server
```

The site is served at http://localhost:1313 and reloads when a file changes. Hit `ctrl + C` to stop the server.

To build the site into `public/`, run `hugo`.

<hr>

### ➕ Contribute

##### Structure

- `hugo.toml` holds the settings and the languages.
- `/data/navigation.yaml` holds the header menus and footer columns. An item without a `url` is a page we don't have yet and shows greyed out.
- `/content/` holds one file per page. It names the page's template and where its title comes from.
- `/layouts/` holds the page templates. Shared pieces are in `/layouts/_partials/`.
- `/assets/` holds the styles (`css/main.css`, plain CSS with the colours defined as variables at the top) and the scripts for the tools and the CHIPs page.
- `/data/` holds the lists shown on the pages: wallets, exchanges, explorers, nodes, developer tools, community links, CHIPs and the upgrade history.
- `/lang/` holds the text of the site, one folder per language.
- `/static/` holds the images, the logo packs and the whitepaper.

##### Adding a wallet, an exchange or another link

Edit the matching file in `/data/` and open a pull request. No template needs to change.

##### Text

Templates read their text from `/lang/` with the `t.html` partial, for example `{{ partial "t.html" "index.get-started" }}` for the `get-started` key in `index.yaml`. A missing translation falls back to English.

##### News

The news posts are in `data/news.json`, one entry per post with its `date`, `text` and `url`. The homepage shows the latest five and `/news/` shows them all, 25 per page.

##### Node releases

The homepage lists the latest release of each node. They are read from the projects' release feeds when the site is built. The feeds are listed under `params.releases` in `hugo.toml`.

<hr>

### 🚀 Deployment

The `master` branch is automatically deployed by Netlify. The build settings and redirects are in `netlify.toml`.
