// Address conversion tool. Needs bchaddrjs and qrcode, loaded before this file.
(function () {
  const form = document.getElementById("convert-form");
  const input = document.getElementById("address");
  const error = document.getElementById("convert-error");
  const result = document.getElementById("converted");

  function show(id, value) {
    document.getElementById(id).textContent = value;
    QRCode.toCanvas(document.getElementById(id + "QR"), value, { width: 164 }, (err) => {
      if (err) console.error(err);
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const address = input.value.trim();
    if (!address) return;
    if (!bchaddr.isValidAddress(address)) {
      result.hidden = true;
      error.textContent = address + " " + error.dataset.suffix;
      error.hidden = false;
      return;
    }
    error.hidden = true;
    show("cashAddr", bchaddr.toCashAddress(address));
    show("legacyAddr", bchaddr.toLegacyAddress(address));
    result.hidden = false;
  });

  document.querySelectorAll(".copy").forEach((button) => {
    button.addEventListener("click", () => {
      navigator.clipboard.writeText(document.getElementById(button.dataset.copy).textContent).then(() => {
        document.querySelectorAll(".copy").forEach((b) => b.classList.toggle("is-copied", b === button));
      });
    });
  });
})();
