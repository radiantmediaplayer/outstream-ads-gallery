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
    skin: 'outstream',
    autoplay: true,
    ads: true,
    adOutStream: true,
    adTagUrl: 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-2.xml',
    // we use client-side waterfalling in this case (optional)
    adTagWaterfall: [
      'https://www.radiantmediaplayer.com/vast/tags/inline-linear-1.xml'
    ]
  };

  // new player instance
  var rmp = new RadiantMP(elementID);
  // Radiant Media Player internal framework
  var fw = rmp.getFramework();

  var _removeElement = function(element) {
    var parent = element.parentNode;
    if (parent) {
      try {
        parent.removeChild(element);
      } catch (e) {
        fw.trace(e);
      }
    }
  };

  // when destroy method finishes we clear listeners and remove player from DOM
  var _onDestroyCompleted = function () {
    container.removeEventListener('destroyerror', _onDestroyCompleted);
    container.removeEventListener('destroycompleted', _onDestroyCompleted);
    _removeElement(container);
    // we also remove sponsor message in this case (optional)
    var sponsorMessage = document.getElementById('sponsor-message');
    if (sponsorMessage) {
      _removeElement(sponsorMessage);
    }
  };

  // player needs be removed from page 
  // first we need to destroy it
  var _removePlayer = function () {
    container.addEventListener('destroyerror', _onDestroyCompleted);
    container.addEventListener('destroycompleted', _onDestroyCompleted);
    rmp.destroy();
  };

  // function to fade out player
  var _endPlayer = function () {
    container.removeEventListener('autoplayfailure', _endPlayer);
    container.removeEventListener('adcontentresumerequested', _endPlayer);
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
  // when ad ends - adcontentresumerequested event - we fade out player and remove it from DOM
  // in case of autoplayfailure event we also need to remove it - note that autoplayfailure should 
  // be infrequent if you are using muted autoplay as recommended
  // whichever comes first
  container.addEventListener('autoplayfailure', _endPlayer);
  container.addEventListener('adcontentresumerequested', _endPlayer);

  rmp.init(settings);

})();