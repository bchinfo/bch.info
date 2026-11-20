// Header menus: only one open at a time, and they close on a click elsewhere
// or on Escape. Without JavaScript each still opens and closes on click.
(function () {
  var groups = Array.prototype.slice.call(document.querySelectorAll(".nav-group"));
  if (!groups.length) return;

  function closeAll(except) {
    groups.forEach(function (group) {
      if (group !== except) group.open = false;
    });
  }

  // Opening one group closes the others straight away.
  groups.forEach(function (group) {
    group.querySelector("summary").addEventListener("click", function () {
      closeAll(group);
    });
  });

  document.addEventListener("click", function (event) {
    if (!event.target.closest(".nav-group")) closeAll(null);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    var open = groups.filter(function (group) { return group.open; })[0];
    if (!open) return;
    open.open = false;
    open.querySelector("summary").focus();
  });
})();
