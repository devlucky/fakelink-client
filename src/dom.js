const $ = (selector, element) => (element || document).querySelector(selector);

const $$ = selector => document.querySelectorAll(selector);

const on = (element, eventName, cb) => element.addEventListener(eventName, cb);

const fillElements = function() {
  const selectors = ['title', 'realUrl', 'fakeUrl', 'image', 'description', 'saveLink'];

  return selectors.reduce((prev, current) => {
    prev[current] = $(`[data-link-prop="${current}"]`);

    return prev;
  }, {});
};

module.exports = {
  $,
  $$,
  fillElements,
  on
};