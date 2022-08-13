export default class TokenManager {
    private static tabTokens: {[tabId: number]: string};

    private static getStorageKey(tabId: number) {
        return `token-${tabId}`;
    }

    private static generateToken() {
        return Math.floor(Number.MAX_SAFE_INTEGER * Math.random()).toString(36).substring(1)
        + Math.floor(Number.MAX_SAFE_INTEGER * Math.random()).toString(36).substring(1);
    }

    static async createPickerToken(tabId: number) {
        if (!TokenManager.tabTokens) {
            TokenManager.tabTokens = {};
        }
        const token = TokenManager.generateToken();
        TokenManager.tabTokens[tabId] = token;
        chrome.storage.local.set({[TokenManager.getStorageKey(tabId)]: token});
    }

    static async validatePickerToken(tabId: number, token: string) {
        // Common case: the background persisted between calls to createPickerToken() and validatePickerToken()
        const cachedToken = TokenManager.tabTokens && TokenManager.tabTokens[tabId];
        if (cachedToken && cachedToken === token) {
            return true;
        }

        // Rare case: the background was unloaded between calls to createPickerToken() and validatePickerToken()
        return new Promise((resolve) => {
            const key = TokenManager.getStorageKey(tabId);
            chrome.storage.local.get(key, (data) => {
                const cachedToken = data[key];
                if (!TokenManager.tabTokens) {
                    TokenManager.tabTokens = {};
                }
                TokenManager.tabTokens[tabId] = cachedToken;
                resolve(cachedToken && cachedToken === token);
            });
        });
    }

    static async invalidatePickerToken(tabId: number) {
        if (TokenManager.tabTokens) {
            TokenManager.tabTokens[tabId] = undefined;
        }
        chrome.storage.local.remove(TokenManager.getStorageKey(tabId));
    }
}
