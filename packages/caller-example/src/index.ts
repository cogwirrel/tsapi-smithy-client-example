import { MyApi } from 'smithy-ts-client';

void (async () => {
  const api = new MyApi({
    endpoint: 'https://wz79n53m01.execute-api.ap-southeast-2.amazonaws.com/prod/',
  });

  try {
    const res = await api.sayHello({
      name: 'error',
    });
    console.log('response', res);
  } catch (e) {
    console.error(e);
  }

})();

