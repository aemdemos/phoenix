export function loadNewsletterForm() {
  let scrolledPercent;
  let loadingflag = true;

  document.addEventListener('scroll', function () {
    // eslint-disable-next-line max-len
    const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100;
    scrolledPercent = Math.round(scrollPercentage);

    if (scrolledPercent > 70 && loadingflag) {
      loadingflag = false;
      document.querySelector('.newsletter-form.block').innerHTML = '<div id="edu-footer-widget"></div>';

      let formscript = document.createElement('script');
      formscript.type = 'text/javascript';
      formscript.src = 'https://www.phoenix.edu/request/static/includeWidget.js';
      formscript.setAttribute('data-mode', 'edu-footer-widget');
      //	formscript.async = 'true';
      //	console.log('script ', formscript);
      document.querySelector('.newsletter-form.block').appendChild(formscript);
    }
  })
}
