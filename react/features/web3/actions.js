// @flow
import { openDialog } from '../base/dialog';



import {
    SET_WALLET_STATE,
} from './actionTypes';
import WalletDialog from './components/WalletDialog';

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

export function openWalletDialog() {
    return openDialog(WalletDialog);
}

