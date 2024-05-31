import {
  sampleRUM,
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
  loadScript,
  getMetadata,
} from './aem.js';
import wrapImgsInLinks from './utils.js';
import {
  a, p, div, span, img,
} from './dom-helpers.js';

const LCP_BLOCKS = []; // add your LCP blocks to the list

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  console.log('buildHeroBlock');
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  /* if(picture) {
    const img = picture.querySelector('img');
    if(img) {
      img.setAttribute('loading', 'eager');
    }
  } */
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_FOLLOWING)) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * Returns true if the page is an article based on the template metadata.
 * @returns {boolean}
 */
function isArticlePage() {
  return getMetadata('template') === 'Blog Article';
}

/**
 * Builds an article header and prepends to main in a new section.
 * @param main
 */
function buildArticleHeader(main) {
  if (main.querySelector('.article-header')) {
    // already got an article header
    return;
  }

  const publicationDate = getMetadata('date-read-time');
  const writer = getMetadata('writer');
  const writerHref = getMetadata('writer-link');
  const writerImage = getMetadata('writer-image');
  const reviewer = getMetadata('reviewer');
  const reviewerHref = getMetadata('reviewer-link');
  const reviewerDescription = getMetadata('reviewer-description');
  const reviewerImage = getMetadata('reviewer-image');

  /* eslint-disable function-paren-newline */
  main.prepend(div(buildBlock('article-header', [
    [main.querySelector('h1')],
    [
      p({ class: 'publication-date' }, publicationDate),
      p(
        { class: 'social-container' },
        a({ href: `https://twitter.com/intent/tweet?text=Check+this+out:=${window.location}` },
          span({ classList: ['icon', 'icon-twitter-black'] }, img({ src: '/icons/twitter-black.svg', alt: 'twitter', class: 'icon' }))),
        a({ href: `https://www.facebook.com/sharer/sharer.php?u=${window.location}` },
          span({ classList: ['icon', 'icon-facebook-black'] }, img({ src: '/icons/facebook-black.svg', alt: 'facebook', class: 'icon' }))),
        a({ href: `https://www.linkedin.com/cws/share?url=${window.location}` },
          span({ classList: ['icon', 'icon-linkedin-black'] }, img({ src: '/icons/linkedin-black.svg', alt: 'linkedin', class: 'icon' }))),
        // eslint-disable-next-line no-script-url
        a({ href: 'javascript:void((function()%7Bvar%20e=document.createElement(\'script\');e.setAttribute(\'type\',\'text/javascript\');e.setAttribute(\'charset\',\'UTF-8\');e.setAttribute(\'src\',\'//assets.pinterest.com/js/pinmarklet.js?r=%27+Math.random()*99999999);document.body.appendChild(e)%7D)());' },
          span({ classList: ['icon', 'icon-pinterest-black'] }, img({ src: '/icons/pinterest-black.svg', alt: 'pinterest', class: 'icon' }))),
        a({ href: `mailto:?subject=How%20to%20Prepare%20for%20an%20Unpredictable%20Job%20Market%20&body=%20Check%20this%20out:%20${window.location}` },
          span({ classList: ['icon', 'icon-email-black'] }, img({ src: '/icons/email-black.svg', alt: 'email', class: 'icon' }))),
      ),
    ],
    [
      div(
        { class: 'writer-details' },
        p(
          img({ src: writerImage, alt: writer, class: 'icon' }),
        ),
        p(
          'Written by ',
          a({ href: writerHref }, writer),
        ),
      ),
      div(
        { class: 'reviewer-details' },
        p(
          img({ src: reviewerImage, alt: reviewer, class: 'icon' }),
        ),
        p(
          'Reviewed by ',
          a({ href: reviewerHref }, reviewer),
          ` ${reviewerDescription}`,
        ),
      ),
    ],
  ])));
  /* eslint-enable function-paren-newline */
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
    if (isArticlePage) {
      // buildArticleHeader(main);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  wrapImgsInLinks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();

  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));

  /* scroll handling to keep aside-nav in view for desktop */
  if (window.innerWidth > 990) {
    const asideDiv = document.querySelector('.aside-nav');
    const footer = document.querySelector('footer');
    window.addEventListener('scroll', () => {
      const footerTop = footer.getBoundingClientRect().top;
      const divHeight = asideDiv.offsetHeight;
      if (footerTop < window.innerHeight) {
        asideDiv.style.top = `${document.body.scrollTop + footerTop - divHeight}px`;
      } else if (footerTop - window.innerHeight > (0.2 * window.innerHeight)) {
        asideDiv.style.top = '150px';
      }
    });
  }

  /* request Info button for mobile view */
  if (window.innerWidth < 991) {
    const requestInfoButtonContainer = document.createElement('div');
    requestInfoButtonContainer.classList.add('section');
    requestInfoButtonContainer.classList.add('request-info-button-mobile');
    const requestInfoButtonWrapper = document.createElement('div');
    const requestInfoButton = document.createElement('a');
    requestInfoButton.setAttribute('href', 'https://www.phoenix.edu/request/international-student');
    requestInfoButton.innerText = 'Request Info';
    requestInfoButtonWrapper.appendChild(requestInfoButton);
    requestInfoButtonContainer.appendChild(requestInfoButtonWrapper);
    const footer = document.querySelector('footer');
    main.parentElement.insertBefore(requestInfoButtonContainer, footer);
    window.addEventListener('scroll', () => {
      requestInfoButtonContainer.style.visibility = 'visible';
      const footerTop = footer.getBoundingClientRect().top;
      if (footerTop < window.innerHeight) {
        requestInfoButtonContainer.style.position = 'static';
      } else {
        requestInfoButtonContainer.style.position = 'fixed';
      }
    });
  }

  // Load Launch script for tag manager
  loadScript('https://assets.adobedtm.com/7679441b2bf7/5d94d460e974/launch-4c68fe2386f7.min.js');
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
