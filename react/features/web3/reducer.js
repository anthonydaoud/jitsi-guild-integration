import { PersistenceRegistry, ReducerRegistry, set } from '../base/redux';

import {
    SET_WALLET_STATE,
    SET_WALLET_ADDRESS,
    SET_ALL_GUILDS,
    SET_CHALLENGE,
    STORE_GUILD_REQUIREMENT
} from './actionTypes';
import { WALLET_API_STATES } from './constants';


const DEFAULT_STATE = {
    allGuilds: null,
    challenge: null,
    guildRequirement: null,
    walletAddress: null,
    walletState: WALLET_API_STATES.INSTALL_METAMASK
};

const STORE_NAME = 'features/web3';

/**
 * Sets up the persistence of each feature.
 */
const filterSubtree = {};

// start with the default state
Object.keys(DEFAULT_STATE).forEach(key => {
    filterSubtree[key] = true;
});

PersistenceRegistry.register(STORE_NAME, filterSubtree, DEFAULT_STATE);

/**
 * Reduces redux actions for the purposes of the feature {@code welcome}.
 */
ReducerRegistry.register(STORE_NAME, 
    (state = DEFAULT_STATE, action) => {
        switch (action.type) {
        case SET_WALLET_STATE:
            return {
                ...state,
                walletState: action.walletState
            };
        case SET_WALLET_ADDRESS:
            return {
                ...state,
                walletAddress: action.walletAddress
            }
        case SET_ALL_GUILDS:
            return {
                ...state,
                allGuilds: action.allGuilds
            }
        case SET_CHALLENGE:
            return {
                ...state,
                challenge: action.challenge
            }
        case STORE_GUILD_REQUIREMENT:
            return {
                ...state,
                guildRequirement: action.guildRequirement
            }
        }
    return state;
    });
