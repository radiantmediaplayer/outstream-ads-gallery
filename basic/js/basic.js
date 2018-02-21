/**
 * @license Copyright (c) 2015-2018 Radiant Media Player 
 * outstream-ads-gallery 0.1.0 | https://github.com/radiantmediaplayer/outstream-ads-gallery
 */

(function () {

  'use strict';
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
  var elementID = 'rmpPlayer';
  var rmp = new RadiantMP(elementID);
  rmp.init(settings);

})();