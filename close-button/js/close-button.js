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
    backgroundColor: 'DDDDDD',
    skin: 'outstream',
    autoplay: true,
    // we disable fadeIn on ready since we will take care of it when adstarted event happens
    fadeInPlayer: false,
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
  var fw = rmp.getFramework();
  var closeButton;

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
    closeButton.removeEventListener('click', _removePlayer);
    container.addEventListener('destroycompleted', _onDestroyCompleted);
    rmp.destroy();
  };

  var _appendCloseButton = function () {
    container.removeEventListener('adstarted', _appendCloseButton);
    closeButton = document.createElement('div');
    closeButton.className = 'rmp-outstream-close-button rmp-i rmp-i-close';
    // interacting with close button will cause player to be removed from DOM
    closeButton.addEventListener('click', _removePlayer);
    // append close button to player container
    container.appendChild(closeButton);
    // fade in player upon adstarted event
    fw.addClass(container, 'rmp-fade-in');
    container.style.opacity = 1;
    container.style.visibility = 'visible';
  };
  // on adstarted we append close button
  container.addEventListener('adstarted', _appendCloseButton);

  container.addEventListener('ready', function () {
    // if Google IMA or rmp-vast has been blocked by an ad-blocker or failed to load
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
