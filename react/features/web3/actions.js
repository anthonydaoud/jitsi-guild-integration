import { openDialog } from '../base/dialog';
import {
    SET_WALLET_STATE,
    SET_WALLET_ADDRESS,
    SET_ALL_GUILDS,
    SET_CHALLENGE,
    STORE_GUILD_REQUIREMENT
} from './actionTypes';


export function openWalletDialog(Dialog) {
    return openDialog(Dialog);
}

export function setAllGuilds(allGuilds: array) {
    return {
        type: SET_ALL_GUILDS,
        allGuilds
    }
}

export function setChallenge(challenge: string) {
    return {
        type: SET_CHALLENGE,
        challenge
    }
}

export function setWalletAddress(walletAddress: string | null) {
    return {
        type: SET_WALLET_ADDRESS,
        walletAddress
    };
}

export function setWalletState(walletState: number) {
    return {
        type: SET_WALLET_STATE,
        walletState
    };
}

export function storeGuildRequirement(guildRequirement: object | null) {
    return {
        type: STORE_GUILD_REQUIREMENT,
        guildRequirement
    }
}
