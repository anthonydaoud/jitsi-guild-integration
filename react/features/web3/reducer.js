// @flow

import { PersistenceRegistry, ReducerRegistry, set } from '../base/redux';

import {
    SET_WALLET_STATE,
    SET_WALLET_ADDRESS,
    STORE_GUILD_REQUIREMENT
} from './actionTypes';
import { WALLET_API_STATES } from './constants';


const DEFAULT_STATE = {
    walletState: WALLET_API_STATES.INSTALL_METAMASK,
    walletAddress: null,
    guildRequirement: null,
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
        case STORE_GUILD_REQUIREMENT:
            return {
                ...state,
                guildRequirement: action.guildRequirement
            }
        }

    return state;
    });
