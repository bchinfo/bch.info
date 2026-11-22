// Site search.
//
// The header button, "/" or Ctrl+K opens the search box. The first time, the
// index for the current language (search.json, built by Hugo) and the search
// library (Fuse.js) are downloaded; after that, results appear as you type.
// Up and Down move through the results, Enter opens one, Escape closes the box.
(function () {
  var dialog = document.getElementById("search");
  if (!dialog || !dialog.showModal) return;

  var input = document.getElementById("search-input");
  var list = document.getElementById("search-results");
  var empty = document.getElementById("search-empty");
  var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-search-open]"));
  var limit = 12;
  var loading = null;
  var fuse = null;
  var active = -1;

  buttons.forEach(function (button) {
    button.hidden = false;
    button.addEventListener("click", function () {
      // The button in the menu panel closes the panel first.
      var panel = button.closest(".menu-toggle");
      if (panel) panel.open = false;
      open();
    });
  });

  function load() {
    if (!loading) {
      loading = Promise.all([
        import(dialog.dataset.library),
        fetch(dialog.dataset.index).then(function (response) {
          if (!response.ok) throw new Error("search index: " + response.status);
          return response.json();
        })
      ]).then(function (loaded) {
        var Fuse = loaded[0].default;
        fuse = new Fuse(loaded[1], {
          keys: [
            { name: "t", weight: 3 },
            { name: "s", weight: 1 },
            { name: "k", weight: 2 },
            { name: "x", weight: 1 }
          ],
          threshold: 0.3,
          ignoreLocation: true,
          minMatchCharLength: 2
        });
      }).catch(function (error) {
        loading = null;
        throw error;
      });
    }
    return loading;
  }

  function open() {
    if (dialog.open) return;
    dialog.showModal();
    input.select();
    load().then(search, function () {
      show("Search is not available right now.");
    });
  }

  function show(message) {
    empty.textContent = message;
    empty.hidden = !message;
  }

  function search() {
    var query = input.value.trim();
    list.textContent = "";
    active = -1;
    show("");
    if (!fuse || query.length < 2) return;

    var hits = fuse.search(query, { limit: limit });
    if (!hits.length) {
      show("No results for “" + query + "”");
      return;
    }
    hits.forEach(function (hit, i) {
      list.appendChild(row(hit.item, i));
    });
    select(0);
  }

  function row(item, i) {
    var link = document.createElement("a");
    link.className = "search__hit";
    link.id = "search-hit-" + i;
    link.href = item.u;
    link.setAttribute("role", "option");
    if (item.e) {
      link.target = "_blank";
      link.rel = "noopener";
    }

    var text = document.createElement("span");
    text.className = "search__text";
    var title = document.createElement("span");
    title.className = "search__title";
    title.textContent = item.t;
    text.appendChild(title);
    if (item.x) {
      var more = document.createElement("span");
      more.className = "search__more";
      more.textContent = item.x.slice(0, 160);
      text.appendChild(more);
    }
    link.appendChild(text);

    if (item.s || item.e) {
      var where = document.createElement("span");
      where.className = "search__where";
      where.textContent = ((item.s || "") + (item.e ? " \u2197" : "")).trim();
      link.appendChild(where);
    }

    link.addEventListener("mousemove", function () {
      if (active !== i) select(i, true);
    });
    // A result on the page we are on only changes the address: close the box.
    link.addEventListener("click", function () {
      dialog.close();
    });
    return link;
  }

  function select(i, keepScroll) {
    var rows = list.children;
    if (!rows.length) return;
    if (rows[active]) rows[active].removeAttribute("aria-selected");
    active = (i + rows.length) % rows.length;
    rows[active].setAttribute("aria-selected", "true");
    input.setAttribute("aria-activedescendant", rows[active].id);
    if (!keepScroll) rows[active].scrollIntoView({ block: "nearest" });
  }

  input.addEventListener("input", search);

  input.addEventListener("keydown", function (event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      select(active + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      select(active - 1);
    } else if (event.key === "Enter" && list.children[active]) {
      event.preventDefault();
      list.children[active].click();
    }
  });

  dialog.querySelector("[data-search-close]").addEventListener("click", function () {
    dialog.close();
  });

  // A click on the dimmed page around the box closes it.
  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener("close", function () {
    input.removeAttribute("aria-activedescendant");
  });

  document.addEventListener("keydown", function (event) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName) || event.target.isContentEditable;
    var shortcut = (event.key === "k" && (event.ctrlKey || event.metaKey)) || (event.key === "/" && !typing);
    if (!shortcut || event.altKey) return;
    event.preventDefault();
    open();
  });
})();
