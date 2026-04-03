
let hasLoadedContentandBehavior = false;
const
  entrySelector = '#turntable-conte',
  loadSelector = '#loadit',
  contentUrl = '/content/document/partials/turntable.pug',
  behaviorUrl = '/source/behavior/parts/turntable.part.mjs',
  presentationUrl = '/presentation/index.main.styl',

  subjectHTML = `
  <DOCTYPE html><html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Conte</title>
    </head>
    <body>
    <div id="container"></div>
    </body>
  </html>`;


const loadContent = async () => {
  let resp, result;

  try {
    resp = await fetch(contentUrl);
    result = await resp.text();
  } catch (contentErr) {
    console.error(contentErr);
    result = '';
  }

  console.log('Fetched ' + contentUrl);
  return result;
};


const loadPresentation = async () => {
  console.log("Will fetch " + behaviorUrl);
  return true;
  //return await import(presentationUrl);
}


const loadBehavior = async () => {
  console.log(`Will fetch ${presentationUrl}`);
  return true;
  //return await import(behaviorUrl);
};


const loadContentandBehavior = async () => {
  let hasLoadedContent = false, hasLoadedPresentation = false, hasLoadedBehavior = false;
  const result = {};

  if (!hasLoadedContentandBehavior) {
    try {
      result.markup = await loadContent();
      if (result.markup) { hasLoadedContent = true; }
    } catch (ldCntErr) {
      console.error(ldCntErr);
    }

    try {
      result.cascade = await loadPresentation();
      if (result.cascade) { hasLoadedPresentation = true; }
    } catch (ldPrsntErr) {
      console.error(ldPrsntErr);
    }

    try {
      result.scrpt = await loadBehavior();
      if (result.scrpt) {
        hasLoadedBehavior = true;
      }
    } catch (ldBhvrErr) {
      console.error(ldBhvrErr);
    }

    hasLoadedContentandBehavior = hasLoadedContent && hasLoadedPresentation && hasLoadedBehavior;
  }

  return result;
};


document.addEventListener('DOMContentLoaded', async () => {
  const
    getDoc = new DOMParser(),
    $subjectMembrane = document.createElement('div'),
    $subjectFrame = document.createElement('iframe'),
    subjectDoc = getDoc.parseFromString(subjectHTML, 'text/html');

  if (!subjectDoc) { return; }

  document.querySelector(loadSelector)?.addEventListener('click', async (_clickEvt) => {
    let assets, $subj;
    if (_clickEvt.target !== document.querySelector(loadSelector)) { return; }

    assets = await loadContentandBehavior();

    if (!hasLoadedContentandBehavior || !assets) { return; }

    $subj = getDoc.parseFromString(assets.markup, 'text/html').body.children[0];

    if (!$subj) { return; }

    subjectDoc.querySelector('#container')?.replaceChildren($subj);

    document.querySelector(loadSelector)?.addEventListener('transitionend', () => {
      document.querySelector(loadSelector)?.remove();

      $subjectFrame.srcdoc = subjectDoc.children[0].getHTML();

      $subjectMembrane.replaceChildren($subjectFrame);
      $subjectMembrane.classList.add('subject-membrane');
      document.querySelector(entrySelector)?.replaceChildren($subjectMembrane);
    }, {once: true});

    document.querySelector(loadSelector)?.setAttribute('style', 'opacity:0;');
  });
});
