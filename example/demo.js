// jshint browser:true, jquery: true
import RuntimeUA from '../src/runtimeUA';

import SandboxFactory from '../resources/sandboxes/SandboxFactory';

let sandboxFactory = new SandboxFactory();

let runtime = new RuntimeUA(sandboxFactory);
window.runtime = runtime;

let hypertiesList = ['http://ua.pt/HelloHyperty', 'http://ua.pt/WorldHyperty'];

function errorMessage(reason) {
  console.log(reason);
}

let loginBtn = document.querySelector('.login');
loginBtn.addEventListener('click', function() {
  runtime.identityModule.loginWithRP().then(userLoged).catch(errorMessage);
});

function userLoged(result) {
  console.log('result: ', result);

  let hypertyHolder = document.querySelector('.hyperties');
  hypertyHolder.className = hypertyHolder.className.replace('hide', '');

  loadHyperties();
}

// let hypertiesList = ['http://localhost:4000/HelloHyperty', 'http://localhost:4000/WorldHyperty'];

function errorMessage(reason) {
  console.log(reason);
}

function deployedHyperties(hyperty, result) {

  let hypertyName = hyperty.substr(hyperty.lastIndexOf('/') + 1);
  let hypertyEl = document.querySelector('.' + hypertyName);

  hypertyEl.querySelector('.status').innerHTML = result.status;
  hypertyEl.querySelector('.name').innerHTML = hypertyName;
  hypertyEl.querySelector('.runtime-hyperty-url').innerHTML = result.runtimeHypertyURL;
  hypertyEl.querySelector('.form').setAttribute('data-url', result.runtimeHypertyURL);
  hypertyEl.querySelector('.send').addEventListener('click', function(e) {

    let target = e.target;
    let form = target.parentElement;
    let fromHyperty = form.getAttribute('data-url');
    let toHyperty = form.querySelector('.toHyperty').value;
    let messageHypert = form.querySelector('.messageHyperty').value;

    if (fromHyperty && toHyperty && messageHypert) {
      sendMessage(fromHyperty, toHyperty, messageHypert);
    }

    form.reset();

    e.preventDefault();
  });

  runtime.messageBus.addListener(result.runtimeHypertyURL, newMessageRecived);

}

function newMessageRecived(msg) {

  let fromHyperty = msg.from;
  let toHyperty = msg.to;

  let elTo = document.querySelector('form[data-url="' + toHyperty + '"]');
  let listTo = elTo.parentElement.querySelector('.list');

  let itemTo = document.createElement('li');
  itemTo.setAttribute('class', 'collection-item avatar right-align');
  itemTo.innerHTML = '<i class="material-icons circle green">call_received</i><label class="name title">' + fromHyperty + '</label><p class="message">' + msg.body.value.replace(/\n/g, '<br>') + '</p>';

  listTo.appendChild(itemTo);

}

function sendMessage(from, to, message) {

  let messageObject = {
    to: to,
    from: from,
    type: 'message',
    body:{
      value: message
    }
  };

  let form = document.querySelector('form[data-url="' + from + '"]');
  if (form) {
    let listFrom = form.parentElement.querySelector('.list');
    let itemFrom = document.createElement('li');
    itemFrom.setAttribute('class', 'collection-item avatar');
    itemFrom.innerHTML = '<i class="material-icons circle yellow">call_made</i><label class="name title">' + from + '</label><p class="message">' + messageObject.body.value.replace(/\n/g, '<br>') + '</p>';

    listFrom.appendChild(itemFrom);
  }

  runtime.messageBus.postMessage(messageObject);
}

function loadHyperties() {

  let time = 1;

  hypertiesList.forEach(function(hyperty) {

    setTimeout(function() {

      // Load First Hyperty
      runtime.loadHyperty(hyperty).then(function(result) {
        deployedHyperties(hyperty, result);
      }).catch(function(reason) {
        errorMessage(reason);
      });

      // This load stub is not necessary, because for domain ua.pt the loadHyperty
      // create a stub for the same domain;
      // r.loadStub('ua.pt').then(function(result) {
      //   console.log(result);
      // }).catch(function(reason) {
      //   console.log(reason);
      // });

    }, (1000 * time));

    time++;

  });

}

// END Testing code;
