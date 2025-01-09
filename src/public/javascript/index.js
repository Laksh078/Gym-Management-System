function scrollWindow1(){
    window.scroll({top:1650, left: 0 ,behavior:'smooth'});
}
function scrollWindow2(){
    window.scroll({top:2650, left: 0 ,behavior:'smooth'});
}
function scrollWindow3(){
    window.scroll({top:3650, left: 0 ,behavior:'smooth'});
}
function scrollWindow4(){
    window.scroll({top:4650, left: 0 ,behavior:'smooth'});
}
function scrollWindow5(){
    window.scroll({top: window.innerHeight * 6.9 , left: 0 ,behavior:'smooth'});
}

function scrollToElement() {
    const element = document.getElementById('target-element');
    const elementPosition = element.getBoundingClientRect().top + window.scrollY
    
    window.scroll({
      top: elementPosition,
      behavior: 'smooth'
    });
  }

  window.addEventListener('resize', function() {
    // Example: Adjust scroll position when resizing
    scrollToElement();
  });


  