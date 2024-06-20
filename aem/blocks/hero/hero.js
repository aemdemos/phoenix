/**
 * loads and decorates the Hero block
 * @param {Element} block The hero block element
 */
export default async function decorate(block) {
  // eager load the hero image
  const heroImage = block.querySelectorAll('img')[0];
  if (heroImage) {
    heroImage.loading = 'eager';
    heroImage.fetchPriority = 'high';
  }
}
