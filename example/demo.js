import {RuntimeUA, Sandbox} from '../src/runtime-core';

import SandboxFactory from '../resources/sandboxes/SandboxFactory';
// import MessageFactory from '../../resources/MessageFactory';

var sandboxFactory = new SandboxFactory();
var messageFactory = new MessageFactory();

var runtime = new RuntimeUA(sandboxFactory);

indexedDB.deleteDatabase('registry-DB');

var hypertiesList = ['hyperty-catalogue://ua.pt/HelloHyperty', 'hyperty-catalogue://ua.pt/WorldHyperty'];

function errorMessage(reason) {
  console.log(reason);
}

function deployedHyperties(hyperty, result) {

  var hypertyName = hyperty.substr(hyperty.lastIndexOf('/') + 1);
  var hypertyEl = document.querySelector('.' + hypertyName);

  hypertyEl.querySelector('.status').innerHTML = result.status;
  hypertyEl.querySelector('.name').innerHTML = hypertyName;
  hypertyEl.querySelector('.runtime-hyperty-url').innerHTML = result.runtimeHypertyURL;
  hypertyEl.querySelector('.form').setAttribute('data-url', result.runtimeHypertyURL);
  hypertyEl.querySelector('.send').addEventListener('click', function(e) {

    var target = e.target;
    var form = target.parentElement;
    var fromHyperty = form.getAttribute('data-url');
    var toHyperty = form.querySelector('.toHyperty').value;
    var messageHypert = form.querySelector('.messageHyperty').value;

    if (fromHyperty && toHyperty && messageHypert) {
      sendMessage(fromHyperty, toHyperty, messageHypert);
    }

    form.reset();

    e.preventDefault();
  });

  runtime.messageBus.addListener(result.runtimeHypertyURL, newMessageRecived);

}

function newMessageRecived(msg) {

  var fromHyperty = msg.from;
  var toHyperty = msg.to;

  var elTo = document.querySelector('form[data-url="' + toHyperty + '"]');
  var listTo = elTo.parentElement.querySelector('.list');

  var itemTo = document.createElement('li');
  itemTo.setAttribute('class', 'collection-item avatar right-align');
  itemTo.innerHTML = '<i class="material-icons circle green">call_received</i><label class="name title">' + fromHyperty + '</label><p class="message">' + msg.body.value.replace(/\n/g, '<br>') + '</p>';

  listTo.appendChild(itemTo);

}

function sendMessage(from, to, message) {

  var messageObject = {
    to: to,
    from: from,
    type: 'message',
    body:{
      value: message
    }
  };

  var form = document.querySelector('form[data-url="' + from + '"]');
  if (form) {
    var listFrom = form.parentElement.querySelector('.list');
    var itemFrom = document.createElement('li');
    itemFrom.setAttribute('class', 'collection-item avatar');
    itemFrom.innerHTML = '<i class="material-icons circle yellow">call_made</i><label class="name title">' + from + '</label><p class="message">' + messageObject.body.value.replace(/\n/g, '<br>') + '</p>';

    listFrom.appendChild(itemFrom);
  }

  runtime.messageBus.postMessage(messageObject);
}

function loadHyperties() {

  var time = 1;

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

loadHyperties();

// END Testing code;
