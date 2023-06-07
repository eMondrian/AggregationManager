import { ref } from "vue";
import { v4 } from "uuid";

const errorList = ref([]);


export const useErrorHandler = () => {
  const handleError = (e) => {
    const errorObject = {
      uid: v4(),
      message: e.message,
      name: e.name,
    };

    errorList.value.push(errorObject);
  }

  const removeError = (uid) => {
    const i = errorList.value.findIndex((e) => e.uid === uid);
    errorList.value.splice(i, 1);
  }

  return { errorList, handleError, removeError }
}