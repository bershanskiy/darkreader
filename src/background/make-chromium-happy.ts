import {MessageTypeCStoBG, MessageTypeUItoBG} from '../utils/message';
import type {MessageCStoBG, MessageUItoBG} from '../definitions';

declare const __CHROMIUM_MV2__: boolean;

// This function exists to prevent Chrome from logging an error about
// closed conduit. It just sends a dummy message in response to incomming message
// to utilise open conduit. This response message is not even used on the other side.
export function makeChromiumHappy(): void {
    if (!__CHROMIUM_MV2__) {
        return;
    }
    chrome.runtime.onMessage.addListener((message: MessageUItoBG | MessageCStoBG, _, sendResponse) => {
        if (![
            // Messenger
            MessageTypeUItoBG.GET_DATA,
            MessageTypeUItoBG.GET_DEVTOOLS_DATA,
            MessageTypeUItoBG.APPLY_DEV_DYNAMIC_THEME_FIXES,
            MessageTypeUItoBG.APPLY_DEV_INVERSION_FIXES,
            MessageTypeUItoBG.APPLY_DEV_STATIC_THEMES,
            MessageTypeCStoBG.DOCUMENT_CONNECT,
            MessageTypeCStoBG.DOCUMENT_RESUME,
            MessageTypeCStoBG.FETCH,
        ].includes(message.type as MessageTypeUItoBG)) {
            sendResponse({type: '¯\\_(ツ)_/¯'});
        }
    });
}
