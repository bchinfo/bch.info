// CHIPs tags
$('.btn-tag-toggle').click(function() {
  // Activate/deactivate buttons
  if ($(this).hasClass('active') && !$(this).hasClass('btn-tag-toggle-all')) {
    $(this).removeClass('active');
  } else {
    $(this).addClass('active');
  }
  if ($(this).hasClass('btn-tag-toggle-all')) {
    $(this).siblings().removeClass('active');
  } else {
    if (!$('.btn-tag-toggle.active').length) {
      $('.btn-tag-toggle-all').addClass('active').focus();
    } else {
      $('.btn-tag-toggle-all').removeClass('active');
    }
  }
  // Show no CHIP matched message
  var showError = 1;
  if ($('.btn-tag-toggle-all').hasClass('active')) {
    showError = 0;
    $('.collapse-tag').removeClass('d-none');
  } else {
    // Show/hide CHIPs according to tags matched
    var tagActive = "";
    $('[data-tag-target]').each(function() {
      if ($(this).hasClass('active')) {
        tagActive = tagActive.concat('.'+$(this).data('tag-target'));
      }
    });
    $('.collapse-tag').each(function() {
      if ($(this).is(tagActive)) {
        showError = 0;
        $(this).removeClass('d-none');
      } else {
        $(this).addClass('d-none');
      }
    });
  }
  if (showError) {
    $('#tag-error').removeClass('d-none');
  } else {
    $('#tag-error').addClass('d-none');
  }
});
