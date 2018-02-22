/**
 * @license Copyright (c) 2015-2018 Radiant Media Player 
 * outstream-ads-gallery 0.1.0 | https://github.com/radiantmediaplayer/outstream-ads-gallery
 */

(function () {

  'use strict';

  var elementID = 'rmpPlayer';
  var container = document.getElementById(elementID);

  // function to check if player is in view port (e.g. visible to the viewer)
  var _isFullElementInViewport = function (element) {
    if (element && typeof element.getBoundingClientRect === 'function') {
      var rect = element.getBoundingClientRect();
      var viewportHeight = 0;
      if (document.documentElement && typeof document.documentElement.clientHeight === 'number') {
        viewportHeight = document.documentElement.clientHeight;
      } else if (typeof window.innerHeight === 'number') {
        viewportHeight = window.innerHeight;
      }
      if (viewportHeight > 0 && rect.top >= 0 && rect.bottom <= viewportHeight) {
        return true;
      }
    }
    return false;
  };

  var settings = {
    licenseKey: 'your-license-key',
    width: 640,
    height: 360,
    autoplay: true,
    skin: 'outstream',
    backgroundColor: 'DDDDDD',
    ads: true,
    adOutStream: true,
    adTagReloadOnEnded: true,
    adOutStreamMutedAutoplayVolumeHover: true,
    adTagUrl: 'https://www.radiantmediaplayer.com/vast/tags/inline-linear.xml',
    adTagWaterfall: [
      'https://www.radiantmediaplayer.com/vast/tags/inline-linear-1.xml'
    ]
  };

  var rmp = new RadiantMP(elementID);

  //function to remove player from DOM in case we are enable to autoplay the ad
  var _removePlayer = function () {
    container.addEventListener('destroycompleted', function () {
      var parent = container.parentNode;
      if (parent) {
        try {
          parent.removeChild(container);
        } catch (e) {
          FW.trace(e);
        }
      }
    });
    rmp.destroy();
  };

  // if Google IMA has been blocked by an ad-blocker or failed to load
  // we need to remove the player from DOM
  container.addEventListener('ready', function () {
    if (rmp.getAdParserBlocked()) {
      _removePlayer();
    }
  });

  var _initPlayer;
  var _onScrollInit;
  var _onScrollPauseOrPlay;
  _initPlayer = _onScrollInit = _onScrollPauseOrPlay = function () {
    return null;
  };


  // on scroll check if player container becomes 
  // visible in viewport - if so init player
  _onScrollInit = function () {
    if (_isFullElementInViewport(container)) {
      _initPlayer();
    }
  };

  // init player when container comes in viewport
  var playerInitialized = false;
  _initPlayer = function () {
    if (!playerInitialized) {
      playerInitialized = true;
      window.removeEventListener('scroll', _onScrollInit);
      rmp.init(settings);
    }
  };

  // on page load, check if player is in viewport or 
  // wait until it gets scrolled to
  if (_isFullElementInViewport(container)) {
    _initPlayer();
  } else {
    window.addEventListener('scroll', _onScrollInit);
  }

  // only play outstream ad when player is in view 
  // otherwise pause player - this is an optional feature
  _onScrollPauseOrPlay = function () {
    if (_isFullElementInViewport(container) && rmp.getAdPaused()) {
      rmp.play();
    } else if (!_isFullElementInViewport(container) && !rmp.getAdPaused()) {
      rmp.pause();
    }
  };
  container.addEventListener('adstarted', function () {
    window.addEventListener('scroll', _onScrollPauseOrPlay);
  });

  // on autoplay failure we remove player from DOM
  container.addEventListener('autoplayfailure', function () {
    _removePlayer();
  });

})(); 