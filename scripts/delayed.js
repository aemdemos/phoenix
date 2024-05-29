// eslint-disable-next-line import/no-cycle
import { sampleRUM, loadScript, loadCSS } from './aem.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// Chat
window.EDU = {
  Configs: {
    chatApiURL: '/genesys/2/chat/Chat',
    chatCallBackURL: '/genesys/1/service/callback',
    chatCometURL: '/genesys/cometd',
    chatDataURL: '/genesys/2/chat/Chat',
    chatDomain: 'https://ucpgms.phoenix.edu',
    chatGWEHttpEndPoint: 'http://gwe.phoenix.edu',
    chatGWEHttpsEndPoint: 'https://gwe.phoenix.edu',

  },
  chatConfig: {
    chatService: '',
    callBackUrl: '',
    chatClientlibHashCode: '1956f4d4e84fb208cfba5940203678b7',
  },
};
loadScript('/clientlibs/clientlib-chat.js');
loadCSS('/clientlibs/clientlib-chat.css');
