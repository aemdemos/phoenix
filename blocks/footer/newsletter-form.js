export function loadNewsletterForm() {
  var scrolledPercent;
  var loadingflag = true;

  document.addEventListener('scroll', function () {
    let scrollPercentage = window.scrollY / (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 100;
    scrolledPercent = Math.round(scrollPercentage);

    if (scrolledPercent > 70 && loadingflag) {
      loadingflag = false;
      document.querySelector('.newsletter-form.block').innerHTML = '<div id="edu-footer-widget"></div>';

      var formscript = document.createElement('script');
      formscript.type = 'text/javascript';
      formscript.src = 'https://www.phoenix.edu/request/static/includeWidget.js';
      formscript.setAttribute('data-mode', 'edu-footer-widget');
      //	formscript.async = 'true';
      //	console.log('script ', formscript);
      document.querySelector('.newsletter-form.block').appendChild(formscript);
    }
  })
}
