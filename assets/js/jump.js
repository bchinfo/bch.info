// Jump links (marked with data-jump) scroll to a section of the page without
// leaving "#section" in the address bar. Without JavaScript they still work as
// ordinary anchor links.
(function () {
  function clean() {
    history.replaceState(null, "", location.pathname + location.search);
  }

  function target(link) {
    var url = new URL(link.href);
    if (url.pathname !== location.pathname || !url.hash) return null;
    return document.getElementById(decodeURIComponent(url.hash.slice(1)));
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a[data-jump]");
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    var section = target(link);
    if (!section) return;
    event.preventDefault();
    section.scrollIntoView();
    // Move keyboard focus along with the view.
    section.setAttribute("tabindex", "-1");
    section.focus({ preventScroll: true });
  });

  // Arriving from another page with a jump link's "#section": go there once
  // the page has loaded, then tidy the address.
  var ids = Array.prototype.map.call(document.querySelectorAll("a[data-jump]"), function (link) {
    return new URL(link.href).hash.slice(1);
  });
  var id = decodeURIComponent(location.hash.slice(1));
  if (id && ids.indexOf(id) !== -1) {
    window.addEventListener("load", function () {
      var section = document.getElementById(id);
      if (section) section.scrollIntoView({ behavior: "instant" });
      clean();
    });
  }
})();
