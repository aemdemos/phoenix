/*
 * Accordion Block
 * Recreate an accordion
 * https://www.hlx.live/developer/block-collection/accordion
 */

function hasWrapper(el) {
  return !!el.firstElementChild && window.getComputedStyle(el.firstElementChild).display === 'block';
}

export default function decorate(block) {
  // Get the value of 'data-parent-container' if the parent 'accordion-container' is found
  let parentAccordionContainer = null;

  let accordionParent = block;
  while (accordionParent && !accordionParent.classList.contains('accordion-container')) {
    accordionParent = accordionParent.parentElement;
  }

  if (accordionParent) {
    const dataWrapperText = accordionParent.getAttribute('data-parent-container');
    const summary = document.createElement('summary');
    summary.classList.add('accordion-item-label', 'accordion-container-item-label');
    if (!hasWrapper(summary)) {
      summary.innerHTML = `<p>${dataWrapperText}</p>`;
    }
    const dropdownArrow = document.createElement('div');
    dropdownArrow.className = 'accordion-container-dropdown-arrow';
    summary.append(dropdownArrow);
    // decorate accordion item body
    parentAccordionContainer = document.createElement('details');
    parentAccordionContainer.classList.add('accordion-item', 'accordion-container-item');
    if (window.innerWidth > 990) {
      parentAccordionContainer.setAttribute('open', 'open');
    }
    parentAccordionContainer.append(summary);
  } else {
    // eslint-disable-next-line no-console
    console.log('Parent accordion-container not found');
  }

  [...block.children].forEach((row) => {
    // decorate accordion item label
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    summary.append(...label.childNodes);
    if (!hasWrapper(summary)) {
      summary.innerHTML = `<p>${summary.innerHTML}</p>`;
    }
    const dropdownArrow = document.createElement('div');
    dropdownArrow.className = 'accordion-dropdown-arrow';
    summary.append(dropdownArrow);
    // decorate accordion item body
    const body = row.children[1];
    body.className = 'accordion-item-body';
    if (!hasWrapper(body)) {
      body.innerHTML = `<p>${body.innerHTML}</p>`;
    }
    // decorate accordion item
    const details = document.createElement('details');
    details.className = 'accordion-item';
    details.append(summary, body);
    row.replaceWith(details);
    if (parentAccordionContainer) {
      parentAccordionContainer.appendChild(details);
    }
  });
  block.appendChild(parentAccordionContainer);
}
