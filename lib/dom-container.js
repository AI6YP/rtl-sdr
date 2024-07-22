'use strict';

const onml = require('onml');
const {StyleModule} = require('style-mod');

const themeAll = require('./theme-all.js');
const mountWaveGl = require('./mount-wave-gl.js');

const getMlTree = () => (
  ['div', {id: 'wd-container'},
    ['div', {id: 'wd-wgl'}, ''],
    ['div', {id: 'wd-grid'}, ''],
    ['div', {id: 'wd-controls'},
      onml.gen.svg(512, 512).concat([
        ['g', onml.tt(8, 8, {id: 'btnStart'}),
          ['rect', {class: 'svg-btn', width: 256, height: 64}],
          ['text', {id: 'btnStartLabel', x: 128, y: 44, 'text-anchor': 'middle'}, 'Press to Start']
        ]
      ])
    ]

  ]
);

const domContainer = (cfg) => {
  const {
    rootElement,
    onActivate
  } = cfg;

  const themeAllMod = new StyleModule(themeAll);
  StyleModule.mount(document, themeAllMod);

  const render1 = onml.renderer(rootElement);
  render1(getMlTree());

  const render2 = mountWaveGl(document.getElementById('wd-wgl'));
  document.getElementById('btnStart').addEventListener('click', onActivate(render2));
};

module.exports = domContainer;

/* eslint-env browser */
