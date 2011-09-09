$(function(){

  // animated scrolling
  function animate_scroll(id) {
    $("html,body").animate({scrollTop: $("#"+id).offset().top}, "slow");
  }

  var $primary_nav = $("nav ul.primary-nav");

  // toggle active section
  var activeTarget,
      $window = $(window),
      nav = $primary_nav.find("li a"),
      targets = nav.map(function () {
        return $(this).attr('href');
      }),
      offsets = $.map(targets, function (id) {
        return $(id).offset().top;
      });

  function setButton(id) {
    nav.parent("li").removeClass('active');
    $(nav[$.inArray(id, targets)]).parent("li").addClass('active');
  }

  function processScroll(e) {
    var scrollTop = $window.scrollTop() + 10, i;
    for (i = offsets.length; i--;) {
      if (activeTarget != targets[i] && scrollTop >= offsets[i] && (!offsets[i + 1] || scrollTop <= offsets[i + 1])) {
        activeTarget = targets[i];
        setButton(activeTarget);
      }
    }
  }

  nav.click(function () {
    processScroll();
    animate_scroll($(this).attr("href").split("#")[1]);
  });

  processScroll();

  $window.scroll(function(e) {
    processScroll();
  });

  // dropdown behavior
  $("body").bind("click", function(e) {
    $(".menu").parent("li").removeClass("open");
  });
  $(".menu .trigger").click(function(e) {
    var $li = $(this).parent("li").toggleClass("open");
    return false;
  });

  // flash message behaviors
  $("body:not('.message').alert-message.flash").delay(2800).fadeOut('slow');
  $('.alert-message.flash a.close').click(function(e){
    $('.alert-message.flash').clearQueue();
    $(this).parent(".flash").fadeOut('slow');
    e.preventDefault();
  });

  // Override the default confirmation dialog
  $.rails.allowAction = function(element) {
    var type = element.data("type");
    var confirmText = element.data("confirm-text") || "Confirm";
    var cancelText = element.data("cancel-text") || "Cancel";
    var message = element.data('confirm'),
        answer = false, callback;

    if (!message) { return true; }

    if ($.rails.fire(element, 'confirm')) {
      custom_confirm(type, message, confirmText, cancelText, function(answer) {
        callback = $.rails.fire(element, 'confirm:complete', [answer]);
        if(callback) {
          var oldAllowAction = $.rails.allowAction;
          $.rails.allowAction = function() { return true; };
          element.trigger('click');
          $.rails.allowAction = oldAllowAction;
        }
      });
    }
    return false;
  };

  // Build the custom confirmation dialog
  function custom_confirm(type, message, confirm, cancel, callback) {
    var $mask = $("div.message-mask");
    var $dialog = $("div.alert-message.block-message");
    var $confirm = $dialog.find(".alert-actions a.btn.confirm");
    var $cancel = $dialog.find(".alert-actions a.btn.cancel");

    $confirm.text(confirm);
    $cancel.text(cancel);
    $mask.show();
    $dialog.show().removeClass("notice success warning error").addClass(type.toLowerCase()).find("p").html("").prepend("<strong>" + type + "</strong> " + message);

    $confirm.click(function(e){
      callback(message);
      fade_dialogs();
      e.preventDefault();
    });

    $cancel.click(function(e){
      fade_dialogs();
      e.preventDefault();
    });

    $mask.css("height", $(document).height());
    $(window).bind("resize", function(){
      $mask.css("height", $(window).height());
    });

    function fade_dialogs() {
      $dialog.fadeOut(200);
      $mask.fadeOut(200);
    }
  }

  // tab group behaviors
  $('ul.tabs li a').click(function(e){
    var current_section = "#" + $('ul.tabs li.active a').attr('class');
    var next_section = "#" + $(this).attr('class');

    $('section' + current_section).removeClass('active');
    $('section' + next_section).addClass('active');

    $(this).parent('ul.tabs li').siblings('.active').removeClass('active');
    $(this).parent('li').addClass('active');

    e.preventDefault();
  });

  // lightbox behaviors
  var $lightbox = $("#lightbox");
  $("body *[data-lightbox]").click(function(e) {
    var $this = $(this);
    var source = $($this.data("lightbox"));
    var title = $this.data("lightbox-title");
    $lightbox.show().find(".modal-body").html(source.html()).end().find(".modal-header h3").text(title);
    e.preventDefault();
  });
  $lightbox.find("a.close").click(function(e) {
    $lightbox.fadeOut(275);
    e.preventDefault();
  });

  // tooltip behaviors
  $("body *[data-tooltip]").tipsy({gravity: 's', title: 'data-tooltip'});

});