import { ApiError, MyApi } from "smithy-ts-client";

void (async () => {
  const api = new MyApi({
    endpoint: '<url here>',
  });

  try {
    const res = await api.sayHello({
      name: 'error',
    });
    console.log('response', res);
  } catch (e) {
    if (e instanceof ApiError) {
      console.error('The error message is', e.errorMessage);
    } else {
      console.error('Unexpected error', e);
    }
  }

})();

