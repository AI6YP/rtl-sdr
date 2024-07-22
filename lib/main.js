'use strict';

const domContainer = require('./dom-container.js');

function onActivate (render) {
  return async function () {
    const usb = await navigator.usb.requestDevice({filters: [{vendorId: 0x0bda}]});
    console.log(usb);
    await usb.open();
    document.getElementById('btnStartLabel').innerHTML = 'Connected';
    console.log(usb.configuration);
  };
}

global.RtlSdrTest = async (rootName) => {
  domContainer({
    rootElement: document.getElementById(rootName),
    onActivate
  });
};

/* eslint-env browser */
