jQuery(document).ready(function($){
      //portfolio - show link
      $('.project-overlay').hover(
          function () {
              $(this).animate({opacity:'1'});
              $('.project-subtitle').animate({opacity:'1'});
          },
          function () {
              $(this).animate({opacity:'0'});
              $('.project-subtitle').animate({opacity:'0'});
          }
      ); 
  });

jQuery(document).ready(function($){
      //portfolio - show link
      $('.team-overlay').hover(
          function () {
              $(this).animate({opacity:'1'});
              $('.team-subtitle').animate({opacity:'1'});
          },
          function () {
              $(this).animate({opacity:'0'});
              $('.team-subtitle').animate({opacity:'0'});
          }
      ); 
  });


//jQuery to collapse the navbar on scroll
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});

//jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('.page-scroll a').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});