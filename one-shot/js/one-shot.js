/**
 * @license Copyright (c) 2015-2018 Radiant Media Player 
 * outstream-ads-gallery 0.1.0 | https://github.com/radiantmediaplayer/outstream-ads-gallery
 */

(function () {

  'use strict';

  var elementID = 'rmpPlayer';
  var container = document.getElementById(elementID);

  var settings = {
    licenseKey: 'your-license-key',
    width: 640,
    height: 360,
    autoplay: true,
    skin: 'outstream',
    ads: true,
    adOutStream: true,
    adOutStreamCloseOnEnded: true,
    adTagUrl: 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-2.xml',
    adTagWaterfall: [
      'https://www.radiantmediaplayer.com/vast/tags/inline-linear-1.xml'
    ]
  };

  var rmp = new RadiantMP(elementID);
  var fw = rmp.getFramework();

  // function to fade in player
  var _showPlayer = function () {
    container.style.opacity = 1;
    container.style.visibility = 'visible';
  };

  // function to fade out player
  var _hidePlayer = function () {
    container.style.opacity = 0;
    container.style.visibility = 'hidden';
  };

  //function to remove player from DOM in case we are enable to autoplay the ad
  var _removePlayer = function () {
    container.addEventListener('destroycompleted', function () {
      var parent = container.parentNode;
      if (parent) {
        try {
          parent.removeChild(container);
        } catch (e) {
          fw.trace(e);
        }
      }
    });
    rmp.destroy();
  };

  container.addEventListener('ready', function () {
    // if Google IMA has been blocked by an ad-blocker or failed to load
    // we need to remove the player from DOM
    if (rmp.getAdParserBlocked()) {
      _removePlayer();
      return;
    }
    // if autoplay has been disabled due to lack of device support we show player 
    // to allow a user interaction to start ad
    if (!rmp.getAutoplayRequested()) {
      _showPlayer();
    }
  });
  // on autoplay failure we remove player from DOM
  container.addEventListener('autoplayfailure', function () {
    _removePlayer();
  });
  // on ad starte we fade in player
  container.addEventListener('adstarted', function () {
    _showPlayer();
  });
  // when ad ends we fade out player
  // it will automatically be removed with adOutStreamCloseOnEnded setting
  container.addEventListener('adcontentresumerequested', function () {
    _hidePlayer();
  });

  rmp.init(settings);

})();