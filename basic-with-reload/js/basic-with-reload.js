/**
 * @license Copyright (c) 2015-2018 Radiant Media Player 
 * outstream-ads-gallery 0.1.0 | https://github.com/radiantmediaplayer/outstream-ads-gallery
 */

(function () {

  'use strict';

  var elementID = 'rmpPlayer';
  var container = document.getElementById(elementID);

  if (!container) {
    return;
  }

  var settings = {
    licenseKey: 'your-license-key',
    width: 640,
    height: 360,
    autoplay: true,
    endOfVideoPoster: 'https://www.radiantmediaplayer.com/images/poster-rmp-ads.jpg',
    skin: 'outstream',
    ads: true,
    adOutStream: true,
    adTagReloadOnEnded: true,
    adTagUrl: 'https://www.radiantmediaplayer.com/vast/tags/inline-linear.xml',
    adTagWaterfall: [
      'https://www.radiantmediaplayer.com/vast/tags/inline-linear-1.xml'
    ]
  };
  var rmp = new RadiantMP(elementID);

  // when destroy method finishes we clear listeners and remove player from DOM
  var _onDestroyCompleted = function () {
    container.removeEventListener('destroyerror', _onDestroyCompleted);
    container.removeEventListener('destroycompleted', _onDestroyCompleted);
    var parent = container.parentNode;
    if (parent) {
      try {
        parent.removeChild(container);
      } catch (e) {
        fw.trace(e);
      }
    }
  };

  // player needs be removed from page 
  // first we need to destroy it
  var _removePlayer = function () {
    container.removeEventListener('autoplayfailure', _removePlayer);
    container.addEventListener('destroyerror', _onDestroyCompleted);
    container.addEventListener('destroycompleted', _onDestroyCompleted);
    rmp.destroy();
  };

  container.addEventListener('ready', function () {
    // if Google IMA has been blocked by an ad-blocker or failed to load
    // we need to remove the player from DOM
    if (rmp.getAdParserBlocked()) {
      _removePlayer();
      return;
    }
  });
  // in case of autoplayfailure event we need to remove player from DOM
  container.addEventListener('autoplayfailure', _removePlayer);

  // init player after wiring events
  rmp.init(settings);

})();