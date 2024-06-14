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
}
