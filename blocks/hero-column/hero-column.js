const SRC = 'src';
const TWITTER_BLACK = 'twitter-black';
const FACEBOOK_BLACK = 'facebook-black';
const LINKEDIN_BLACK = 'linkedin-black';
const PINTEREST_BLACK = 'pinterest-black';
const EMAIL_BLACK = 'email-black';

// eslint-disable-next-line no-script-url
const PINTEREST_SCRIPT = 'javascript:void((function()%7Bvar%20e=document.createElement(\'script\');e.setAttribute(\'type\',\'text/javascript\');e.setAttribute(\'charset\',\'UTF-8\');e.setAttribute(\'src\',\'//assets.pinterest.com/js/pinmarklet.js?r=%27+Math.random()*99999999);document.body.appendChild(e)%7D)());';

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
  const socialMediaIcons = block.querySelectorAll('.hero-column-container > div > div > div:nth-child(1) > div:nth-child(2) > p > a span img');
  if (socialMediaIcons.length === 0) {
    return;
  }
  socialMediaIcons.forEach((icon) => {
    const iconName = icon.getAttribute('data-icon-name');
    switch (iconName) {
      case TWITTER_BLACK:
        handleSocialIconHover(icon, '../../icons/twitter-white.svg', '#1A9DF1');
        break;
      case FACEBOOK_BLACK:
        handleSocialIconHover(icon, '../../icons/facebook-white.svg', '#0C77F2');
        break;
      case LINKEDIN_BLACK:
        handleSocialIconHover(icon, '../../icons/linkedin-white.svg', '#026699');
        break;
      case PINTEREST_BLACK:
        icon.parentElement.parentElement.setAttribute('href', PINTEREST_SCRIPT);
        handleSocialIconHover(icon, '../../icons/pinterest-white.svg', '#D7143A');
        break;
      case EMAIL_BLACK:
        handleSocialIconHover(icon, '../../icons/email-white.svg', '#5F7079');
        break;
      default:
        break;
    }
  });
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
