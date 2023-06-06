import type {ColorScheme, UserSettings} from '../definitions';

export type TestMessage = {
    id: number;
    type: 'getManifest';
} | {
    id: number;
    type: 'changeSettings';
    data: Partial<UserSettings>;
} | {
    id: number;
    type: 'collectData';
} | {
    id: number;
    type: 'getChromeStorage';
    data: {
        region: 'local' | 'sync';
        keys: string | string[];
    };
} | {
    id: number;
    type: 'changeChromeStorage';
    data: {
        region: 'local' | 'sync';
        data: {[key: string]: any};
    };
} | {
    id: number;
    type: 'firefox-createTab';
    data: string;
} | {
    id: number;
    type: 'firefox-getColorScheme';
} | {
    id: number;
    type: 'firefox-emulateColorScheme';
    data: ColorScheme;
};

