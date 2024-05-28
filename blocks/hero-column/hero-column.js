function decorateSocialMediaIcons(block) {
  const socialMediaAnchors = block.querySelector('body > main > div.section.hero-column-container > div > div > div:nth-child(1) > div:nth-child(2) > p > a');
  if (socialMediaAnchors.length === 0) {
    return;
  }
  socialMediaAnchors.forEach(() => {

  })
}

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`hero-column-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('hero-column-img-col');
        }
      }
    });
  });
  decorateSocialMediaIcons(block);
}
