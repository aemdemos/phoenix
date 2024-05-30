import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { loadNewsletterForm } from './newsletter-form.js';

function ratingStars(stars) {
    switch (stars) {
      case 0:
        return "https://www.phoenix.edu/content/dam/edu/img/trustpilot/new/Trustpilot_ratings_0star_grey-RGB-128x24.png"
        break;
      case 1:
        return "https://www.phoenix.edu/content/dam/edu/img/trustpilot/new/Trustpilot_ratings_1star-RGB-128x24.png"
        break;
      case 1.5:
        return "https://www.phoenix.edu/content/dam/edu/img/trustpilot/new/Trustpilot_ratings_1halfstar-RGB-128x24.png"
        break;
      case 2:
        return "https://www.phoenix.edu/content/dam/edu/img/trustpilot/new/Trustpilot_ratings_2star-RGB-128x24.png"
        break;
      case 2.5:
        return "https://www.phoenix.edu/content/dam/edu/img/trustpilot/new/Trustpilot_ratings_2halfstar-RGB-128x24.png"
        break;
      case 3:
        return "https://www.phoenix.edu/content/dam/edu/img/trustpilot/new/Trustpilot_ratings_3star-RGB-128x24.png"
        break;
      case 3.5:
        return "https://www.phoenix.edu/content/dam/edu/img/trustpilot/new/Trustpilot_ratings_3halfstar-RGB-128x24.png"
        break;
      case 4:
        return "https://www.phoenix.edu/content/dam/edu/img/trustpilot/new/Trustpilot_ratings_4star-RGB-128x24.png"
        break;
      case 4.5:
        return "https://www.phoenix.edu/content/dam/edu/img/trustpilot/new/Trustpilot_ratings_4halfstar-RGB-128x24.png"
        break;
      case 5:
        return "https://www.phoenix.edu/content/dam/edu/img/trustpilot/new/Trustpilot_ratings_5star-RGB-128x24.png"
        break;
      default:
        return "https://www.phoenix.edu/content/dam/edu/img/trustpilot/new/Trustpilot_ratings_4halfstar-RGB-128x24.png"
    }
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
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
  const footer_top = footer.querySelector('.section.footer-top');
  const footer_top_columns = document.createElement('div');
  footer_top_columns.classList.add('footer-top-columns');
  const footer_form_container = document.createElement('div');
  footer_form_container.classList.add('footer-form-container');

  footer_form_container.append(footer.querySelector('.newsletter-form-wrapper'));
  footer_top_columns.append(footer.querySelector('.default-content-wrapper'));
  footer_top_columns.append(footer_form_container);

  footer_top.innerHTML = '';
  footer_top.append(footer_top_columns);
  footer_top.append(footer.querySelector('.section.discover-more'));
  // footer.querySelector('.section.discover-more').remove();

  // Decorate trustscore container
  const trustscore = footer.querySelector('.section.trustscore').getAttribute('data-score');
  const reviews = footer.querySelector('.section.trustscore').getAttribute('data-reviews');
  footer.querySelector('.section.trustscore').remove();
  const trustscore_box = document.createElement('div');
  trustscore_box.classList.add('trustscore-box');
  trustscore_box.innerHTML = `
      <img src="${ratingStars(trustscore)}" alt="rating" />
      <span class="trustscore-text">TrustScore: <span class="trustscore-rating">${trustscore}</span></span>
      <div>
        <span><a href="https://www.phoenix.edu/life-as-a-phoenix/reviews.html"> <span class="trustscore-reviews">${reviews} reviews</span></a> </span>
      </div>`;
  footer_form_container.append(trustscore_box);


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
  const footer_bottom = document.createElement('div');
  const footer_bottom_left = document.createElement('div');
  const footer_bottom_right = document.createElement('div');
  footer_bottom.classList.add('footer-bottom');
  footer_bottom_left.classList.add('footer-bottom-left');
  footer_bottom_right.classList.add('footer-bottom-right');

  footer_bottom_right.append(footer.querySelector('.section.social-media-links > div > ul'));
  footer_bottom_left.append(footer.querySelector('.section.footer-logo p'));
  footer_bottom_left.append(footer.querySelector('.section.footer-bottom > div'));

  footer_bottom.append(footer_bottom_left);
  footer_bottom.append(footer_bottom_right);

  footer.querySelector('.section.footer-bottom').remove();
  footer.querySelector('.section.social-media-links').remove();
  footer.querySelector('.section.footer-logo').remove();
  footer.append(footer_bottom);

  // Adjust logo width
  footer.querySelector('.footer-bottom-left img').style.width = '33px';
  footer.querySelector('.footer-bottom-left img').style.height = 'auto';

  block.append(footer);
}
