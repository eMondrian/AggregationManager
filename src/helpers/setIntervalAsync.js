export const setIntervalAsync = (fn, intervalTime) => {
  let inProgress = true

  const intervalFunc = (fn, intervalTime) => {
    if (inProgress) {
      fn().then(() => {
        setTimeout(() => {
          intervalFunc(fn, intervalTime)
        }, intervalTime);
      });
    }
  }

  const clearInterval = () => {
    inProgress = false
  }
  
  intervalFunc(fn, intervalTime)
  return clearInterval
};
