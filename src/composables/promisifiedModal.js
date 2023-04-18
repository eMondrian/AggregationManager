import { ref } from "vue";

export const usePromisifiedModal = (
  resetFn = () => {},
  opened = () => {}
) => {
  const isOpened = ref(false);
  let resolveFunction = () => {};
  let runPromise = new Promise((res) => {
    resolveFunction = res;
  });

  const run = (data) => {
    isOpened.value = true;
    opened(data);
    return runPromise;
  };

  const close = (data) => {
    resolveFunction(data);
    runPromise = new Promise((res) => {
      resolveFunction = res;
    });

    isOpened.value = false;
    resetFn();
  };

  return { isOpened, run, close };
}