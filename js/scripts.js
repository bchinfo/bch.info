// Custom scripts here


// Initialize MoveTo

const moveTo = new MoveTo({easing: 'easeOutQuart'});

const trigger = document.getElementsByClassName('js-trigger')[0];
moveTo.registerTrigger(trigger);


// Navigation menu toggler

$("#menuToggler").click(function() { // open menu
  $("#menu").show();
  $("body").addClass('no-scrolling');
});

$("#closeMenu").click(function() { // close menu
  $("#menu").hide();
  $("body").removeClass('no-scrolling');
});


// Copy to clipboard

function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
  if (!$(element).hasClass("btn-primary")) {
    $(".btn-copy").removeClass("btn-primary").addClass("btn-secondary");
    $(".address-qrcode").removeClass("btn-primary");
    $(element).siblings().removeClass("btn-secondary").addClass("btn-primary");
  }
}


// Address conversion
// Warning: requires /static/js/bchaddrjs-0.4.9.min.js
// and /static/js/qrcode.min.js

function convertAddress() {
  const address = $("#address").val();
  if (address) {
    if (bchaddr.isValidAddress(address)) {
      $("#errorMessage").addClass("d-none");
      // Conversion
      const cash = bchaddr.toCashAddress(address);
      const legacy = bchaddr.toLegacyAddress(address);
      // Replace values
      $("#cashAddr").text(cash);
      $("#legacyAddr").text(legacy);
      // Display converted address
      $("#convertedAddr").removeClass("d-none");
      // Display QR codes
      QRCode.toCanvas(document.getElementById("cashAddrQR"), cash, function (error) {
        if (error) console.error(error);
      });
      QRCode.toCanvas(document.getElementById("legacyAddrQR"), legacy, {width: 164}, function (error) {
        if (error) console.error(error);
      });
    } else {
      // Show error message
      $("#convertedAddr").addClass("d-none");
      $("#errorMessage").removeClass("d-none");
      $("#errorMessage").text(address + " $( cashaddr.is-not-valid )$");
    }
  }
}
