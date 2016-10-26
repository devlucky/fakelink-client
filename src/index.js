import {getInfo} from 'maggie';
// require('./kakapo-config');
const dom = require('./dom');
const {$, $$, fillElements, on} = dom;
const elements = fillElements(); window.elements = elements;
const link = {
  title: '',
  realUrl: '',
  fakeUrl: '',
  image: '',
  description: ''
};

const addEvents = () => {
  on(elements.title, 'input', updateLinkValue);
  on(elements.realUrl, 'input', updateLinkValue);
  on(elements.description, 'input', updateLinkValue);
  on(elements.image, 'input', updateLinkValue);
  on(elements.saveLink, 'click', saveLink);

  on($('#fill-demo-data'), 'click', fillDemoData);
  //TODO: Local images supported
  getInfo(elements.image, onImageChange);
};

const fillDemoData = () => {
  elements.title.value = 'Nike buys Adidas for 1€';
  elements.realUrl.value = 'www.adidas.com/careers';
  elements.fakeUrl.value = 'www.nike.com';
  elements.image.value = 'https://pbs.twimg.com/profile_images/767816797827452928/TgIRijjA.jpg';
  elements.description.value = 'Description for the lulz';

  Object.keys(elements).forEach(name => {
    updateLinkValue.call(elements[name]);
  });
};

const saveLink = () => {
  const url = 'http://localhost:8080/links';
  const linkData = {
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
  const body = new FormData();

  body.append('json', JSON.stringify(linkData));

  const request = new Request(url, {
    method: 'POST', 
    body
    // mode: 'cors'
  });

  fetch(request).then(res => {
    console.log('response', res);
  });
};

const onImageChange = (info) => {
  console.log(info);
  link.image = info.src;

  updatePreview();
};

const updateLinkValue = function() {
  const propName = this.getAttribute('data-link-prop');

  link[propName] = this.value;
  updatePreview();
};

const updatePreview = () => {
  const services = Array.from($$('.services-preview .service'));
  
  services.forEach(service => {
    $('.service-title', service).textContent = link.title;
    $('.service-url', service).textContent = link.realUrl;
    $('.service-description', service).textContent = link.description;
    $('.service-img', service).src = link.image;
  });
};

addEvents();