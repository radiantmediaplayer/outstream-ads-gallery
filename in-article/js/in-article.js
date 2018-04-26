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
    backgroundColor: 'DDDDDD',
    ads: true,
    // when player comes into view, it will autoplay ...
    // also player is automatically played/paused when it becomes in/out of view with this option
    viewablePlayPause: true,
    // ... well muted autoplay to be precise since this an outstream ad
    muted: true,
    adOutStream: true,
    adTagReloadOnEnded: true,
    adTagUrl: 'https://www.radiantmediaplayer.com/vast/tags/inline-linear.xml',
    // we use client-side waterfalling in this case (optional)
    adTagWaterfall: [
      'https://www.radiantmediaplayer.com/vast/tags/inline-linear-1.xml'
    ]
  };

  // new player instance
  var rmp = new RadiantMP(elementID);
  // Radiant Media Player internal framework
  var fw = rmp.getFramework();

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

  // function to fade in player
  var _showPlayer = function () {
    container.style.opacity = 1;
    container.style.visibility = 'visible';
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

  // show player on adstarted for nicer presentation to viewer
  container.addEventListener('adstarted', _showPlayer);

  // init player after wiring events
  rmp.init(settings);

})(); 