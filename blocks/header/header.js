import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import {
  a, button, div, img, input, label, span, ul,
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
  const searchIcon = document.querySelector('.icon-button-circle.search-icon');
  searchIcon.classList.add('hide');
}

function closeHeaderOverlay() {
  const headerOverlay = document.querySelector('.header-overlay');
  headerOverlay.classList.remove('active');
  const searchHeader = document.querySelector('.header-search');
  searchHeader.classList.remove('selected');
  const quickSearches = document.querySelector('.header-search .quick-searches');
  quickSearches.classList.remove('active');
  const searchIcon = document.querySelector('.icon-button-circle.search-icon');
  searchIcon.classList.remove('hide');
}

function createSearchSection(searchSection) {
  const searchDiv = document.createElement('div');

  const headerOverlay = div({ class: 'header-overlay' });

  // const searchIcon =
  // searchSection.querySelector('.default-content-wrapper p:first-of-type picture').cloneNode();
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
      button(
        { class: 'search-icon', 'aria-label': 'search University of Phoenix' },
        span(
          { class: 'icon' },
          img({ src: '/icons/search.svg' }),
        ),
      ),
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

  // const searchImg = searchSection.querySelector('picture:first-of-type');
  const searchIconButton = a({
    class: 'icon-button-circle search-icon',
    onclick: openHeaderOverlay,
  }, span(
    { class: 'icon' },
    img({ src: '/icons/search.svg' }),
  ));

  searchDiv.append(headerOverlay);
  searchDiv.append(searchHeader);
  searchDiv.append(searchIconButton);
  searchSection.remove();
  return searchDiv;
}

function createNavTop(searchDiv, phoneIconButton) {
  const navTop = div(
    { class: 'nav-top' },
    searchDiv,
    phoneIconButton,
    a(
      { class: 'student-login-container', href: 'https://my.phoenix.edu/' },
      div(
        { class: 'student-login' },
        img({ src: '/icons/login-icon.svg' }),
        span('Student Login'),
      ),
    ),
  );
  return navTop;
}

/**
 * Sanitizes a string for use as class name.
 * @param {string} name The unsanitized string
 * @returns {string} The class name
 */
