// @flow

import { ReducerRegistry } from '../base/redux';

import {
    SET_WALLET_STATE,
} from './actionTypes';
import { WALLET_API_STATES } from './constants';


const DEFAULT_STATE = {
    walletState: WALLET_API_STATES.NEEDS_CONNECTING,
};

/**
 * Reduces redux actions for the purposes of the feature {@code welcome}.
 */
ReducerRegistry.register('features/web3', 
    (state = DEFAULT_STATE, action) => {
        switch (action.type) {
        case SET_WALLET_STATE:
            return {
                ...state,
                walletState: action.walletState
            };
        }

    return state;
    });
