export function addLoader(target) {
  var html = '<div class="preloader-wrapper small active"><div class="spinner-layer spinner-blue-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>';

  target.className = target.className + ' center-align';
  target.innerHTML = html;
}

export function removeLoader(target) {
  var progress = target.querySelector('.preloader-wrapper');
  target.className = target.className.replace('center-align', '');
  progress.parentElement.removeChild(progress);
}

export function documentReady() {
  var progress = document.querySelector('.progress');
  progress.parentElement.removeChild(progress);

  var container = document.querySelector('.container');
  container.className = container.className.replace('hide', '');
}

export function errorMessage(reason) {
  console.log(reason);
}
