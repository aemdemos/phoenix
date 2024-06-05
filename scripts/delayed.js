// eslint-disable-next-line import/no-cycle
import { sampleRUM, loadScript, loadCSS } from './aem.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// Chat
window.EDU = {
  Configs: {
    chatDomain: 'https://ucpgms.phoenix.edu',
    chatDataURL: '/genesys/2/chat/Chat',
    chatGWEHttpEndPoint: 'http://gwe.phoenix.edu',
    chatGWEHttpsEndPoint: 'https://gwe.phoenix.edu',
    chatCometURL: '/genesys/cometd',
    chatApiURL: '/genesys/2/chat/Chat',
    chatCallBackURL: '/genesys/1/service/callback',
  },
  Utils: {},
};

// Load Launch script for tag manager
loadScript('https://assets.adobedtm.com/7679441b2bf7/5d94d460e974/launch-4c68fe2386f7.min.js', { async: true });

// Adobe Client Data Layer
loadScript('/scripts/acdl/adobe-client-data-layer.min.js', { defer: true });
loadScript('/scripts/acdl/setup.js', { defer: true });

// Clientlib libraries
loadScript('https://www.phoenix.edu/etc.clientlibs/phxedu/clientlibs/clientlib-common-library.min.js', { defer: true });
loadScript('/clientlibs/clientlib-chat.min.js', { defer: true });
loadCSS('/clientlibs/clientlib-chat.min.css');
