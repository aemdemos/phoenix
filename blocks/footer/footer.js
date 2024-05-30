import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import {loadNewsletterForm} from "./newsletter-form.js";

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // load newsletter form
  loadNewsletterForm();



  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  const innerDiv = document.createElement('div');
  innerDiv.classList.add('footer-top-inner');
  // footer.append(fragment);
  while (fragment.firstElementChild) innerDiv.append(fragment.firstElementChild);
  footer.append(innerDiv);



  block.append(footer);
}



