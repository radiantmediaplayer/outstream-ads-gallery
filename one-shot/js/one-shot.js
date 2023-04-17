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
  ads: true,
  adTagReloadOnEnded: false,
  // by default we use Google IMA but we can also use rmp-vast for outstream ads
  // adParser: 'rmp-vast',
  adOutStream: true,
  // by default oustream ad should be autoplay muted (good practice in the industry)
  adOutStreamMutedAutoplay: true,
  adTagUrl: 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-2.xml',
  // we use client-side waterfalling in this case (optional)
  adTagWaterfall: [
    'https://www.radiantmediaplayer.com/vast/tags/inline-linear-1.xml'
  ]
};

// new player instance
const rmp = new RadiantMP(elementID);

const _onDestroyCompleted = () => {
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

// function to fade out player
const _endPlayer = function () {
  // nicely fade out player and remove it from DOM
  container.style.opacity = 0;
  container.style.visibility = 'hidden';
  setTimeout(function () {
    _removePlayer();
  }, 400);
};

rmp.one('ready', function () {
  // if Google IMA has been blocked by an ad-blocker or failed to load
  // we need to remove the player from DOM
  if (rmp.getAdParserBlocked()) {
    console.log('AdParserBlocked - remove player');
    _removePlayer();
    return;
  }
  // if autoplay fails we remove player from DOM 
  if (rmp.getAutoplayMode() === 'no-autoplay') {
    console.log('no-autoplay - remove player');
    _removePlayer();
    return;
  }
});

// when ad ends - adcontentresumerequested event for Google IMA or addestroyed event for rmp-vast 
// we fade out player and remove it from DOM
rmp.one('adcontentresumerequested', _endPlayer);
rmp.one('addestroyed', _endPlayer);

rmp.init(settings);
