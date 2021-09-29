button = document.querySelector('.explore');

button.addEventListener('click', function(e){
    var x = e.layerX + 10;
    var y = e.layerY + 5;

    console.log(e);
    let ripple = document.createElement('span');

    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    this.appendChild(ripple);

    setTimeout(() => {
        ripple.remove()
    }, 500);

});