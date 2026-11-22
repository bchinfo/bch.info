// About page: open the section a link points at (for example /about/#history),
// on arrival and when the address changes while on the page.
(function () {
  function openTarget() {
    var id = decodeURIComponent(location.hash.slice(1));
    var part = id && document.getElementById(id);
    if (!part || !part.classList.contains("about__part")) return;
    part.open = true;
    part.scrollIntoView();
  }
  openTarget();
  window.addEventListener("hashchange", openTarget);
})();
