import type {ParsedColorSchemeConfig} from './utils/colorscheme-parser';
import type {FilterMode} from './generators/css-filter';
import type {DebugMessageTypeBGtoCS, DebugMessageTypeBGtoUI, DebugMessageTypeCStoBG, MessageTypeBGtoCS, MessageTypeBGtoUI, MessageTypeCStoBG, MessageTypeCStoUI, MessageTypeUItoBG, MessageTypeUItoCS} from './utils/message';
import type {AutomationMode} from './utils/automation';
import type {ThemeEngine} from './generators/theme-engines';

export type ColorScheme = 'dark' | 'light';

export type LogLevel = 'info' | 'warn' | 'assert';

// ContextId is a number on Firefox and documentId is a string in Chromium,
// let's use string for simplicity
export type documentId = string;
export type tabId = number;
export type frameId = number;

export type ExtensionData = {
    isEnabled: boolean;
    isReady: boolean;
    isAllowedFileSchemeAccess: boolean;
    settings: UserSettings;
    news: News[];
    shortcuts: Shortcuts;
    colorScheme: ParsedColorSchemeConfig;
    forcedScheme: 'dark' | 'light' | null;
    activeTab: TabInfo;
    uiHighlights: string[];
};

export type DevToolsData = {
    dynamicFixesText: string;
    filterFixesText: string;
    staticThemesText: string;
};

export type TabData = {
    type: MessageTypeBGtoCS.ADD_CSS_FILTER;
    data: {
        css: string;
        detectDarkTheme: boolean;
    };
} | {
    type: MessageTypeBGtoCS.ADD_SVG_FILTER;
    data: {
        css: string;
        svgMatrix: string;
        svgReverseMatrix: string;
        detectDarkTheme: boolean;
    };
} | {
    type: MessageTypeBGtoCS.ADD_STATIC_THEME;
    data: {
        css: string;
        detectDarkTheme: boolean;
    };
} | {
    type: MessageTypeBGtoCS.ADD_DYNAMIC_THEME;
    data: {
        theme: Theme;
        fixes: DynamicThemeFix[] | null;
        isIFrame: boolean;
        detectDarkTheme: boolean;
    };
} | {
    type: MessageTypeBGtoCS.CLEAN_UP;
};

export interface ExtensionActions {
    changeSettings(settings: Partial<UserSettings>): void;
    setTheme(theme: Partial<FilterConfig>): void;
    setShortcut(command: string, shortcut: string): Promise<string | null>;
    toggleActiveTab(): void;
    markNewsAsRead(ids: string[]): void;
    markNewsAsDisplayed(ids: string[]): void;
    loadConfig(options: {local: boolean}): void;
    applyDevDynamicThemeFixes(text: string): Promise<void>;
    resetDevDynamicThemeFixes(): void;
    applyDevInversionFixes(text: string): Promise<void>;
    resetDevInversionFixes(): void;
    applyDevStaticThemes(text: string): Promise<void>;
    resetDevStaticThemes(): void;
    hideHighlights(ids: string[]): void;
}

export type ExtWrapper = {
    data: ExtensionData;
    actions: ExtensionActions;
};

export type Theme = {
    mode: FilterMode;
    brightness: number;
    contrast: number;
    grayscale: number;
    sepia: number;
    useFont: boolean;
    fontFamily: string;
    textStroke: number;
    engine: ThemeEngine;
    stylesheet: string;
    darkSchemeBackgroundColor: string;
    darkSchemeTextColor: string;
    lightSchemeBackgroundColor: string;
    lightSchemeTextColor: string;
    scrollbarColor: '' | 'auto' | string;
    selectionColor: '' | 'auto' | string;
    styleSystemControls: boolean;
    lightColorScheme: string;
    darkColorScheme: string;
    immediateModify: boolean;
};

export type FilterConfig = Theme;

export type CustomSiteConfig = {
    url: string[];
    theme: FilterConfig;
};

export type ThemePreset = {
    id: string;
    name: string;
    urls: string[];
    theme: Theme;
};

export type Automation = {
    enabled: boolean;
    mode: AutomationMode;
    behavior: 'OnOff' | 'Scheme';
};

