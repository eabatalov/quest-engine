// Some general UI pack related JS
// Extend JS String with repeat method
String.prototype.repeat = function(num) {
  return new Array(num + 1).join(this);
};

(function($) {


  $(function() {

      // Load Boodstrap.select.js
      $("select[name='id']").selectpicker({ style: 'btn-sm btn-default' });
      $("select[name='phraseType']").selectpicker({ style: 'btn-sm btn-default' });
      $("select[name='objToAddId']").selectpicker({ style: 'btn-sm btn-default' });
      $("select[name='continue']").selectpicker({ style: 'btn-sm btn-default' });

    // NavigationSidebar with Toggle
    $("#menu-toggle").click(function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("active");
    });

    // make code pretty
    window.prettyPrint && prettyPrint();
  });
})(jQuery);
