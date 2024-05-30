export default async function decorate(block) {
  const rows = Array.from(block.children);
  // title
  const titleContainer = rows[0];
  titleContainer.classList.add('article-title');
  // byLine
  const articleShares = rows[1];
  articleShares.classList.add('article-shares');
  // byLine
  const authorContainer = rows[2];
  authorContainer.classList.add('article-byline');
}
