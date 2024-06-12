import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import loadNewsletterForm from './newsletter-form.js';

function ratingStars(stars) {
  switch (stars) {
    case 0:
      return 'https://www.phoenix.edu/content/dam/edu/img/trustpilot/new/Trustpilot_ratings_0star_grey-RGB-128x24.png';
    case 1:
      return 'https://www.phoenix.edu/content/dam/edu/img/trustpilot/new/Trustpilot_ratings_1star-RGB-128x24.png';
    case 1.5:
      return 'https://www.phoenix.edu/content/dam/edu/img/trustpilot/new/Trustpilot_ratings_1halfstar-RGB-128x24.png';
    case 2:
      return 'https://www.phoenix.edu/content/dam/edu/img/trustpilot/new/Trustpilot_ratings_2star-RGB-128x24.png';
    case 2.5:
      return 'https://www.phoenix.edu/content/dam/edu/img/trustpilot/new/Trustpilot_ratings_2halfstar-RGB-128x24.png';
    case 3:
      return 'https://www.phoenix.edu/content/dam/edu/img/trustpilot/new/Trustpilot_ratings_3star-RGB-128x24.png';
    case 3.5:
      return 'https://www.phoenix.edu/content/dam/edu/img/trustpilot/new/Trustpilot_ratings_3halfstar-RGB-128x24.png';
    case 4:
      return 'https://www.phoenix.edu/content/dam/edu/img/trustpilot/new/Trustpilot_ratings_4star-RGB-128x24.png';
    case 4.5:
      return 'https://www.phoenix.edu/content/dam/edu/img/trustpilot/new/Trustpilot_ratings_4halfstar-RGB-128x24.png';
    case 5:
      return 'https://www.phoenix.edu/content/dam/edu/img/trustpilot/new/Trustpilot_ratings_5star-RGB-128x24.png';
    default:
      return 'https://www.phoenix.edu/content/dam/edu/img/trustpilot/new/Trustpilot_ratings_4halfstar-RGB-128x24.png';
  }
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  block.remove();
  const resp = await fetch('/clientlibs/footer.contentonly.html');
  if (resp.ok) {
    const body = document.querySelector('body');
    const footerDiv = document.createElement('div');
    footerDiv.innerHTML = await resp.text();
    body.append(footerDiv);
    const scr = document.createElement('script');
    scr.text = footerDiv.querySelector('script').innerHTML;
    body.append(scr);
  }
  return;
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  const isDesktop = window.matchMedia('(min-width: 900px)');

  // load newsletter form
  loadNewsletterForm();

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Restructure footer top
  const footerTop = footer.querySelector('.section.footer-top');
  const footerTopColumn = document.createElement('div');
  footerTopColumn.classList.add('footer-top-columns');
  const footerFormContainer = document.createElement('div');
  footerFormContainer.classList.add('footer-form-container');

  footerFormContainer.append(footer.querySelector('.newsletter-form-wrapper'));
  footerTopColumn.append(footer.querySelector('.default-content-wrapper'));
  footerTopColumn.append(footerFormContainer);

  footerTop.innerHTML = '';
  footerTop.append(footerTopColumn);
  footerTop.append(footer.querySelector('.section.discover-more'));
  // footer.querySelector('.section.discover-more').remove();

  // Decorate trustscore container
  const trustscore = footer.querySelector('.section.trustscore').getAttribute('data-score');
  const reviews = footer.querySelector('.section.trustscore').getAttribute('data-reviews');
  footer.querySelector('.section.trustscore').remove();
  const trustscoreBox = document.createElement('div');
  trustscoreBox.classList.add('trustscore-box');
  trustscoreBox.innerHTML = `
      <img src='${ratingStars(trustscore)}' alt='rating' />
      <span class='trustscore-text'>TrustScore: <span class='trustscore-rating'>${trustscore}</span></span>
      <div>
        <span><a href='https://www.phoenix.edu/life-as-a-phoenix/reviews.html'> <span class='trustscore-reviews'>${reviews} reviews</span></a> </span>
      </div>`;
  footerFormContainer.append(trustscoreBox);

  // Expand footer lists on click only on mobile view
  if (!isDesktop.matches) {
    const lists = footer.querySelectorAll('.footer-top-columns > div:first-of-type > ul > li');
    lists.forEach((list) => {
      list.addEventListener('click', () => {
        list.querySelector('ul').style.display = list.querySelector('ul').style.display === 'block' ? 'none' : 'block';
      });
    });
  }

  // Restructure footer bottom
  const footerBottom = document.createElement('div');
  const footerBottomLeft = document.createElement('div');
  const footerBottomRight = document.createElement('div');
  footerBottom.classList.add('footer-bottom');
  footerBottomLeft.classList.add('footer-bottom-left');
  footerBottomRight.classList.add('footer-bottom-right');

  footerBottomRight.append(footer.querySelector('.section.social-media-links > div > ul'));
  footerBottomLeft.append(footer.querySelector('.section.footer-logo p'));
  footerBottomLeft.append(footer.querySelector('.section.footer-bottom > div'));

  footerBottom.append(footerBottomLeft);
  footerBottom.append(footerBottomRight);

  footer.querySelector('.section.footer-bottom').remove();
  footer.querySelector('.section.social-media-links').remove();
  footer.querySelector('.section.footer-logo').remove();
  footer.append(footerBottom);

  // Adjust logo width
  footer.querySelector('.footer-bottom-left img').style.width = '33px';
  footer.querySelector('.footer-bottom-left img').style.height = 'auto';

  block.append(footer);
}
