export default async function decorate(block) {
  const asideNavFragmentLink = block.querySelector('a');
  block.remove();
  if (!asideNavFragmentLink) {
    return;
  }
  const resp = await fetch('/blocks/blog-aside-fragment/master.contentonly.html');
  if (!resp.ok) {
    return;
  }
  const body = document.querySelector('body');
  const mainContainer = document.createElement('div');
  mainContainer.classList.add('main-container');
  const asideNavContainer = document.createElement('div');
  asideNavContainer.classList.add('aside-nav-container');
  asideNavContainer.innerHTML = await resp.text();
  mainContainer.appendChild(asideNavContainer);
  const main = body.querySelector('main');
  body.insertBefore(mainContainer, main);
  mainContainer.appendChild(main);
}
