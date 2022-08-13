import {createOrUpdateStyle, removeStyle} from './style';
import {createOrUpdateSVGFilter, removeSVGFilter} from './svg-filter';
import {runDarkThemeDetector, stopDarkThemeDetector} from './detector';
import {createOrUpdateDynamicTheme, removeDynamicTheme, cleanDynamicThemeCache} from './dynamic-theme';
import {logWarn, logInfoCollapsed} from '../utils/log';
import {isSystemDarkModeEnabled, runColorSchemeChangeDetector, stopColorSchemeChangeDetector} from '../utils/media-query';
import {collectCSS} from './dynamic-theme/css-collection';
import type {Message} from '../definitions';
import {MessageType} from '../utils/message';
import {isThunderbird} from '../utils/platform';

let unloaded = false;

declare const __MV3__: boolean;

function cleanup() {
    unloaded = true;
    removeEventListener('pagehide', onPageHide);
    removeEventListener('freeze', onFreeze);
    removeEventListener('resume', onResume);
    cleanDynamicThemeCache();
    stopDarkThemeDetector();
    stopColorSchemeChangeDetector();
}

function sendMessage(message: Message) {
    if (unloaded) {
        return;
    }
    const responseHandler = (response: 'unsupportedSender' | undefined) => {
        // Vivaldi bug workaround. See TabManager for details.
        if (response === 'unsupportedSender') {
            removeStyle();
            removeSVGFilter();
            removeDynamicTheme();
            cleanup();
        }
    };

    try {
        if (__MV3__) {
            const promise: Promise<Message | 'unsupportedSender'> = chrome.runtime.sendMessage<Message>(message);
            promise.then(responseHandler).catch(cleanup);
        } else {
            chrome.runtime.sendMessage<Message, 'unsupportedSender' | undefined>(message, responseHandler);
        }
    } catch (error) {
        /*
         * We get here if Background context is unreachable which occurs when:
         *  - extension was disabled
         *  - extension was uninstalled
         *  - extension was updated and this is the old instance of content script
         *
         * Any async operations can be ignored here, but sync ones should run to completion.
         *
         * Regular message passing errors are returned via rejected promise or runtime.lastError.
         */
        if (error.message === 'Extension context invalidated.') {
            console.log('Dark Reader: instance of old CS detected, clening up.');
            cleanup();
        } else {
            console.log('Dark Reader: unexpected error during message passing.');
        }
    }
}

let pickerContainer: HTMLDivElement, pickerFrame: HTMLIFrameElement;
function openPicker(token: string) {
    if (pickerFrame || pickerContainer) {
        return;
    }

    /**
     * Use contentWindow.location instead of src to hide the URL from the page.
     * This hides the extension id and token from the page.
     * At this time, we don't rely on secrecy of presence of Dark Reader popup on the page
     * and the secrecy of the token from the tab, but we hide it anyway just in case.
     * To do it:
     *  1. create container <div> and <iframe>
     *  2. add styles to hide container <div> until picker frame is fully loaded
     *  3. append <iframe> to <div> and <div> to body to initialize process and make <iframe> contentWindow defined
     *  4. set <iframe> URL via iframe.contentWindow.location
     *  5. when frame is loaded, reveal it
     */

    function onAboutBlankLoaded() {}

    // Step 1
    pickerContainer = document.createElement('div');
    pickerFrame = document.createElement('iframe');
    // Step 2
    pickerContainer.style.all = 'initial !important';
    pickerContainer.style.display = 'none';
    pickerContainer.style.position = 'absolute';
    pickerContainer.style.width = '0px';
    pickerContainer.style.height = '0px';
    pickerContainer.style.padding = '0px';
    pickerContainer.style.border = '0px';
    pickerContainer.style.margin = '0px';
    pickerContainer.style.zIndex = '2147483647';
    // Step 3
    pickerContainer.appendChild(pickerFrame);
    document.documentElement.appendChild(pickerContainer);
    // Step 4
    pickerFrame.contentWindow.location = chrome.runtime.getURL(`ui/picker/index.html?t=${token}`);
    pickerFrame.style.zIndex = '2147483647';
    pickerFrame.style.border = '0px';
    pickerFrame.style.position = 'fixed';
    pickerFrame.style.bottom = '50px';
    pickerFrame.style.right = '50px';
    // Step 5
    pickerFrame.addEventListener('load', () => pickerContainer.style.display = '');
}

