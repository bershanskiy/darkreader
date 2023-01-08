import {injectProxy} from './stylesheet-proxy';

document && document.currentScript && document.currentScript.remove();
const argString = document && document.currentScript && document.currentScript.dataset.arg;
if (argString) {
    const arg: boolean = JSON.parse(argString);
    injectProxy(arg);
}
