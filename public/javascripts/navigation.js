console.log("Inside scrolling.js");

$(document).ready(function() {

  var scrollLink = $('.scroll');


  // Smooth scrolling
  scrollLink.click(function(e) {
    console.log("click1");
    console.log(this);
    console.log(this.hash);
    e.preventDefault();
    $('body,html').animate({
      scrollTop: $(this.hash).offset().top
      //scrollTop: $(this.hash).offset()
    }, 1000 );
  });

})
