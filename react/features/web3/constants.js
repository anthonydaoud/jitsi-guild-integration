export const WALLET_API_STATES = {
    /**
     * The state in which the Wallet API still needs to be loaded.
     */
    NEEDS_LOADING: 0,

    /**
     * The state in which the Wallet API is loaded and ready for use.
     */
    LOADED: 1,

    /**
     * The state in which a user has been logged in through the Wallet API.
     */
    SIGNED_IN: 2,
};