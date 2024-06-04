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

loadScript('/clientlibs/clientlib-chat.min.js', { defer: true });
loadCSS('/clientlibs/clientlib-chat.min.css');
