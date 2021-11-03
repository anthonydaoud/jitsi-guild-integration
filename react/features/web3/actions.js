import { openDialog } from '../base/dialog';
import {
    SET_WALLET_STATE,
    SET_WALLET_ADDRESS,
    STORE_GUILD_REQUIREMENT
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

export function setWalletAddress(walletAddress: string | null) {
    return {
        type: SET_WALLET_ADDRESS,
        walletAddress
    };
}

export function openWalletDialog() {
    return openDialog(WalletDialog);
}

export function storeGuildRequirement(guildRequirement: string | null) {
    return {
        type: STORE_GUILD_REQUIREMENT,
        guildRequirement
    }
}


