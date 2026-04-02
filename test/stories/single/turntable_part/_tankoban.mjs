
let hasLoadedContentandBehavior = false;
const
  contentUrl = '/content/document/partials/turntable.pug',
  behaviorUrl = '/source/behavior/parts/turntable.part.mjs',
  presentationUrl = '/presentation/index.main.styl';


const loadContent = async () => {
  console.log('Will fetch ' + contentUrl);
  return true;
  //return await import(contentUrl);
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
  let hasLoadedContent, hasLoadedPresentation, hasLoadedBehavior;
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

    if (hasLoadedContent && hasLoadedPresentation && hasLoadedBehavior) {
      hasLoadedContentandBehavior = true;
    }
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  document.querySelector('#loadit')?.addEventListener('click', loadContentandBehavior);
}, { once: true });
