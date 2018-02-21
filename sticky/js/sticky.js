/**
 * @license Copyright (c) 2015-2018 Radiant Media Player 
 * outstream-ads-gallery 0.1.0 | https://github.com/radiantmediaplayer/outstream-ads-gallery
 */

(function () {

  'use strict';

  var elementID = 'rmpPlayer';
  var container = document.getElementById(elementID);
  var stickyContainer = document.getElementById('sticky-container');

  // function to fade in sticky container
  var _showPlayer = function () {
    stickyContainer.style.opacity = 1;
    stickyContainer.style.visibility = 'visible';
  };

  // function to fade out sticky container
  var _hidePlayer = function () {
    stickyContainer.style.opacity = 0;
    stickyContainer.style.visibility = 'hidden';
  };

  // function to remove player from DOM in case we are enable to autoplay the ad
  // or the ad has finished and we need to remove stickyContainer
  var _removePlayer = function () {
    container.addEventListener('destroycompleted', function () {
      var parent = stickyContainer.parentNode;
      if (parent) {
        try {
          parent.removeChild(stickyContainer);
        } catch (e) {
          FW.trace(e);
        }
      }
    });
    rmp.destroy();
  };

  var settings = {
    licenseKey: 'your-license-key',
    ads: true,
    adTagUrl: 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-2.xml',
    adTagWaterfall: [
      'https://www.radiantmediaplayer.com/vast/tags/inline-linear-1.xml'
    ],
    // we use autoHeightMode and size our stickyContainer with media queries CSS
    autoHeightMode: true,
    adOutStream: true,
    adOutStreamMutedAutoplayVolumeHover: true,
    skin: 'outstream'
  };

  var rmp = new RadiantMP(elementID);

    // if autoplay has been disabled due to lack of device support 
    // or if Google IMA has been blocked by an ad-blocker or failed to load
    // we remove the player from DOM before it does anything
  container.addEventListener('ready', function () {
    if (!rmp.getAutoplayRequested() || rmp.getAdParserBlocked()) {
      _removePlayer();
    }
  });
  // on autoplay failure we remove player from DOM
  container.addEventListener('autoplayfailure', function () {
    _removePlayer();
  });
  // we have an ad start - we fade in player
  container.addEventListener('adstarted', function () {
    _showPlayer();
  });
  // ad has finished we fade out player, then remove it
  container.addEventListener('adcontentresumerequested', function () {
    _hidePlayer();
    setTimeout(function () {
      _removePlayer();
    }, 400);
  });

  rmp.init(settings);

})();