export function loadNewsletterForm() {
  let scrolledPercent;
  let loadingflag = true;

  document.addEventListener('scroll', () => {
    // eslint-disable-next-line max-len
    const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100;
    scrolledPercent = Math.round(scrollPercentage);

    if (scrolledPercent > 70 && loadingflag) {
      loadingflag = false;
      document.querySelector('.newsletter-form.block').innerHTML = '<div id="edu-footer-widget"></div>';

      const formscript = document.createElement('script');
      formscript.type = 'text/javascript';
      formscript.src = 'https://www.phoenix.edu/request/static/includeWidget.js';
      formscript.setAttribute('data-mode', 'edu-footer-widget');
      document.querySelector('.newsletter-form.block').appendChild(formscript);
    }
  });
}
