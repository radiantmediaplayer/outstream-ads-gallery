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
  autoplay: true,
  // we disable fadeIn on ready since we will take care of it when adstarted event happens
  fadeInPlayer: false,
  ads: true,
  // by default we use Google IMA but we can also use rmp-vast for outstream ads
  // adParser: 'rmp-vast',
  adOutStream: true,
  // by default oustream ad should be autoplay muted (good practice in the industry)
  adOutStreamMutedAutoplay: true,
  adTagUrl: 'https://www.radiantmediaplayer.com/vast/tags/inline-linear.xml',
  // we use client-side waterfalling in this case (optional)
  adTagWaterfall: [
    'https://www.radiantmediaplayer.com/vast/tags/inline-linear-1.xml'
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

const _appendCloseButton = function () {
  const closeButton = document.createElement('div');
  closeButton.className = 'rmp-outstream-close-button rmp-i rmp-i-close';
  // interacting with close button will cause player to be removed from DOM
  closeButton.addEventListener('click', _removePlayer, { once: true });
  // append close button to player container
  container.appendChild(closeButton);
};
// on adstarted we append close button
rmp.one('adstarted', _appendCloseButton);

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
