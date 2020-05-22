
export const animateCSS = (element, animationName, callback) => {
  const node = document.querySelector(element);
  const animationNames = animationName.split(' ');
  node.classList.add('animated');
  for (let i = 0; i < animationNames.length; i++) {
    node.classList.add(animationNames[i]);
  }
  const handleAnimationEnd = () => {
    node.classList.remove('animated');
    for (let i = 0; i < animationNames.length; i++) {
      node.classList.remove(animationNames[i]);
    }
    node.removeEventListener('animationend', handleAnimationEnd);

    if (typeof callback === 'function') callback();
  };

  node.addEventListener('animationend', handleAnimationEnd);
};

export const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

export const deviceIs = () => {
  const TAM_DESKTOP = 1024;
  const tamaño = window.innerWidth ;
  return tamaño < TAM_DESKTOP ? 'mobile' : 'desktop';
};

export const viewportOrientation = () => {
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
}