(function () {
  function autoRootFontSize() {
    document.documentElement.style.fontSize =
      Math.min(screen.width, document.documentElement.getBoundingClientRect().width) / 750 * 32 + 'px';
  }
  let Reg = /(phone|iPhone|iPad|iPod|Mobile|Android|backBerry|Windows Phone)/i;
  window.onload = function () {
    if (navigator.userAgent.match(Reg)) {
      window.addEventListener('resize', autoRootFontSize);
      autoRootFontSize();
    } else {
      document.querySelector('#app').style.maxWidth = '600px';
      document.querySelector('.footer-container').style.maxWidth = '600px';
      document.documentElement.style.fontSize = '16px';
    }
  }


})();