export type UserSettings = {
    enabled: boolean;
    fetchNews: boolean;
    theme: FilterConfig;
    presets: ThemePreset[];
    customThemes: CustomSiteConfig[];
    siteList: string[];
    siteListEnabled: string[];
    applyToListedOnly: boolean;
    changeBrowserTheme: boolean;
    syncSettings: boolean;
    syncSitesFixes: boolean;
    automation: Automation;
    time: TimeSettings;
    location: LocationSettings;
    previewNewDesign: boolean;
    enableForPDF: boolean;
    enableForProtectedPages: boolean;
    enableContextMenus: boolean;
    detectDarkTheme: boolean;
};

export type TimeSettings = {
    activation: string;
    deactivation: string;
};

export type LocationSettings = {
    latitude: number | null;
    longitude: number | null;
};

export type TabInfo = {
    url: string;
    id: tabId | null;
    documentId: documentId | null;
    isProtected: boolean;
    isInjected: boolean | null;
    isInDarkList: boolean;
    isDarkThemeDetected: boolean | null;
};

export type MessageCStoBG = {
    type: MessageTypeCStoBG.COLOR_SCHEME_CHANGE;
    data: {
        isDark: boolean;
    };
} | {
    type: MessageTypeCStoBG.DARK_THEME_DETECTED;
} | {
    type: MessageTypeCStoBG.DARK_THEME_NOT_DETECTED;
} | {
    type: MessageTypeCStoBG.FETCH;
    id: string;
    data: {
        url: string;
        responseType: 'data-url' | 'text';
        mimeType?: string;
        origin?: string;
    };
} | {
    type: MessageTypeCStoBG.FRAME_CONNECT;
    data: {
        isDark: boolean;
    };
} | {
    type: MessageTypeCStoBG.FRAME_FORGET;
} | {
    type: MessageTypeCStoBG.FRAME_FREEZE;
} | {
    type: MessageTypeCStoBG.FRAME_RESUME;
    data: {
        isDark: boolean;
    };
};

export type MessageUItoCS = {
    type: MessageTypeUItoCS.EXPORT_CSS;
};

export type MessageCStoUI = {
    type: MessageTypeCStoUI.EXPORT_CSS_RESPONSE;
    data: string;
};

export type MessageBGtoCS = {
    id?: undefined;
    type: MessageTypeBGtoCS.ADD_CSS_FILTER;
    data: {
        css: string;
        detectDarkTheme: boolean;
    };
    error?: undefined;
} | {
    id?: undefined;
    type: MessageTypeBGtoCS.ADD_DYNAMIC_THEME;
    data: {
        theme: Theme;
        fixes: DynamicThemeFix[] | null;
        isIFrame: boolean;
        detectDarkTheme: boolean;
    };
    error?: undefined;
} | {
    id?: undefined;
    type: MessageTypeBGtoCS.ADD_STATIC_THEME;
    data: {
        css: string;
        detectDarkTheme: boolean;
    };
    error?: undefined;
} | {
    id?: undefined;
    type: MessageTypeBGtoCS.ADD_SVG_FILTER;
    data: {
        css: string;
        svgMatrix: string;
        svgReverseMatrix: string;
        detectDarkTheme: boolean;
    };
    error?: undefined;
} | {
    id?: undefined;
    type: MessageTypeBGtoCS.CLEAN_UP;
    data?: undefined;
    error?: undefined;
} | {
    id: string;
    type: MessageTypeBGtoCS.FETCH_RESPONSE;
    data: any;
    error?: any;
} | {
    id?: undefined;
    type: MessageTypeBGtoCS.UNSUPPORTED_SENDER;
    data?: undefined;
    error?: undefined;
};

