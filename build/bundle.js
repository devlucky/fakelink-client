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
  var selectors = ['title', 'realUrl', 'fakeUrl', 'image', 'description', 'saveLink'];

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
'use strict';

var _maggie = require('maggie');

// require('./kakapo-config');
var dom = require('./dom');
var $ = dom.$;
var $$ = dom.$$;
var fillElements = dom.fillElements;
var on = dom.on;

var elements = fillElements();window.elements = elements;
var link = {
  title: '',
  realUrl: '',
  fakeUrl: '',
  image: '',
  description: ''
};

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
  elements.title.value = 'Nike buys Adidas for 1€';
  elements.realUrl.value = 'www.adidas.com/careers';
  elements.fakeUrl.value = 'www.nike.com';
  elements.image.value = 'https://pbs.twimg.com/profile_images/767816797827452928/TgIRijjA.jpg';
  elements.description.value = 'Description for the lulz';

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
    // mode: 'cors'
  });

  fetch(request).then(function (res) {
    console.log('response', res);
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

},{"./dom":2,"maggie":1}]},{},[3]);
