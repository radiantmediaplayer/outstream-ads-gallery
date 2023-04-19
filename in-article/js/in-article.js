/**
 * @license Copyright (c) 2015-2022 Radiant Media Player 
 * outstream-ads-gallery | https://github.com/radiantmediaplayer/outstream-ads-gallery
 */

const elementID = 'rmp';
const container = document.getElementById(elementID);

const settings = {
  licenseKey: 'your-license-key',
  width: 640,
  height: 360,
  skin: 'outstream',
  ads: true,
  // by default we use Google IMA but we can also use rmp-vast for outstream ads
  // adParser: 'rmp-vast',
  // when player comes into view, it will autoplay ...
  viewableAutoplay: true,
  // ... well muted autoplay to avoid Chrome/Safari to block autoplay with sound 
  // and to comply with the coalition for better ads
  muted: true,
  adOutStream: true,
  adTagUrl: 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-1.xml',
  // we use client-side waterfalling in this case (optional)
  adTagWaterfall: [
    'https://www.radiantmediaplayer.com/vast/tags/inline-linear.xml'
  ]
};

// new player instance
const rmp = new RadiantMP(elementID);

// when destroy method finishes we clear listeners and remove player from DOM
const _onDestroyCompleted = function () {
  const parent = container.parentNode;
  if (parent) {
    try {
      parent.removeChild(container);
    } catch (e) {
      console.log(e);
    }
  }
};

// player needs be removed from page 
// first we need to destroy it
const _removePlayer = function () {
  rmp.one('destroycompleted', _onDestroyCompleted);
  rmp.destroy();
};

rmp.one('ready', function () {
  // if Google IMA has been blocked by an ad-blocker or failed to load
  // we need to remove the player from DOM
  if (rmp.getAdParserBlocked()) {
    console.log('AdParserBlocked - remove player');
    _removePlayer();
    return;
  }
});

// init player after wiring events
rmp.init(settings);
