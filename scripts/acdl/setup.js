window.adobeDataLayer = window.adobeDataLayer || [];
window.adobeDataLayer.Util = {};

function sendDataForTracking(b, c) {
  // eslint-disable-next-line no-console
  console.log('eventData ', c);
  if (window.uopxDataLayer && typeof window.uopxDataLayer.track === 'function') {
    window.uopxDataLayer.track(b, c);
  }
}

window.adobeDataLayer.Util.sendDataForTracking = sendDataForTracking;
