
const getFixtures = () => {
  return Object.freeze({
    waaitt: async (ms = 2000) => {
      const fMS = ms >= 1000 ? ms : 1000;

      // oxlint-disable-next-line compat/compat
      return window.scheduler.postTask(() => {}, {
        delay: fMS <= 30000 ? fMS : 30000,
        priority: 'user-blocking'
      });
    }
  });
};


const apparatus = getFixtures();

export default apparatus;
