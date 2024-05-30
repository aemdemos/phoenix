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
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  const footer_top = footer.querySelector('.section.footer-top');
  const footer_top_columns = document.createElement('div');
  footer_top_columns.classList.add('footer-top-columns');
  const footer_form_container = document.createElement('div');
  footer_form_container.classList.add('footer-form-container');

  footer_form_container.append(footer.querySelector('.newsletter-form-wrapper'));
  footer_form_container.append(footer.querySelector('.trustscore-wrapper'));
  footer_top_columns.append(footer.querySelector('.default-content-wrapper'));
  footer_top_columns.append(footer_form_container);

  const discover_more = document.createElement('div');
  discover_more.classList.add('discover-more-container');
  const discover_more_text = document.createElement('div');
  discover_more_text.classList.add('discover-more-text');
  discover_more_text.innerHTML = 'Discover More';
  discover_more.append(discover_more_text);
  discover_more.append(footer.querySelector('.discover-more-wrapper'));

  footer_top.innerHTML = '';
  footer_top.append(footer_top_columns);
  footer_top.append(discover_more);
  block.append(footer);
}



