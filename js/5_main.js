var randomText = "Random !";
var resetText = "Reset !";
var buttonsMaps = ".btn-lg";
var buttonRandom = ".btn-random";
var timeRaffle = 1300;
var audioWin = new Audio("sound/win.wav");
var audioDrop = new Audio("sound/drop.wav");

$(buttonsMaps).click(function() {
  var el = $(this);
  el.addClass("disabled").removeClass("enabled");
  el.animateCss("flipOutX", function(p) {
    el.addClass("d-none");
  });
});

$(buttonRandom).click(function() {
  if ($(this).text() == randomText) {
    //Reset text
    $(this).text(resetText);
    // Sólo botones activados
    activated = $(".enabled");

    //Elegimos nodo random
    machMap = $(activated[Math.floor(Math.random()*activated.length)]);
    machMap.addClass("mapWin");

    setTimeout(function(){
      machMap.addClass("btn-success").removeClass("btn-outline-light");
      //Play sound Win
      audioWin.play();
    }, (timeRaffle - 100));

    setTimeout(function(){
      machMap.clone().appendTo(".modal-content");
      $('.modal').modal('toggle');
    }, (timeRaffle * 2.5));

    //secuential animation
    activated.each(function(i) {
      var $li = $(this);
      if (!$li.hasClass("mapWin")) {
        setTimeout(function() {
          //Play sound Drop
          audioDrop.currentTime = 0;
          audioDrop.play();
          $li.addClass("disabled").removeClass("enabled");
          $li.animateCss("hinge", function() {
            $li.addClass("d-none");
          });
        }, i * (timeRaffle / activated.length));
      }
    });

    setTimeout(function(){
      $(machMap).animateCss('rubberBand');
    }, timeRaffle);

  } else {
    //Reset button text
    $(this).text(randomText);
    //Reset button states
    $(buttonsMaps).removeClass("disabled btn-success d-none mapWin").addClass("enabled btn-outline-light");
    $('.modal .btn').remove();
  }
});

$.fn.extend({
  animateCss: function(animationName, callback) {
      var animationEnd = (function(el) {
      var animations = {
          animation: 'animationend',
          OAnimation: 'oAnimationEnd',
          MozAnimation: 'mozAnimationEnd',
          WebkitAnimation: 'webkitAnimationEnd',
      };

      for (var t in animations) {
          if (el.style[t] !== undefined) {
          return animations[t];
          }
      }
      })(document.createElement('div'));

      this.addClass('animated ' + animationName).one(animationEnd, function() {
      $(this).removeClass('animated ' + animationName);

      if (typeof callback === 'function') callback();
      });

      return this;
  },
});