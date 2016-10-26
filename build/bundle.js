(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var getInfo = exports.getInfo = function getInfo(element, callback) {
  element = typeof element === 'string' ? document.querySelector(element) : element;
  element.addEventListener('change', function () {
    onChange(this, callback);
  });
};

var onChange = function onChange(element, callback) {
  var file = element.files[0];
  var reader = new FileReader();

  reader.onload = function (e) {
    var img = new Image();

    img.src = e.target.result;
    img.onload = function (_) {
      return callback(createInfoObject(img));
    };
  };

  reader.readAsDataURL(file);
};

var getData = function getData(img) {
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  var width = canvas.width = img.width;
  var height = canvas.height = img.height;

  context.drawImage(img, 0, 0);

  return context.getImageData(0, 0, width, height);
};

var createInfoObject = function createInfoObject(img) {
  return {
    width: img.width,
    height: img.height,
    src: img.src,
    element: img,
    imageData: getData(img).data
  };
};

},{}],2:[function(require,module,exports){
'use strict';

var $ = function $(selector, element) {
  return (element || document).querySelector(selector);
};

var $$ = function $$(selector) {
  return document.querySelectorAll(selector);
};

var on = function on(element, eventName, cb) {
  return element.addEventListener(eventName, cb);
};

var fillElements = function fillElements() {
  var selectors = ['title', 'realUrl', 'fakeUrl', 'image', 'description', 'saveLink', 'linkAttributes'];

  return selectors.reduce(function (prev, current) {
    prev[current] = $('[data-link-prop="' + current + '"]');

    return prev;
  }, {});
};

module.exports = {
  $: $,
  $$: $$,
  fillElements: fillElements,
  on: on
};

},{}],3:[function(require,module,exports){
"use strict";

/**
 * TODO: Try to use Proxy
 */
module.exports = function (promise) {
  var response = {
    then: function then() {
      var _promise$then;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      (_promise$then = promise.then).call.apply(_promise$then, [promise].concat(args));

      return response;
    },
    catch: function _catch() {
      var _promise$catch;

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      (_promise$catch = promise.catch).call.apply(_promise$catch, [promise].concat(args));

      return response;
    },
    finally: function _finally() {
      var _promise$then2, _promise$catch2;

      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      (_promise$then2 = promise.then).call.apply(_promise$then2, [promise].concat(args));
      (_promise$catch2 = promise.catch).call.apply(_promise$catch2, [promise].concat(args));

      return response;
    }
  };

  return response;
};

},{}],4:[function(require,module,exports){
'use strict';

var _maggie = require('maggie');

// require('./kakapo-config');
var dom = require('./dom');
var finalable = require('./finalable');
var $ = dom.$;
var $$ = dom.$$;
var fillElements = dom.fillElements;
var on = dom.on;

var elements = fillElements();window.elements = elements;
var getInitialLinkState = function getInitialLinkState() {
  return {
    title: '',
    realUrl: '',
    fakeUrl: '',
    image: '',
    description: ''
  };
};
var link = getInitialLinkState();
var addEvents = function addEvents() {
  on(elements.title, 'input', updateLinkValue);
  on(elements.realUrl, 'input', updateLinkValue);
  on(elements.description, 'input', updateLinkValue);
  on(elements.image, 'input', updateLinkValue);
  on(elements.saveLink, 'click', saveLink);

  on($('#fill-demo-data'), 'click', fillDemoData);
  //TODO: Local images supported
  (0, _maggie.getInfo)(elements.image, onImageChange);
};

var fillDemoData = function fillDemoData() {
  elements.title.value = 'Facebook Completes Its $22 Billion Purchase of WhatsApp';
  elements.realUrl.value = 'http://time.com/3477028/facebook-whatsapp-19-billion-dollar-deal';
  elements.fakeUrl.value = 'https://twitter.com/devluckyness';
  elements.image.value = 'http://www.iphoneforums.net/news/wp-content/uploads/2014/02/facebook-whatsapp-buy-buyout.jpg';
  elements.description.value = 'The final hurdle in the deal was crossed on Friday, when the E.U. approved the purchase after much resistance from Europe’s telecommunications industry';

  Object.keys(elements).forEach(function (name) {
    updateLinkValue.call(elements[name]);
  });
};

var saveLink = function saveLink() {
  var url = 'http://localhost:8080/links';
  var linkData = {
    link: {
      private: false,
      values: {
        title: link.title,
        url: link.realUrl,
        image: link.image,
        description: link.description
      }
    }
  };
  var body = new FormData();

  body.append('json', JSON.stringify(linkData));

  var request = new Request(url, {
    method: 'POST',
    body: body
  });

  elements.linkAttributes.classList.add('loading');

  finalable(fetch(request)).then(function (res) {
    elements.linkAttributes.classList.add('saved');

    elements.title.value = '';
    elements.realUrl.value = '';
    elements.fakeUrl.value = '';
    elements.image.value = '';
    elements.description.value = '';

    link = getInitialLinkState();
    updatePreview();
  }).catch(function (err) {
    elements.linkAttributes.classList.add('errored');
  }).finally(function () {
    elements.linkAttributes.classList.remove('loading');
  });
};

var onImageChange = function onImageChange(info) {
  console.log(info);
  link.image = info.src;

  updatePreview();
};

var updateLinkValue = function updateLinkValue() {
  var propName = this.getAttribute('data-link-prop');

  link[propName] = this.value;
  updatePreview();
};

var updatePreview = function updatePreview() {
  var services = Array.from($$('.services-preview .service'));

  services.forEach(function (service) {
    $('.service-title', service).textContent = link.title;
    $('.service-url', service).textContent = link.realUrl;
    $('.service-description', service).textContent = link.description;
    $('.service-img', service).src = link.image;
  });
};

addEvents();

},{"./dom":2,"./finalable":3,"maggie":1}]},{},[4]);
