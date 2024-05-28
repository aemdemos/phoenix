import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import {
  a, button, div, img, input, label, span,
} from '../../scripts/dom-helpers.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  // const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  // button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('role', 'button');
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('role');
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }
  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

function openHeaderOverlay() {
  const headerOverlay = document.querySelector('.header-overlay');
  headerOverlay.classList.add('active');
  const searchHeader = document.querySelector('.header-search');
  searchHeader.classList.add('selected');
  const quickSearches = document.querySelector('.header-search .quick-searches');
  quickSearches.classList.add('active');
}

function closeHeaderOverlay() {
  const headerOverlay = document.querySelector('.header-overlay');
  headerOverlay.classList.remove('active');
  const searchHeader = document.querySelector('.header-search');
  searchHeader.classList.remove('selected');
  const quickSearches = document.querySelector('.header-search .quick-searches');
  quickSearches.classList.remove('active');
}

function createSearchSection(searchSection) {
  const searchDiv = document.createElement('div');

  const headerOverlay = div({ class: 'header-overlay' });

  const searchIcon = searchSection.querySelector('.default-content-wrapper p:first-of-type picture').cloneNode();
  const closeIcon = searchSection.querySelector('.default-content-wrapper p:nth-of-type(2) picture:nth-of-type(2)');

  const labelEl = searchSection.querySelector('.default-content-wrapper p:nth-of-type(3)');
  const list = searchSection.querySelector('.default-content-wrapper ul:first-of-type');
  list.classList.add('quick-searches');
  list.classList.add('active');
  list.querySelector('li:nth-child(1)').className = 'heading';

  const searchHeader = div(
    { class: 'header-search' },
    div(
      { class: 'search-circle' },
      div(
        { class: 'floating-placeholder' },
        input(
          { class: 'search-box', id: 'searchBox' },
        ),
        label({ class: 'floating-label', for: 'searchBox' }, labelEl.innerText),
      ),
      button({ class: 'search-icon', 'aria-label': 'search University of Phoenix' }, span({ class: 'icon' }, searchIcon)),
    ),
    div({ class: 'search-results-container' }, list),
    a(
      { class: 'close-icon', 'aria-label': 'close search menu' },
      div(
        { class: 'close-text-icon', onClick: closeHeaderOverlay },
        span({ class: 'close-text' }, 'Close'),
        closeIcon,
      ),
    ),
  );

  const searchImg = searchSection.querySelector('picture:first-of-type');
  const searchIconButton = button({
    class: 'icon-button-circle search-icon',
    onclick: openHeaderOverlay,
  }, span({ class: 'icon' }, searchImg));

  searchDiv.append(headerOverlay);
  searchDiv.append(searchHeader);
  searchDiv.append(searchIconButton);
  searchSection.remove();
  return searchDiv;
}

function createNavTop(searchDiv, phoneIconButton) {
  const navTop = div({ class: 'nav-top' }, searchDiv, phoneIconButton);
  return navTop;
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/draft/absarasw/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const headerTop = document.createElement('div');
  headerTop.className = 'header-top';
  headerTop.append(nav.children[0]);

  const headerNavDiv = document.createElement('div');
  headerNavDiv.className = 'header-nav';
  headerNavDiv.append(div(
    { class: 'header-left' },
    nav.children[0].children[0].children[0],
    div({ class: 'nav-sections' }, nav.children[2].children[0].children[0]),
  ));
  nav.children[0].remove();
  nav.children[1].remove();

  const navOverallContainer = document.createElement('div');
  navOverallContainer.className = 'nav-overall';
  const navRightContainer = document.createElement('div');
  navRightContainer.className = 'nav-right';
  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  const divTop = document.createElement('div');
  const divMid = document.createElement('div');
  const divBottom = document.createElement('div');
  divBottom.innerHTML = '<span>MENU</span>';
  hamburger.append(divTop);
  hamburger.append(divMid);
  hamburger.append(divBottom);

  const iconsContainer = document.createElement('div');
  iconsContainer.classList.add('nav-icons');
  const searchDiv = createSearchSection(nav.children[0]);

  // const phoneIconButton = document.createElement('button');
  // phoneIconButton.classList.add('icon-button-circle');
  // phoneIconButton.innerHTML = '<span class="icon"><img src="/icons/phone.svg" /></span>';
  const phoneIconButton = a(
    { class: 'icon-button-circle', href: 'tel:844-937-8679', 'aria-label': 'Call University of Phoenix: 844-937-8679' },
    span(
      { class: 'icon' },
      img({ src: '/icons/phone.svg' }),
    ),
  );
  if (!isDesktop.matches) {
    iconsContainer.append(searchDiv);
    iconsContainer.append(phoneIconButton);
  }

  const requestInfo = div(
    { class: 'request-info' },
    a({ class: 'header-button-redborder', href: '/request/international-student' }, 'Request Info'),
  );

  navRightContainer.append(requestInfo);
  navRightContainer.append(iconsContainer);
  navRightContainer.append(hamburger);

  headerNavDiv.append(navRightContainer);

  navOverallContainer.append(headerNavDiv);

  nav.prepend(navOverallContainer);

  if (isDesktop.matches) {
    const navTop = createNavTop(searchDiv, phoneIconButton);
    nav.prepend(navTop);
  }

  /* const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  } */

  const navSections = navOverallContainer.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));

  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(headerTop);
  navWrapper.append(nav);
  block.append(navWrapper);
}
