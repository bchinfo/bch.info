// Header navigation.
//
// Desktop: one menu open at a time; a click elsewhere or Escape closes it.
// Tablet and phone: the "Menu" button opens a panel with every section. On a
// tablet all sections are shown; on a phone each one opens on its own.
// Without JavaScript everything still opens and closes on click.
(function () {
  var groups = Array.prototype.slice.call(document.querySelectorAll(".nav-group"));
  var toggle = document.querySelector(".menu-toggle");
  var panelGroups = Array.prototype.slice.call(document.querySelectorAll(".menu-panel__group"));
  var phone = window.matchMedia("(max-width: 640px)");

  function closeGroups(except) {
    groups.forEach(function (group) {
      if (group !== except) group.open = false;
    });
  }

  groups.forEach(function (group) {
    group.querySelector("summary").addEventListener("click", function () {
      closeGroups(group);
    });
  });

  // Sections in the panel: all open on a tablet, all closed on a phone.
  function fitPanel() {
    panelGroups.forEach(function (group) {
      group.open = !phone.matches;
    });
  }
  fitPanel();
  phone.addEventListener("change", fitPanel);

  // On a tablet a section heading is only a label.
  panelGroups.forEach(function (group) {
    group.querySelector("summary").addEventListener("click", function (event) {
      if (!phone.matches) event.preventDefault();
    });
  });

  document.addEventListener("click", function (event) {
    if (!event.target.closest(".nav-group")) closeGroups(null);
    if (toggle && toggle.open && !event.target.closest(".menu-toggle")) toggle.open = false;
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    var open = groups.filter(function (group) { return group.open; })[0];
    if (open) {
      open.open = false;
      open.querySelector("summary").focus();
    } else if (toggle && toggle.open) {
      toggle.open = false;
      toggle.querySelector("summary").focus();
    }
  });
})();
