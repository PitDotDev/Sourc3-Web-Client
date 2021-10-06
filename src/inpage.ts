import PostMessageStream from 'post-message-stream';
import { cbToPromise, setupDnode, transformMethods } from '@core/setupDnode';

async function setupInpageApi() {
  const connectionStream = new PostMessageStream({
    name: 'page',
    target: 'content2',
  });

  const inpageApi = {};
  const dnode = setupDnode(connectionStream, inpageApi);
  await new Promise((resolve) => {
    dnode.once('remote', (remoteApi) => {
      resolve(transformMethods(cbToPromise, remoteApi));
    });
  }).then((api) => {
    global.BeamApi = api;
    window.postMessage('apiInjected', window.origin);
    console.log('BEAM WALLET API INJECTED');
    return api;
  });
}

setupInpageApi().catch(console.error);