// Some general UI pack related JS
// Extend JS String with repeat method
String.prototype.repeat = function(num) {
  return new Array(num + 1).join(this);
};

(function($) {

  // Add segments to a slider
  $(function() {

    // Custom Selects
    $("select[name='large']").selectpicker({style: 'btn-lg btn-danger'});
    $("select[name='info']").selectpicker({style: 'btn-info'});
    $("select[name='continue']").selectpicker({ style: 'btn-sm btn-primary' });

    // Tabs
    $(".nav-tabs a").on('click', function (e) {
      e.preventDefault();
      $(this).tab("show");
    })

    // make code pretty
    window.prettyPrint && prettyPrint();
  });
})(jQuery);
