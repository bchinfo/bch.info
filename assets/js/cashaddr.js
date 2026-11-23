// Address conversion tool. Needs bchaddrjs and qrcode, loaded before this file.
//
// An address is shown in three formats: the cash address, the token-aware
// address (the same destination, marked as able to receive CashTokens) and
// the legacy address. bchaddrjs does not know token-aware addresses, so the
// cash address format is read and written here; bchaddrjs is only used for
// the legacy format.
(function () {
  const form = document.getElementById("convert-form");
  const input = document.getElementById("address");
  const error = document.getElementById("convert-error");
  const result = document.getElementById("converted");

  // The cash address format:
  // https://github.com/bitcoincashorg/bitcoincash.org/blob/master/spec/cashaddr.md

  const CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
  const GENERATORS = [0x98f2bc8e61n, 0x79b76d99e2n, 0xf33e5fb3c4n, 0xae2eabe2a8n, 0x1e4f43e470n];
  const PREFIXES = ["bitcoincash", "bchtest", "bchreg"];
  // Length of the hash in bytes, for each value of the size bits.
  const HASH_SIZES = [20, 24, 28, 32, 40, 48, 56, 64];
  // Address types: 0 and 1 are a public key hash and a script hash, 2 and 3
  // the same two with tokens.
  const TOKEN_AWARE = 2;

  function polymod(values) {
    let c = 1n;
    for (const value of values) {
      const top = c >> 35n;
      c = ((c & 0x07ffffffffn) << 5n) ^ BigInt(value);
      GENERATORS.forEach((generator, i) => {
        if ((top >> BigInt(i)) & 1n) c ^= generator;
      });
    }
    return c ^ 1n;
  }

  function prefixValues(prefix) {
    return Array.from(prefix, (char) => char.charCodeAt(0) & 31).concat(0);
  }

  // Regroups bits, for example from bytes (8 bits) to characters (5 bits).
  function regroup(values, from, to, pad) {
    const out = [];
    let acc = 0;
    let bits = 0;
    for (const value of values) {
      acc = (acc << from) | value;
      bits += from;
      while (bits >= to) {
        bits -= to;
        out.push((acc >> bits) & ((1 << to) - 1));
      }
      acc &= (1 << bits) - 1;
    }
    if (pad && bits) out.push((acc << (to - bits)) & ((1 << to) - 1));
    if (!pad && (bits >= from || acc)) return null;
    return out;
  }

  // Returns { prefix, type, hash } or null when it is not a cash address.
  function decode(address) {
    if (address !== address.toLowerCase() && address !== address.toUpperCase()) return null;
    const parts = address.toLowerCase().split(":");
    if (parts.length > 2) return null;
    const body = parts.pop();
    const values = Array.from(body, (char) => CHARSET.indexOf(char));
    if (values.length < 9 || values.includes(-1)) return null;

    // Without a prefix, try the known ones: the checksum tells which it is.
    const prefix = (parts.length ? parts : PREFIXES).find(
      (candidate) => polymod(prefixValues(candidate).concat(values)) === 0n
    );
    if (!prefix) return null;

    const bytes = regroup(values.slice(0, -8), 5, 8, false);
    if (!bytes || !bytes.length) return null;
    const version = bytes[0];
    const type = version >> 3;
    const hash = bytes.slice(1);
    if (type > 3 || hash.length !== HASH_SIZES[version & 7]) return null;
    return { prefix: prefix, type: type, hash: hash };
  }

  function encode(prefix, type, hash) {
    const version = (type << 3) | HASH_SIZES.indexOf(hash.length);
    const values = regroup([version].concat(hash), 8, 5, true);
    const checksum = polymod(prefixValues(prefix).concat(values, [0, 0, 0, 0, 0, 0, 0, 0]));
    for (let i = 7; i >= 0; i--) values.push(Number((checksum >> BigInt(5 * i)) & 31n));
    return prefix + ":" + values.map((value) => CHARSET[value]).join("");
  }

  // Reads an address in any of the formats. Returns null when it is not valid.
  function read(address) {
    const decoded = decode(address);
    if (decoded) return decoded;
    try {
      if (bchaddr.isValidAddress(address)) return decode(bchaddr.toCashAddress(address));
    } catch (err) {
      // Not an address.
    }
    return null;
  }

  function show(id, value) {
    document.getElementById(id + "Cell").hidden = !value;
    if (!value) return;
    // The address goes on two lines of the same length (the columns are too
    // narrow for one).
    const half = Math.ceil(value.length / 2);
    const lines = [value.slice(0, half), value.slice(half)].filter(Boolean).map((text) => {
      const line = document.createElement("span");
      line.textContent = text;
      return line;
    });
    document.getElementById(id).replaceChildren(...lines);
    QRCode.toCanvas(document.getElementById(id + "QR"), value, { width: 164 }, (err) => {
      if (err) console.error(err);
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const address = input.value.trim();
    if (!address) return;
    const parsed = read(address);
    if (!parsed) {
      result.hidden = true;
      error.textContent = address + " " + error.dataset.suffix;
      error.hidden = false;
      return;
    }
    error.hidden = true;
    clearCopied();
    const base = parsed.type & 1;
    const cashAddress = encode(parsed.prefix, base, parsed.hash);
    show("cashAddr", cashAddress);
    show("tokenAddr", encode(parsed.prefix, base | TOKEN_AWARE, parsed.hash));
    // The legacy format only exists for 20-byte hashes.
    show("legacyAddr", parsed.hash.length === 20 ? bchaddr.toLegacyAddress(cashAddress) : "");
    result.hidden = false;
  });

  // Copying an address: for a moment the button shows a tick, with a small
  // "Copied" bubble above it.
  const copyStatus = document.getElementById("copy-status");
  let copiedTimer = null;

  function clearCopied() {
    clearTimeout(copiedTimer);
    document.querySelectorAll(".copy").forEach((button) => button.classList.remove("is-copied"));
    copyStatus.textContent = "";
  }

  document.querySelectorAll(".copy").forEach((button) => {
    button.addEventListener("click", () => {
      navigator.clipboard.writeText(document.getElementById(button.dataset.copy).textContent).then(() => {
        clearCopied();
        button.classList.add("is-copied");
        copyStatus.textContent = copyStatus.dataset.text;
        copiedTimer = setTimeout(clearCopied, 2000);
      });
    });
  });
})();
