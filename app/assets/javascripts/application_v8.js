$(document).ready(function() {

  // Turn off jQuery animation
  jQuery.fx.off = true;

  // Use GOV.UK selection-buttons.js to set selected
  // and focused states for block labels
  var $blockLabels = $(".block-label input[type='radio'], .block-label input[type='checkbox']");
  new GOVUK.SelectionButtons($blockLabels);

  // Details/summary polyfill
  // See /javascripts/vendor/details.polyfill.js

  // Where .block-label uses the data-target attribute
  // to toggle hidden content
  // var toggleContent = new ShowHideContent();
  // toggleContent.showHideRadioToggledContent();
  // toggleContent.showHideCheckboxToggledContent();

  $('.form-control-radio').on('click',function(e)
  {
    // save the clicked label
    var self = this;

    // grab the fieldset containing it
    var fs = $(this).closest('fieldset');

    // for each label in that fieldset
    $(fs).find('label').each(function(i,e)
    {
      // find the target it's pointing to
      var target = $(this).data('target');

      // if it's the clicked label show it's target
      if (this == self) $('#'+target).show();

      // otherwise hide it's target
      else $('#'+target).hide();
    });
  });

  $('.form-control-checkbox').on('click',function(e)
  {
    var target = $(this).data('target');
    $('#'+target).toggle();
  });

  $('#skiplink-container div').append('<a id="toggle-highcontrast" href="#" class="skiplink">High contrast version</a>');
  $('#skiplink-container div').append('<a id="toggle-remove" href="#" class="skiplink">Remove high contrast</a>');

  // High Contrast temp
  $('#toggle-highcontrast').click(function()
  {
    $("body").addClass("highcontrast");
    return true;
  });
  $('#toggle-remove').click(function()
  {
    $("body").removeClass("highcontrast");
    return true;
  });

  $('input, textarea').attr({
    "autocomplete":"off",
    "autocorrect":"off",
    "autocapitalize":"off",
    "spellcheck":"false"
  });

});
