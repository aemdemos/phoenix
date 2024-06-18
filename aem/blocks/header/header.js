// import { a, div, p } from '../../scripts/dom-helpers.js';
import { loadScript } from '../../scripts/aem.js';

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  block.remove();
  const resp = await fetch('/content/experience-fragments/edu/us/en/site/header/master.contentonly.html');
  if (resp.ok) {
    const body = document.querySelector('body');
    const headerDiv = document.createElement('div');
    headerDiv.innerHTML = await resp.text();
    body.append(headerDiv);
    // const headerContainer = headerDiv.querySelector('.cmp-header');
    // headerContainer.classList.add('alertWindowMargin');
    // const announcementBar = div(
    //   { id: 'announcementBar', class: 'container' },
    //   p({ id: 'alertCopy' }, 'Request a ', a({ class: 'alertWindowLink', href: '#' }, 'Free Scholarships and Savings Guide')),
    // );
    // headerContainer.prepend(announcementBar);
    loadScript('/etc.clientlibs/phxedu/clientlibs/clientlib-common-library.min.js').then(() => {
      const event = new Event('DOMContentLoaded', {
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(event);
    });
  }
}
