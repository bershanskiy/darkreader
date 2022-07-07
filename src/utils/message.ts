export enum MessageType {
    UI_GET_DATA = 'ui-get-data',
    UI_SUBSCRIBE_TO_CHANGES = 'ui-subscribe-to-changes',
    UI_UNSUBSCRIBE_FROM_CHANGES = 'ui-unsubscribe-from-changes',
    UI_CHANGE_SETTINGS = 'ui-change-settings',
    UI_SET_THEME = 'ui-set-theme',
    UI_SET_SHORTCUT = 'ui-set-shortcut',
    UI_TOGGLE_ACTIVE_TAB = 'ui-toggle-active-tab',
    UI_MARK_NEWS_AS_READ = 'ui-mark-news-as-read',
    UI_MARK_NEWS_AS_DISPLAYED = 'ui-mark-news-as-displayed',
    UI_LOAD_CONFIG = 'ui-load-config',
    UI_APPLY_DEV_DYNAMIC_THEME_FIXES = 'ui-apply-dev-dynamic-theme-fixes',
    UI_RESET_DEV_DYNAMIC_THEME_FIXES = 'ui-reset-dev-dynamic-theme-fixes',
    UI_APPLY_DEV_INVERSION_FIXES = 'ui-apply-dev-inversion-fixes',
    UI_RESET_DEV_INVERSION_FIXES = 'ui-reset-dev-inversion-fixes',
    UI_APPLY_DEV_STATIC_THEMES = 'ui-apply-dev-static-themes',
    UI_RESET_DEV_STATIC_THEMES = 'ui-reset-dev-static-themes',
    UI_SAVE_FILE = 'ui-save-file',
    UI_REQUEST_EXPORT_CSS = 'ui-request-export-css',
    UI_COLOR_SCHEME_CHANGE = 'ui-color-scheme-change',

    BG_CHANGES = 'bg-changes',
    BG_ADD_CSS_FILTER = 'bg-add-css-filter',
    BG_ADD_STATIC_THEME = 'bg-add-static-theme',
    BG_ADD_SVG_FILTER = 'bg-add-svg-filter',
    BG_ADD_DYNAMIC_THEME = 'bg-add-dynamic-theme',
    BG_EXPORT_CSS = 'bg-export-css',
    BG_UNSUPPORTED_SENDER = 'bg-unsupported-sender',
    BG_CLEAN_UP = 'bg-clean-up',
    BG_RELOAD = 'bg-reload',
    BG_FETCH_RESPONSE = 'bg-fetch-response',
    BG_UI_UPDATE = 'bg-ui-update',
    BG_CSS_UPDATE = 'bg-css-update',

    CS_COLOR_SCHEME_CHANGE = 'cs-color-scheme-change',
    CS_FRAME_CONNECT = 'cs-frame-connect',
    CS_FRAME_FORGET = 'cs-frame-forget',
    CS_FRAME_FREEZE = 'cs-frame-freeze',
    CS_FRAME_RESUME = 'cs-frame-resume',
    CS_EXPORT_CSS_RESPONSE = 'cs-export-css-response',
    CS_FETCH = 'cs-fetch',
    CS_DARK_THEME_DETECTED = 'cs-dark-theme-detected',
    CS_DARK_THEME_NOT_DETECTED = 'cs-dark-theme-not-detected',
}
