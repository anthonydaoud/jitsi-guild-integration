export const WALLET_API_STATES = {
    /**
     * The state in which the Metamask needs to be downloaded
     */
    INSTALL_METAMASK: 0,

    /**
     * The state in which the Wallet still needs to be connected.
     */
    NEEDS_CONNECTING: 1,

    /**
     * The state in which a user has been logged in through the Wallet API.
     */
    SIGNED_IN: 2,
};

export const WALLET_VIEW_ID = 'WALLET_VIEW_ID';
