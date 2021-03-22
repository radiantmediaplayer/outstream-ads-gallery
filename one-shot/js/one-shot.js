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
    autoplay: true,
    ads: true,
    adTagReloadOnEnded: false,
    // by default we use Google IMA but we can also use rmp-vast for outstream ads
    // adParser: 'rmp-vast',
    adOutStream: true,
    adTagUrl: 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-2.xml',
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

  var _removeElement = function (element) {
    var parent = element.parentNode;
    if (parent) {
      try {
        parent.removeChild(element);
      } catch (e) {
        _trace(e);
      }
    }
  };

  // when destroy method finishes we clear listeners and remove player from DOM
  var _onDestroyCompleted = function () {
    container.removeEventListener('destroycompleted', _onDestroyCompleted);
    _removeElement(container);
  };

  // player needs be removed from page 
  // first we need to destroy it
  var _removePlayer = function () {
    container.addEventListener('destroycompleted', _onDestroyCompleted);
    rmp.destroy();
  };

  // function to fade out player
  var _endPlayer = function () {
    container.removeEventListener('autoplayfailure', _endPlayer);
    container.removeEventListener('adcontentresumerequested', _endPlayer);
    container.removeEventListener('addestroyed', _endPlayer);
    // nicely fade out player and remove it from DOM
    container.style.opacity = 0;
    container.style.visibility = 'hidden';
    setTimeout(function () {
      _removePlayer();
    }, 400);
  };

  container.addEventListener('ready', function () {
    // if Google IMA has been blocked by an ad-blocker or failed to load
    // we need to remove the player from DOM
    if (rmp.getAdParserBlocked()) {
      _removePlayer();
      return;
    }
  });
  // when ad ends - adcontentresumerequested event for Google IMA or addestroyed event for rmp-vast 
  // we fade out player and remove it from DOM
  // in case of autoplayfailure event we also need to remove it - note that autoplayfailure should 
  // be infrequent if you are using muted autoplay as recommended
  // whichever comes first
  container.addEventListener('autoplayfailure', _endPlayer);
  container.addEventListener('adcontentresumerequested', _endPlayer);
  container.addEventListener('addestroyed', _endPlayer);

  rmp.init(settings);

})();
