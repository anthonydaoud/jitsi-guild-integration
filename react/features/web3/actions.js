// @flow

import type { Dispatch } from 'redux';

import {
    SET_WALLET_STATE,
} from './actionTypes';

/**
 * Sets the current Wallet state.
 *
 * @param {number} walletState - The state to be set.
 * @returns {{
 *     type: SET_WALLET_STATE,
 *     walletState: number
 * }}
 */
export function setWalletState(walletState: number) {
    return {
        type: SET_WALLET_STATE,
        walletState
    };
}

