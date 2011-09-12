$(function(){

  FengShui = {

    // cache frequently used selectors
    primary_nav : $("nav ul.primary-nav"),
    mask : $("div.message-mask"),
    lightbox : $("#lightbox"),
    popover : $(".popover-wrapper"),

    init : function() {
      // google prettify
      prettyPrint();

      // initialize FengShui behaviors
      FengShui.scrolling_behaviors();
      FengShui.dropdown_behaviors();
      FengShui.flash_behaviors();
      FengShui.confirmation_override();
      FengShui.tab_behaviors();
      FengShui.pill_behaviors();
      FengShui.lightbox_behaviors();
      FengShui.popover_behaviors();
      FengShui.tooltip_behaviors();
    },

    scrolling_behaviors : function() {
      // animated scrolling
      function animate_scroll(id) {
        $("html,body").animate({scrollTop: $("#"+id).offset().top}, "slow");
      }

      // toggle active section
      var activeTarget,
          $window = $(window),
          nav = FengShui.primary_nav.find("li a"),
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
    },

    dropdown_behaviors : function() {
      // dropdown behaviors
      $("body").bind("click", function(e) {
        $(".menu").parent("li").removeClass("open");
      });
      $(".menu .trigger").click(function(e) {
        var $li = $(this).parent("li").toggleClass("open");
        return false;
      });
    },

    flash_behaviors : function() {
      // flash message behaviors
      $("body:not('.welcome') .alert-message.flash").delay(2800).fadeOut('slow');
      $('.alert-message.flash a.close').click(function(e){
        $('.alert-message.flash').clearQueue();
        $(this).parent(".flash").fadeOut('slow');
        e.preventDefault();
      });
    },

    confirmation_override : function() {
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
        var $dialog = $("div.alert-message.block-message");
        var $confirm = $dialog.find(".alert-actions a.btn.confirm");
        var $cancel = $dialog.find(".alert-actions a.btn.cancel");

        $confirm.text(confirm);
        $cancel.text(cancel);
        FengShui.mask.show();
        $dialog.show().attr("class", "alert-message block-message " + type.toLowerCase()).find("p").html("").prepend("<strong>" + type + "</strong> " + message);

        $confirm.click(function(e){
          callback(message);
          fade_dialogs();
          e.preventDefault();
        });

        $cancel.click(function(e){
          fade_dialogs();
          e.preventDefault();
        });

        FengShui.mask.css("height", $(document).height());
        $(window).bind("resize", function(){
          FengShui.mask.css("height", $(window).height());
        });

        function fade_dialogs() {
          $dialog.fadeOut(200);
          FengShui.mask.fadeOut(200);
        }
      }
    },

    tab_behaviors : function() {
      // tab group behaviors
      $('ul.tabs li a').click(function(e){
        var current_section = $('ul.tabs li.active a').data('tab');
        var next_section = $(this).data('tab');

        $(current_section).removeClass('active');
        $(next_section).addClass('active');

        $(this).parent('ul.tabs li').siblings('.active').removeClass('active');
        $(this).parent('li').addClass('active');

        e.preventDefault();
      });
    },

    pill_behaviors : function() {
      // pill group behaviors
      $('ul.pills li a').click(function(e){
        var current_section = $('ul.pills li.active a').data('pill');
        var next_section = $(this).data('pill');

        $(current_section).removeClass('active');
        $(next_section).addClass('active');

        $(this).parent('ul.pills li').siblings('.active').removeClass('active');
        $(this).parent('li').addClass('active');

        e.preventDefault();
      });
    },

    lightbox_behaviors : function() {
      // lightbox behaviors
      $("body *[data-lightbox]").click(function(e) {
        var $this = $(this);
        var source = $($this.data("lightbox"));
        var title = $this.data("lightbox-title");
        FengShui.mask.show();
        FengShui.lightbox.show().find(".modal-body").html(source.html()).end().find(".modal-header h3").text(title);
        e.preventDefault();
      });

      FengShui.lightbox.find("a.close").click(function(e) {
        FengShui.lightbox.fadeOut(200);
        FengShui.mask.fadeOut(200);
        e.preventDefault();
      });
    },

    popover_behaviors : function() {
      // popover behaviors
      $("body").bind("click", function(event) {
        if ($(event.target).closest(FengShui.popover).length > 0) {

        } else {
          FengShui.popover.removeClass("open");
        }
      });

      $("body *[data-popover]").click(function(e) {
        var $this = $(this);
        var source = $($this.data("popover"));
        var title = $this.data("popover-title");
        var direction = $this.data("popover-direction");
        var $contents = FengShui.popover.find(".popover");

        $contents.addClass(direction).css({
          "left" : e.pageX + 15,
          "top" : e.pageY
        });
        if (direction == "left") {
          $contents.css("margin-left", -$contents.width());
        } else if (direction == "right") {
          $contents.css("margin-right", -$contents.width());
        } else {
          $contents.addClass("right").css("margin-right", -$contents.width());
        }
        FengShui.popover.find(".content").html(source.html()).end().find("h3.title").text(title);

        var $show = FengShui.popover.addClass("open");
        $contents.css("margin-top", -(Math.round($contents.outerHeight() / 2)));
        return false;
      });
    },

    tooltip_behaviors : function() {
      // tooltip behaviors
      $("body *[data-tooltip]").tipsy({gravity: 's', title: 'data-tooltip'});
    }
  };

  FengShui.init();
});