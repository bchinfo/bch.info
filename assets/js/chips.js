// CHIPs page: show only the proposals that have every selected tag.
(function () {
  const buttons = Array.from(document.querySelectorAll("#chip-tags .tag"));
  const rows = Array.from(document.querySelectorAll("#chip-table tbody tr"));
  const error = document.getElementById("chip-error");
  if (!buttons.length) return;
  const all = buttons[0];

  function update() {
    const active = buttons.filter((b) => b !== all && b.classList.contains("is-active")).map((b) => b.dataset.tag);
    all.classList.toggle("is-active", active.length === 0);
    let shown = 0;
    rows.forEach((row) => {
      const tags = row.dataset.tags.split("|");
      const match = active.every((tag) => tags.includes(tag));
      row.hidden = !match;
      if (match) shown += 1;
    });
    error.hidden = shown > 0;
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button === all) {
        buttons.forEach((b) => b.classList.remove("is-active"));
      } else {
        button.classList.toggle("is-active");
      }
      update();
    });
  });
})();
