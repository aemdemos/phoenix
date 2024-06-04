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
  if (!isDesktop.matches) {
    const headerTop = document.querySelector('.header-top');
    headerTop.classList.add('hide');
  }
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
  if (!isDesktop.matches) {
    const headerTop = document.querySelector('.header-top');
    headerTop.classList.remove('hide');
  }
}

function createSearchSection(searchSection) {
  const searchDiv = document.createElement('div');

  const headerOverlay = div({ class: 'header-overlay', onClick: closeHeaderOverlay });

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
  navTop.addEventListener('animationend', () => {
    if (isDesktop.matches) {
      navTop.classList.add('blur-background');
    }
  });
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
      const subList = tabpanelItems.children;
      const subListLen = subList !== null ? subList.length : 0;
      if (subListLen > 10) {
        tabpanelItems.style['column-count'] = 2;
        tabpanelItems.style['margin-bottom'] = 0;
      }
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

      const subList = tabpanelItems.children;
      const subListLen = subList !== null ? subList.length : 0;
      if (subListLen > 10) {
        const midContainer = document.querySelector('.header-tab-right-left');
        const rightContainer = document.querySelector('.header-tab-right-right');
        midContainer.classList.add('nav-expanded');
        rightContainer.classList.add('hide');
      } else {
        const midContainer = document.querySelector('.header-tab-right-left');
        const rightContainer = document.querySelector('.header-tab-right-right');
        midContainer.classList.remove('nav-expanded');
        rightContainer.classList.remove('hide');
      }
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

function createDropDownContainer2Level(list, megaMenu) {
  const listUl = list.querySelector('ul:first-of-type');
  if (listUl === null) {
    return null;
  }
  const subLists = listUl.children;
  const subListsLen = subLists !== null ? subLists.length : 0;
  const subListsInLeft = Math.ceil(subListsLen / 2);
  const subListsInRight = subListsLen - subListsInLeft;

  const dropDownContainer = div(
    { class: 'header-mega-nav two-level' },
    div(
      { class: 'center' },
      div(
        { class: 'headernavcontainer-left' },
        div(
          { class: 'header-container' },
        ),
      ),
      div(
        { class: 'headernavcontainer-mid' },
        div(
          { class: 'header-container' },
        ),
      ),
      div(
        { class: 'headernavcontainer-right' },
      ),
    ),
  );

  const leftContainer = dropDownContainer.querySelector('.headernavcontainer-left .header-container');
  const midContainer = dropDownContainer.querySelector('.headernavcontainer-mid .header-container');
  for (let i = 0; i < subListsInLeft; i += 1) {
    leftContainer.append(listUl.children[0]);
  }
  for (let i = 0; i < subListsInRight; i += 1) {
    midContainer.append(listUl.children[0]);
  }

  listUl.remove();

  const rightContainer = dropDownContainer.querySelector('.headernavcontainer-right');
  const wrapper = megaMenu.querySelector('.default-content-wrapper');
  wrapper.querySelector('ul')?.remove();

  const link = wrapper.querySelector('a');
  if (link) {
    const imgContainer = a({ class: 'img-link', href: link.href }, wrapper.firstElementChild);
    rightContainer.append(imgContainer);
  }

  while (wrapper.firstElementChild) rightContainer.append(wrapper.firstElementChild);

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
  const body = document.querySelector('body');
  body.classList.remove('no-scroll');
}

function buildMobileNavPictureFooter(megaMenu) {
  const footers = megaMenu.querySelectorAll('p');
  Array.from(footers).forEach((footer) => {
    footer.classList.add('picture-footer');

    // Check if the footer just contains text
    if (footer.querySelector('a') === null
      && footer.querySelector('picture') === null) {
      footer.classList.add('small');
    }

    // Check if the footer contains a link in a strong tag
    const strongLink = footer.querySelector('strong > a');
    // If the footer contains a link in a strong tag, remove the strong tag
    if (strongLink !== null) {
      const link = strongLink.cloneNode(true);
      link.classList.add('strong-link');
      footer.innerHTML = '';
      footer.append(link);
    }
  });

  return footers;
}

function createDropDownCloseButton() {
  return button({
    role: 'button', 'aria-label': 'Close Navigation', class: 'header-dropdown-close', onclick: closeNavigationDropdown,
  }, span(), span());
}

function buildMobileLevel3Nav(megaMenu) {
  const content = megaMenu.querySelector(':scope > .default-content-wrapper > ul > li');
  const divContent = document.createElement('div');

  Array.from(content.querySelector('ul').children).forEach((content2ndLevel) => {
    const level2AccordionButton = document.createElement('button');
    level2AccordionButton.classList.add('nav-accordian', 'level-2');
    const buttonText = document.createElement('span');
    buttonText.innerText = content2ndLevel.firstElementChild.innerText;
    level2AccordionButton.append(buttonText);
    const dropdownArrow = document.createElement('div');
    dropdownArrow.classList.add('dropdown-arrow');
    level2AccordionButton.append(dropdownArrow);

    const level2DivContent = document.createElement('div');
    level2DivContent.classList.add('nav-accordian-content', 'level-2');
    level2DivContent.ariaExpanded = 'false';
    level2AccordionButton.addEventListener('click', () => {
      if (level2DivContent.classList.contains('active')) {
        level2DivContent.classList.remove('active');
        level2AccordionButton.classList.remove('active');
        level2DivContent.ariaExpanded = level2DivContent.classList.contains('active');
      } else {
        document.querySelectorAll('.nav-accordian.level-2').forEach((navButton) => {
          navButton.classList.remove('active');
        });
        document.querySelectorAll('.nav-accordian-content.level-2').forEach((navContent) => {
          navContent.classList.remove('active');
          navContent.ariaExpanded = navContent.classList.contains('active');
        });
        level2AccordionButton.classList.add('active');
        level2DivContent.classList.add('active');
        level2DivContent.ariaExpanded = level2DivContent.classList.contains('active');
      }
    });

    Array.from(content2ndLevel.querySelector('ul').children).forEach((content3rdLevel) => {
      const level3Button = document.createElement('p');
      level3Button.classList.add('nav-accordian', 'level-3');
      if (content3rdLevel.firstElementChild?.tagName === 'A') {
        const link = content3rdLevel.firstElementChild.cloneNode(true);
        level3Button.append(link);
      } else {
        const text = content3rdLevel.innerText;
        const tmpSpan = document.createElement('span');
        tmpSpan.innerText = text;
        level3Button.append(tmpSpan);
      }
      level2DivContent.append(level3Button);
    });

    const pictureFooter = buildMobileNavPictureFooter(megaMenu);
    Array.from(pictureFooter).forEach((footer) => {
      level2DivContent.append(footer);
    });

    divContent.append(level2AccordionButton);
    divContent.append(level2DivContent);
  });

  return divContent;
}

function buildMobileLevel2Nav(megaMenu) {
  const divContent = document.createElement('div');
  Array.from(megaMenu.querySelector('div > ul > li > ul').children).forEach((section) => {
    const sectionContainer = document.createElement('div');
    const sectionTitle = document.createElement('p');
    sectionTitle.classList.add('nav-heading');
    sectionTitle.innerText = section.firstChild.textContent.trim();
    sectionContainer.append(sectionTitle);
    const linkList = document.createElement('ul');
    sectionContainer.append(linkList);
    divContent.append(sectionContainer);

    Array.from(section.querySelector(':scope > ul').children).forEach((content) => {
      if (content.firstElementChild?.tagName === 'A') {
        const link = content.firstElementChild.cloneNode(true);
        const listItem = document.createElement('li');
        listItem.append(link);
        linkList.append(listItem);
      } else {
        const text = content.innerText;
        const listItem = document.createElement('li');
        listItem.innerText = text;
        linkList.append(listItem);
      }
    });
  });

  const pictureFooters = buildMobileNavPictureFooter(megaMenu);
  Array.from(pictureFooters).forEach((footer) => {
    divContent.append(footer);
  });

  return divContent;
}

function buildMobileLevel1Nav(megaMenu) {
  const divContent = document.createElement('div');
  const linkList = document.createElement('ul');
  divContent.append(linkList);
  Array.from(megaMenu.querySelector('ul > li > ul').children).forEach((content) => {
    if (content.firstElementChild?.tagName === 'A') {
      const link = content.firstElementChild.cloneNode(true);
      const listItem = document.createElement('li');
      listItem.append(link);
      linkList.append(listItem);
    } else {
      const text = content.innerText;
      const listItem = document.createElement('li');
      listItem.innerText = text;
      linkList.append(listItem);
    }
  });

  const pictureFooters = buildMobileNavPictureFooter(megaMenu);
  Array.from(pictureFooters).forEach((footer) => {
    divContent.append(footer);
  });

  return divContent;
}

function buildMobileNav(nav) {
  const mobileNav = document.createElement('div');
  mobileNav.id = 'mobile-nav';
  mobileNav.classList.add('mobile-nav');
  const linkContainer = document.createElement('ul');
  linkContainer.classList.add('nav-links');
  mobileNav.append(linkContainer);

  nav.querySelectorAll('.mega-menu').forEach((megaMenu) => {
    const listItem = document.createElement('li');
    linkContainer.append(listItem);
    const title = megaMenu.querySelector(':scope > .default-content-wrapper > ul > li').firstElementChild.innerText;
    const accordionButton = document.createElement('button');
    accordionButton.classList.add('nav-accordian', 'level-1');
    const buttonText = document.createElement('span');
    buttonText.innerText = title;
    accordionButton.append(buttonText);
    const dropdownArrow = document.createElement('div');
    dropdownArrow.classList.add('dropdown-arrow');
    accordionButton.append(dropdownArrow);
    listItem.append(accordionButton);

    let content = null;

    if (megaMenu.classList.contains('3-level')) {
      content = buildMobileLevel3Nav(megaMenu);
    } else if (megaMenu.classList.contains('2-level')) {
      content = buildMobileLevel2Nav(megaMenu);
    } else if (megaMenu.classList.contains('1-level')) {
      content = buildMobileLevel1Nav(megaMenu);
    }

    if (content) {
      content.ariaExpanded = 'false';
      content.classList.add('nav-accordian-content', 'level-1');
      accordionButton.addEventListener('click', () => {
        if (content.classList.contains('active')) {
          content.classList.remove('active');
          accordionButton.classList.remove('active');
          content.ariaExpanded = content.classList.contains('active');
        } else {
          document.querySelectorAll('.nav-accordian.level-1').forEach((navButton) => {
            navButton.classList.remove('active');
          });
          document.querySelectorAll('.nav-accordian-content.level-1').forEach((navContent) => {
            navContent.classList.remove('active');
            navContent.ariaExpanded = navContent.classList.contains('active');
          });

          accordionButton.classList.toggle('active');
          content.classList.toggle('active');
          content.ariaExpanded = content.classList.contains('active');
        }
      });
      listItem.append(content);
    }
  });

  // Open first accordian by default
  const firstAccordion = mobileNav.querySelector('.nav-accordian.level-1');
  const firstAccordionContent = mobileNav.querySelector('.nav-accordian-content.level-1');
  firstAccordion.classList.add('active');
  firstAccordionContent.classList.add('active');
  firstAccordionContent.ariaExpanded = firstAccordionContent.classList.contains('active');

  // Student Login Button
  const studentLoginButton = a(
    { class: 'student-login-container', href: 'https://my.phoenix.edu/' },
    div(
      { class: 'student-login' },
      img({ src: '/icons/login-icon.svg' }),
      span('Student Login'),
    ),
  );
  const studentLoginContainer = document.createElement('div');
  studentLoginContainer.classList.add('student-login-container');
  studentLoginContainer.append(studentLoginButton);
  mobileNav.append(studentLoginContainer);

  // Request Info Button
  const requestInfo = div(
    { class: 'request-info' },
    a({ href: '/request/international-student' }, 'Request Info'),
  );
  mobileNav.append(requestInfo);

  return mobileNav;
}

function toggleHeaderCall() {
  const headerCall = document.querySelector('.header-call');
  if (!isDesktop.matches || !headerCall) return;

  if (headerCall.classList.contains('selected')) {
    headerCall.classList.remove('selected');
  } else {
    headerCall.classList.add('selected');
  }
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
      if (list.querySelector('ul')) {
        list.classList.add('nav-drop');
        const dropdown = div({ class: 'header-dropdown-arrow' });
        list.append(dropdown);
      }
      let container = null;
      if (megaMenu.classList.contains('3-level')) {
        const imgContainer = megaMenu.querySelector('.default-content-wrapper > p');
        container = createDropDownContainer3Level(list, imgContainer);
      } else if (megaMenu.classList.contains('1-level')) {
        const imgContainer = megaMenu.querySelector('.default-content-wrapper > p');
        container = createDropDownContainer1Level(list, imgContainer);
      } else if (megaMenu.classList.contains('2-level')) {
        container = createDropDownContainer2Level(list, megaMenu);
      }
      if (container !== null) {
        headerDropdownContainers.append(container);
        list.addEventListener('click', () => {
          if (container.classList.contains('selected')) {
            container.classList.remove('selected');
            const bottomMenu = document.querySelector('header .header-bottom-section');
            bottomMenu.classList.remove('active');
            const body = document.querySelector('body');
            body.classList.remove('no-scroll');
          } else {
            document.querySelectorAll('.header-mega-nav').forEach((menu) => {
              menu.classList.remove('selected');
            });
            const body = document.querySelector('body');
            body.classList.add('no-scroll');
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
  } else {
    const mobileNav = buildMobileNav(nav);
    nav.append(mobileNav);
  }
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
  navOverallContainer.addEventListener('animationend', () => {
    if (isDesktop.matches) {
      navOverallContainer.classList.add('blur-background');
    }
  });
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
    {
      class: 'icon-button-circle header-call', href: 'tel:844-937-8679', 'aria-label': 'Call University of Phoenix: 844-937-8679',
    },
    span(
      { class: 'icon' },
      img({ src: '/icons/phone.svg' }),
    ),
    span({ class: 'header-phone-text' }, '844-937-8679'),
  );
  if (!isDesktop.matches) {
    iconsContainer.append(searchDiv);
    iconsContainer.append(phoneIconButton);
  } else {
    phoneIconButton.addEventListener('click', (e) => {
      e.preventDefault();
      toggleHeaderCall();
    });
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
