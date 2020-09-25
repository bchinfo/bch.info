// Custom scripts here
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
}
