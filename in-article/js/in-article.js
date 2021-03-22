/**
 * @license Copyright (c) 2015-2021 Radiant Media Player 
 * outstream-ads-gallery | https://github.com/radiantmediaplayer/outstream-ads-gallery
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
    skin: 'outstream',
    backgroundColor: 'DDDDDD',
    ads: true,
    // by default we use Google IMA but we can also use rmp-vast for outstream ads
    // adParser: 'rmp-vast',
    // when player comes into view, it will autoplay ...
    // also player is automatically played/paused when it becomes in/out of view with this option
    viewablePlayPause: true,
    // ... well muted autoplay to avoid Chrome/Safari to block autoplay with sound 
    // and to comply with the coalition for better ads
    muted: true,
    adOutStream: true,
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

  // if Google IMA has been blocked by an ad-blocker or failed to load
  // we need to remove the player from DOM
  container.addEventListener('ready', function () {
    if (rmp.getAdParserBlocked()) {
      _removePlayer();
      return;
    }
  });

  // on autoplay failure we remove player from DOM
  container.addEventListener('autoplayfailure', _removePlayer);

  // init player after wiring events
  rmp.init(settings);

})();
