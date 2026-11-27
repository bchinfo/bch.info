// Theme: follow the device unless the visitor picked one with the button.
(function () {
  var root = document.documentElement;
  var device = window.matchMedia("(prefers-color-scheme: light)");
  var saved = null;
  try {
    saved = localStorage.getItem("theme");
  } catch (e) {}
  if (saved === "light" || saved === "dark") root.dataset.theme = saved;

  function current() {
    return root.dataset.theme || (device.matches ? "light" : "dark");
  }

  function paint() {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = current() === "light" ? "#f0f0f0" : "#0a0a0a";
  }

  paint();
  device.addEventListener("change", paint);

  document.addEventListener("DOMContentLoaded", function () {
    var button = document.getElementById("theme-toggle");
    if (!button) return;
    button.hidden = false;
    button.addEventListener("click", function () {
      var next = current() === "light" ? "dark" : "light";
      // Picking what the device already asks for goes back to following it.
      var follows = next === (device.matches ? "light" : "dark");
      if (follows) delete root.dataset.theme;
      else root.dataset.theme = next;
      try {
        if (follows) localStorage.removeItem("theme");
        else localStorage.setItem("theme", next);
      } catch (e) {}
      paint();
    });
  });
})();