export type MessageUItoBG = {
    type: MessageTypeUItoBG.APPLY_DEV_DYNAMIC_THEME_FIXES;
    data: string;
    error?: undefined;
} | {
    type: MessageTypeUItoBG.APPLY_DEV_INVERSION_FIXES;
    data: string;
    error?: undefined;
} | {
    type: MessageTypeUItoBG.APPLY_DEV_STATIC_THEMES;
    data: string;
    error?: undefined;
} | {
    type: MessageTypeUItoBG.CHANGE_SETTINGS;
    data: Partial<UserSettings>;
    error?: undefined;
} | {
    type: MessageTypeUItoBG.COLOR_SCHEME_CHANGE;
    data: {
        isDark: boolean;
    };
    error?: undefined;
} | {
    type: MessageTypeUItoBG.GET_DATA;
    data?: undefined;
    error?: undefined;
} | {
    type: MessageTypeUItoBG.GET_DEVTOOLS_DATA;
    data?: undefined;
    error?: undefined;
} | {
    type: MessageTypeUItoBG.HIDE_HIGHLIGHTS;
    data: string[];
    error?: undefined;
} | {
    type: MessageTypeUItoBG.LOAD_CONFIG;
    data: {
        local: boolean;
    };
    error?: undefined;
} | {
    type: MessageTypeUItoBG.MARK_NEWS_AS_DISPLAYED;
    data: string[];
    error?: undefined;
} | {
    type: MessageTypeUItoBG.MARK_NEWS_AS_READ;
    data: string[];
    error?: undefined;
} | {
    type: MessageTypeUItoBG.RESET_DEV_DYNAMIC_THEME_FIXES;
    data?: undefined;
    error?: undefined;
} | {
    type: MessageTypeUItoBG.RESET_DEV_INVERSION_FIXES;
    data?: undefined;
    error?: undefined;
} | {
    type: MessageTypeUItoBG.RESET_DEV_STATIC_THEMES;
    data?: undefined;
    error?: undefined;
} | {
    type: MessageTypeUItoBG.SAVE_FILE;
    data: {
        name: string;
        content: string;
    };
    error?: undefined;
} | {
    type: MessageTypeUItoBG.SET_THEME;
    data: Partial<Theme>;
    error?: undefined;
} | {
    type: MessageTypeUItoBG.SUBSCRIBE_TO_CHANGES;
    data?: undefined;
    error?: undefined;
} | {
    type: MessageTypeUItoBG.TOGGLE_ACTIVE_TAB;
    data?: undefined;
    error?: undefined;
} | {
    type: MessageTypeUItoBG.UNSUBSCRIBE_FROM_CHANGES;
    data?: undefined;
    error?: undefined;
};

export type MessageBGtoUI = {
    type: MessageTypeBGtoUI.CHANGES;
    data: ExtensionData;
};

export type DebugMessageBGtoCS = {
    type: DebugMessageTypeBGtoCS.CSS_UPDATE;
} | {
    type: DebugMessageTypeBGtoCS.RELOAD;
};

export type DebugMessageBGtoUI = {
    type: DebugMessageTypeBGtoUI.UPDATE;
};

export type DebugMessageCStoBG = {
    type: DebugMessageTypeCStoBG.LOG;
    data: {
        level: LogLevel;
        log: any[];
    };
};

export type Shortcuts = {
    [name: string]: string;
};

export type DynamicThemeFix = {
    url: string[];
    invert: string[];
    css: string;
    ignoreInlineStyle: string[];
    ignoreImageAnalysis: string[];
    disableStyleSheetsProxy: boolean;
    disableCustomElementRegistryProxy: boolean;
};

export type InversionFix = {
    url: string[];
    invert: string[];
    noinvert: string[];
    removebg: string[];
    css: string;
};

export type StaticTheme = {
    url: string[];
    neutralBg?: string[];
    neutralBgActive?: string[];
    neutralText?: string[];
    neutralTextActive?: string[];
    neutralBorder?: string[];
    redBg?: string[];
    redBgActive?: string[];
    redText?: string[];
    redTextActive?: string[];
    redBorder?: string[];
    greenBg?: string[];
    greenBgActive?: string[];
    greenText?: string[];
    greenTextActive?: string[];
    greenBorder?: string[];
    blueBg?: string[];
    blueBgActive?: string[];
    blueText?: string[];
    blueTextActive?: string[];
    blueBorder?: string[];
    fadeBg?: string[];
    fadeText?: string[];
    transparentBg?: string[];
    noImage?: string[];
    invert?: string[];
    noCommon?: boolean;
};

export type News = {
    id: string;
    date: string;
    url: string;
    headline: string;
    read?: boolean;
    displayed?: boolean;
    badge?: string;
    icon?: string;
};

// These values need to match those in Manifest
export type Command = 'toggle' | 'addSite' | 'switchEngine';
