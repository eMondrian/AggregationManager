// Can not use destructurization because we have to save link for isStoped prop
export const setIntervalAsync = (data) => {
  if (!data.isStoped) {
    data.callback()
      .then(() => {
          setTimeout(() => {
            setIntervalAsync(data)
          }, data.intervalTime);
      });
  }
};