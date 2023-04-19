/**
 * @license Copyright (c) 2015-2022 Radiant Media Player 
 * outstream-ads-gallery | https://github.com/radiantmediaplayer/outstream-ads-gallery
 */

const elementID = 'rmp';
const stickyContainer = document.getElementById('sticky-container');

const settings = {
  licenseKey: 'your-license-key',
  // we use autoHeightMode and size our stickyContainer with media queries CSS
  autoHeightMode: true,
  autoplay: true,
  ads: true,
  // by default we use Google IMA but we can also use rmp-vast for outstream ads
  //adParser: 'rmp-vast',
  adOutStream: true,
  skin: 'outstream',
  adTagReloadOnEnded: false,
  // fade-in/fade-out effects are applied on sticky-container so we do not need them on the player 
  fadeInPlayer: false,
  adTagUrl: 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-2.xml',
  // we use client-side waterfalling in this case (optional)
  adTagWaterfall: [
    'https://www.radiantmediaplayer.com/vast/tags/inline-linear-1.xml'
  ]
};

// new player instance
const rmp = new RadiantMP(elementID);

// when destroy method finishes we clear listeners and remove stickyContainer from DOM
const _onDestroyCompleted = function () {
  const parent = stickyContainer.parentNode;
  if (parent) {
    try {
      parent.removeChild(stickyContainer);
    } catch (e) {
      console.log(e);
    }
  }
};

// stickyContainer needs be removed from page 
// first we need to destroy it
const _removePlayer = function () {
  rmp.one('destroycompleted', _onDestroyCompleted);
  rmp.destroy();
};

// function to fade out sticky container
const _endPlayer = function () {
  stickyContainer.style.opacity = 0;
  stickyContainer.style.visibility = 'hidden';
  setTimeout(function () {
    _removePlayer();
  }, 200);
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

// when ad ends - adcontentresumerequested event for Google IMA or addestroyed event for rmp-vast 
// we fade out player and remove it from DOM
rmp.one('adcontentresumerequested', _endPlayer);
rmp.one('addestroyed', _endPlayer);

rmp.init(settings);
