import {getInfo} from 'maggie';
// require('./kakapo-config');
const dom = require('./dom');
const finalable = require('./finalable');
const {$, $$, fillElements, on} = dom;
const elements = fillElements(); window.elements = elements;
const getInitialLinkState = () => ({
  title: '',
  realUrl: '',
  fakeUrl: '',
  image: '',
  description: ''
});
let link = getInitialLinkState();
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
  elements.title.value = 'Facebook Completes Its $22 Billion Purchase of WhatsApp';
  elements.realUrl.value = 'http://time.com/3477028/facebook-whatsapp-19-billion-dollar-deal';
  elements.fakeUrl.value = 'https://twitter.com/devluckyness';
  elements.image.value = 'http://www.iphoneforums.net/news/wp-content/uploads/2014/02/facebook-whatsapp-buy-buyout.jpg';
  elements.description.value = 'The final hurdle in the deal was crossed on Friday, when the E.U. approved the purchase after much resistance from Europe’s telecommunications industry';

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
  });

  elements.linkAttributes.classList.add('loading');
  
  finalable(fetch(request))
  .then(res => {
    elements.linkAttributes.classList.add('saved');

    elements.title.value = '';
    elements.realUrl.value = '';
    elements.fakeUrl.value = '';
    elements.image.value = '';
    elements.description.value = '';

    link = getInitialLinkState();
    updatePreview();
  })
  .catch(err => {
    elements.linkAttributes.classList.add('errored');
  })
  .finally(() => {
    elements.linkAttributes.classList.remove('loading');
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