function toClassName(name) {
  return typeof name === 'string'
    ? name
      .toLowerCase()
      .replace(/[^0-9a-z]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    : '';
}

function decorateNavItem(parent) {
  const navInMenuWrap = document.createElement('div');
  navInMenuWrap.className = 'nav-in-menu-wrap';

  const tablist = ul({ class: 'tabs-list', role: 'tablist' });

  navInMenuWrap.append(tablist);

  const listUl = parent.querySelector('ul:first-of-type');
  const list = listUl !== null ? listUl.children : null;
  const listLen = list !== null ? list.length : 0;
  let i = 0;
  while (i < listLen) {
    const tabInfo = list.item(i);
    const tabHeading = tabInfo.querySelector('strong');
    const id = toClassName(tabHeading !== null ? tabHeading.textContent : tabInfo.textContent);

    const tabpanel = document.createElement('div');
    navInMenuWrap.append(tabpanel);
    // decorate tabpanel
    tabpanel.className = 'tabs-panel';
    tabpanel.id = `tabpanel-${id}`;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');
    const tabpanelItems = tabInfo.querySelector('ul');
    if (tabpanelItems !== null) {
      tabpanel.append(tabpanelItems);
    }

    // build tab button
    const navButton = document.createElement('button');
    navButton.className = 'tabs-tab';
    navButton.id = `tab-${id}`;
    navButton.innerHTML = tabInfo.innerHTML;
    navButton.setAttribute('aria-controls', `tabpanel-${id}`);
    navButton.setAttribute('aria-selected', !i);
    navButton.setAttribute('role', 'tab');
    navButton.setAttribute('type', 'button');
    navButton.addEventListener('mouseover', () => {
      parent.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabpanel.setAttribute('aria-hidden', false);
      navButton.setAttribute('aria-selected', true);
    });
    // const buttonContainer = li({role: 'tab'});
    tablist.append(navButton);
    navButton.addEventListener('click', () => {
      document.querySelectorAll('.header-tabs-right .tabs-panel').forEach((panel) => {
        panel.classList?.remove('selected');
      });
      document.querySelectorAll('.header-tabs-left .tabs-tab').forEach((panel) => {
        panel.classList?.remove('selected');
      });
      navButton.classList.add('selected');
      tabpanel.classList.add('selected');
    });
    if (i === 0) {
      navButton.classList.add('selected');
      tabpanel.classList.add('selected');
    }
    i += 1;
  }

  // parent.children[1].remove();
  listUl.remove();

  return navInMenuWrap;
}

function createBottomNav(nav) {
  const bottomSection = nav.querySelector('.section.bottom-menu');
  const firstLink = bottomSection.querySelector('.button-container:first-of-type a');
  const secondLink = bottomSection.querySelector('.button-container:nth-of-type(2) a');
  const thirdLink = bottomSection.querySelector('.button-container:nth-of-type(3) a');

  const bottomMenu = div(
    { class: 'header-bottom-section' },
    div(
      { class: 'bottom-container' },
      a(
        { href: firstLink.getAttribute('href'), class: 'header-bottom-button white-arrow' },
        span(
          firstLink.textContent,
          div({ class: 'header-arrow' }),
        ),
      ),
      a(
        { href: secondLink.getAttribute('href'), class: 'header-bottom-button white-arrow' },
        span(
          secondLink.textContent,
          div({ class: 'header-arrow' }),
        ),
      ),
      a(
        { href: thirdLink.getAttribute('href'), class: 'header-bottom-button white-border' },
        span(thirdLink.textContent),
      ),
    ),
  );

  return bottomMenu;
}

function createDropDownContainer3Level(list, imgContainer) {
  const navInMenuWrap = decorateNavItem(list);
  const listTabList = navInMenuWrap.querySelector('.tabs-list');
  const listTabPanels = navInMenuWrap.querySelectorAll('.tabs-panel');

  const imgLink = imgContainer.querySelector('a');
  imgLink.classList.add('img-link');
  const image = imgContainer.querySelector('picture');
  imgLink.append(image);

  const dropDownContainer = div(
    { class: 'header-mega-nav three-level' },
    div(
      { class: 'center' },
      div(
        { class: 'headernavcontainer' },
        div(
          { class: 'header-container' },
          div(
            { class: 'headernavtabnavigation' },
            div({ class: 'header-tabs-left' }, listTabList),
            div(
              { class: 'header-tabs-right' },
              div({ class: 'header-tab-right-left' }, ...listTabPanels),
              div(
                { class: 'header-tab-right-right' },
                div({ class: 'right-image' }, imgLink),
              ),
            ),
          ),
        ),
      ),
    ),
  );

  return dropDownContainer;
}

function createDropDownContainer1Level(list, imgContainer) {
  const navList = list.querySelector('ul:first-of-type');
  const imgLink = imgContainer.querySelector('a');
  const linkHref = imgLink.getAttribute('href');
  const image = imgContainer.querySelector('picture');
  imgLink.append(image);
  const buttonText = imgLink?.textContent;
  const lowerButton = a(
    { class: 'lower-button', role: 'link', href: linkHref },
    span({ class: 'button-text' }, buttonText),
  );

  navList.classList.add('header-links-list');

  const dropDownContainer = div(
    { class: 'header-mega-nav one-level' },
    div(
      { class: 'center' },
      div(
        { class: 'headernavcontainer' },
        div(
          { class: 'header-container' },
          div(
            { class: 'headernavtitleandlinks' },
            div({ class: 'header-links' }, navList),
          ),
        ),
      ),
      div(
        { class: 'headernavcontainer-right' },
        div(
          { class: 'header-container' },
          div(
            { class: 'container-content' },
            div({ class: 'image-container' }, imgLink),
            div({ class: 'button-container' }, lowerButton),
          ),
        ),
      ),
    ),
  );

  return dropDownContainer;
}

function closeNavigationDropdown() {
  const navDropdownActive = document.querySelector('header .header-dropdown-container .header-mega-nav.selected');
  navDropdownActive.classList.remove('selected');
  const navBottom = document.querySelector('header .header-bottom-section.active');
  navBottom.classList.remove('active');
  const navItem = document.querySelector('nav .nav-sections .nav-drop[aria-expanded="true"]');
  navItem.setAttribute('aria-expanded', 'false');
}

function createDropDownCloseButton() {
  return button({
    role: button, 'aria-label': 'Close Navigation', class: 'header-dropdown-close', onclick: closeNavigationDropdown,
  }, span(), span());
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const headerTop = document.createElement('div');
  headerTop.className = 'header-top';
  headerTop.append(nav.children[0]);

  const navList = document.createElement('ul');

  if (isDesktop.matches) {
    const headerDropdownContainers = document.createElement('nav');
    headerDropdownContainers.classList.add('header-dropdown-container');
    nav.querySelectorAll('.mega-menu').forEach((megaMenu) => {
      const list = megaMenu.querySelector(':scope > .default-content-wrapper > ul > li');
      if (list.querySelector('ul')) list.classList.add('nav-drop');
      let container = null;
      if (megaMenu.classList.contains('3-level')) {
        const imgContainer = megaMenu.querySelector('.default-content-wrapper > p');
        container = createDropDownContainer3Level(list, imgContainer);
      } else if (megaMenu.classList.contains('1-level')) {
        const imgContainer = megaMenu.querySelector('.default-content-wrapper > p');
        container = createDropDownContainer1Level(list, imgContainer);
      }
      if (container !== null) {
        headerDropdownContainers.append(container);
        list.addEventListener('click', () => {
          if (container.classList.contains('selected')) {
            container.classList.remove('selected');
            const bottomMenu = document.querySelector('header .header-bottom-section');
            bottomMenu.classList.remove('active');
          } else {
            document.querySelectorAll('.header-mega-nav').forEach((menu) => {
              menu.classList.remove('selected');
            });
            container.classList.add('selected');
            const bottomMenu = document.querySelector('header .header-bottom-section');
            bottomMenu.classList.add('active');
          }
        });
      }
      if (list) {
        navList.append(list);
      }
    });
    headerDropdownContainers.append(createBottomNav(nav));
    headerDropdownContainers.append(createDropDownCloseButton());
    nav.append(headerDropdownContainers);
  } else { /* empty */ }
  const headerNavDiv = document.createElement('div');
  headerNavDiv.className = 'header-nav';
  headerNavDiv.append(div(
    { class: 'header-left' },
    nav.children[0].children[0].children[0],
    div({ class: 'nav-sections' }, navList),
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

  document.querySelectorAll('nav .mega-menu').forEach((megaMenu) => megaMenu.remove());
  document.querySelector('nav .bottom-menu').remove();
}