function onMessage({type, data}: Message) {
    logInfoCollapsed(`onMessage[${type}]`, data);
    switch (type) {
        case MessageType.BG_ADD_CSS_FILTER:
        case MessageType.BG_ADD_STATIC_THEME: {
            const {css, detectDarkTheme} = data;
            removeDynamicTheme();
            createOrUpdateStyle(css, type === MessageType.BG_ADD_STATIC_THEME ? 'static' : 'filter');
            if (detectDarkTheme) {
                runDarkThemeDetector((hasDarkTheme) => {
                    if (hasDarkTheme) {
                        removeStyle();
                        onDarkThemeDetected();
                    }
                });
            }
            break;
        }
        case MessageType.BG_ADD_SVG_FILTER: {
            const {css, svgMatrix, svgReverseMatrix, detectDarkTheme} = data;
            removeDynamicTheme();
            createOrUpdateSVGFilter(svgMatrix, svgReverseMatrix);
            createOrUpdateStyle(css, 'filter');
            if (detectDarkTheme) {
                runDarkThemeDetector((hasDarkTheme) => {
                    if (hasDarkTheme) {
                        removeStyle();
                        removeSVGFilter();
                        onDarkThemeDetected();
                    }
                });
            }
            break;
        }
        case MessageType.BG_ADD_DYNAMIC_THEME: {
            const {theme, fixes, isIFrame, detectDarkTheme} = data;
            removeStyle();
            createOrUpdateDynamicTheme(theme, fixes, isIFrame);
            if (detectDarkTheme) {
                runDarkThemeDetector((hasDarkTheme) => {
                    if (hasDarkTheme) {
                        removeDynamicTheme();
                        onDarkThemeDetected();
                    }
                });
            }
            break;
        }
        case MessageType.BG_EXPORT_CSS:
            collectCSS().then((collectedCSS) => sendMessage({type: MessageType.CS_EXPORT_CSS_RESPONSE, data: collectedCSS}));
            break;
        case MessageType.BG_UNSUPPORTED_SENDER:
        case MessageType.BG_CLEAN_UP:
            removeStyle();
            removeSVGFilter();
            removeDynamicTheme();
            stopDarkThemeDetector();
            break;
        case MessageType.BG_RELOAD:
            logWarn('Cleaning up before update');
            cleanup();
            break;
        case MessageType.BG_OPEN_PICKER:
            openPicker(data);
            break;
        default:
            break;
    }
}

runColorSchemeChangeDetector((isDark) =>
    sendMessage({type: MessageType.CS_COLOR_SCHEME_CHANGE, data: {isDark}})
);

chrome.runtime.onMessage.addListener(onMessage);
sendMessage({type: MessageType.CS_FRAME_CONNECT, data: {isDark: isSystemDarkModeEnabled()}});

function onPageHide(e: PageTransitionEvent) {
    if (e.persisted === false) {
        sendMessage({type: MessageType.CS_FRAME_FORGET});
    }
}

function onFreeze() {
    sendMessage({type: MessageType.CS_FRAME_FREEZE});
}

function onResume() {
    sendMessage({type: MessageType.CS_FRAME_RESUME, data: {isDark: isSystemDarkModeEnabled()}});
}

function onDarkThemeDetected() {
    sendMessage({type: MessageType.CS_DARK_THEME_DETECTED});
}

// Thunderbird don't has "tabs", and emails aren't 'frozen' or 'cached'.
// And will currently error: `Promise rejected after context unloaded: Actor 'Conduits' destroyed before query 'RuntimeMessage' was resolved`
if (!isThunderbird) {
    addEventListener('pagehide', onPageHide);
    addEventListener('freeze', onFreeze);
    addEventListener('resume', onResume);
}
