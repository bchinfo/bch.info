// Transaction broadcaster.
(function () {
  const form = document.getElementById("broadcast-form");
  const input = document.getElementById("txHex");
  const invalid = document.getElementById("tx-invalid");
  const failed = document.getElementById("tx-error");
  const success = document.getElementById("tx-success");
  const link = document.getElementById("txID");

  // https://insomnia.fountainhead.cash/#/transaction/post_tx_broadcast
  const insomniaEndpoint = "https://insomnia.fountainhead.cash/v1/tx/broadcast";
  const bitcoincomEndpoint = "https://rest.bitcoin.com/v2/rawtransactions/sendRawTransaction/";

  async function send(transaction) {
    try {
      // Try insomnia first.
      return await fetch(insomniaEndpoint, {
        method: "post",
        headers: { Accept: "application/json", "Content-Type": "text/plain" },
        body: transaction,
      });
    } catch (e) {
      // Use bitcoin.com if that fails.
      return fetch(bitcoincomEndpoint + transaction);
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const transaction = input.value.trim();
    invalid.hidden = transaction.length > 10;
    failed.hidden = true;
    success.hidden = true;
    if (transaction.length <= 10) return;

    try {
      const response = await send(transaction);
      if (!response.ok) throw new Error("HTTP " + response.status);
      const json = await response.json();
      const txid = json.txid || json; // The two services answer in different formats.
      link.textContent = txid;
      link.href = "https://explorer.bitcoin.com/bch/tx/" + txid;
      success.hidden = false;
    } catch (e) {
      failed.hidden = false;
    }
  });
})();
