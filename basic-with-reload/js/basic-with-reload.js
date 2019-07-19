/**
 * @license Copyright (c) 2015-2018 Radiant Media Player 
 * outstream-ads-gallery 2.0.0 | https://github.com/radiantmediaplayer/outstream-ads-gallery
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
    backgroundColor: 'DDDDDD',
    skin: 'outstream',
    autoplay: true,
    ads: true,
    // by default we use Google IMA but we can also use rmp-vast for outstream ads
    // adParser: 'rmp-vast',
    adOutStream: true,
    adOutStreamMutedAutoplay: true,
    adTagUrl: 'https://www.radiantmediaplayer.com/vast/tags/inline-linear.xml',
    // we use client-side waterfalling in this case (optional)
    adTagWaterfall: [
      'https://www.radiantmediaplayer.com/vast/tags/inline-linear-1.xml'
    ]
  };

  // new player instance
  var rmp = new RadiantMP(elementID);

  var _trace = function (input) {
    if (window.console.trace && input) {
      window.console.trace(input);
    }
  };

  // when destroy method finishes we clear listeners and remove player from DOM
  var _onDestroyCompleted = function () {
    container.removeEventListener('destroycompleted', _onDestroyCompleted);
    var parent = container.parentNode;
    if (parent) {
      try {
        parent.removeChild(container);
      } catch (e) {
        _trace(e);
      }
    }
  };

  // player needs be removed from page 
  // first we need to destroy it
  var _removePlayer = function () {
    container.removeEventListener('autoplayfailure', _removePlayer);
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
