const SRC = 'src';
const TWITTER = 'twitter';
const FACEBOOK = 'facebook';
const LINKEDIN = 'linkedin';
const PINTEREST = 'pinterest';
const EMAIL = 'email';

function handleSocialIconHover(icon, alternateSrc, alternateColor) {
  const originalSrc = icon.getAttribute('src');
  icon.onmouseover = () => {
    icon.setAttribute(SRC, alternateSrc);
    icon.parentElement.parentElement.style.backgroundColor = alternateColor;
  };
  icon.onmouseout = () => {
    icon.setAttribute(SRC, originalSrc);
    icon.parentElement.parentElement.style.backgroundColor = 'white';
  };
}

function decorateSocialMediaIcons(block) {
  const socialMediaIcons = block.querySelectorAll('.article-shares .social-container a img');
  if (socialMediaIcons.length === 0) {
    return;
  }
  socialMediaIcons.forEach((icon) => {
    const iconName = icon.getAttribute('alt');
    switch (iconName) {
      case TWITTER:
        handleSocialIconHover(icon, '../../icons/twitter-white.svg', '#1A9DF1');
        break;
      case FACEBOOK:
        handleSocialIconHover(icon, '../../icons/facebook-white.svg', '#0C77F2');
        break;
      case LINKEDIN:
        handleSocialIconHover(icon, '../../icons/linkedin-white.svg', '#026699');
        break;
      case PINTEREST:
        handleSocialIconHover(icon, '../../icons/pinterest-white.svg', '#D7143A');
        break;
      case EMAIL:
        handleSocialIconHover(icon, '../../icons/email-white.svg', '#5F7079');
        break;
      default:
        break;
    }
  });
}

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
  decorateSocialMediaIcons(block);
}
