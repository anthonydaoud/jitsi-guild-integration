// @flow

import { CONFERENCE_JOINED, CONFERENCE_LEFT, SET_PASSWORD } from '../base/conference';
import { ReducerRegistry } from '../base/redux';
import { signatureIsValid, hasGuildAccess } from '../web3/functions';

import {
    KNOCKING_PARTICIPANT_ARRIVED_OR_UPDATED,
    KNOCKING_PARTICIPANT_LEFT,
    SET_KNOCKING_STATE,
    SET_LOBBY_MODE_ENABLED,
    SET_LOBBY_VISIBILITY,
    SET_PASSWORD_JOIN_FAILED
} from './actionTypes';

const DEFAULT_STATE = {
    knocking: false,
    knockingParticipants: [],
    lobbyEnabled: false,
    lobbyVisible: false,
    passwordJoinFailed: false
};

/**
 * Reduces redux actions which affect the display of notifications.
 *
 * @param {Object} state - The current redux state.
 * @param {Object} action - The redux action to reduce.
 * @returns {Object} The next redux state which is the result of reducing the
 * specified {@code action}.
 */
ReducerRegistry.register('features/lobby', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
    case CONFERENCE_JOINED:
    case CONFERENCE_LEFT:
        return {
            ...state,
            knocking: false,
            passwordJoinFailed: false
        };
    case KNOCKING_PARTICIPANT_ARRIVED_OR_UPDATED:
        return _knockingParticipantArrivedOrUpdated(action.participant, state);
    case KNOCKING_PARTICIPANT_LEFT:
        return {
            ...state,
            knockingParticipants: state.knockingParticipants.filter(p => p.id !== action.id)
        };
    case SET_KNOCKING_STATE:
        return {
            ...state,
            knocking: action.knocking,
            passwordJoinFailed: false
        };
    case SET_LOBBY_MODE_ENABLED:
        return {
            ...state,
            lobbyEnabled: action.enabled
        };
    case SET_LOBBY_VISIBILITY:
        return {
            ...state,
            lobbyVisible: action.visible
        };
    case SET_PASSWORD:
        return {
            ...state,
            passwordJoinFailed: false
        };
    case SET_PASSWORD_JOIN_FAILED:
        return {
            ...state,
            passwordJoinFailed: action.failed
        };
    }

    return state;
});

/**
 * Checks that the participant has the required features and is a
 * member of the guild. Will automatically accept or reject the
 * participant.
 * 
 * @param {Object} participant - The arrived knocking participant.
 * @param {Object} state - The current Redux state of the feature.
 * @returns {Object}
 */
function _handleGuildKnocking(participant, state) {
    //Get the features the participant has added in the room
    const roomNames = Object.keys(APP.connection.xmpp.connection.emuc.rooms);
    const participRoom = roomNames.find(el => el.includes(APP.conference.roomName) && el.includes('lobby'));
    const participRoomMembers = APP.connection.xmpp.connection.emuc.rooms[participRoom].members
    const participRoomKey = Object.keys(participRoomMembers).find(el => el.includes(participant.id))
    //If they haven't setup the features yet, reject them
    if (!participRoomMembers[participRoomKey].features) {
        participant.conference.lobbyDenyAccess(participant.id);
        return state;
    }
    //All valid users will have a Address and Signature feature
    let address;
    let signature;
    for (const feat of participRoomMembers[participRoomKey].features) {
        if (feat.includes("Address:")) {
            address = feat.split(':')[1];
        }
        if (feat.includes("Signature:")) {
            signature = feat.split(':')[1];
        }
    }
    //check valid signature, and is member of guild
    (async () => {
        if (await signatureIsValid(address, signature, participant.challenge) &&
            await hasGuildAccess(participant.guildRequirement, address)) {
            participant.conference.lobbyApproveAccess(participant.id);
        } else {
            participant.conference.lobbyDenyAccess(participant.id);
        }
    })();
    return state;
}

/**
 * Stores or updates a knocking participant.
 *
 * @param {Object} participant - The arrived or updated knocking participant.
 * @param {Object} state - The current Redux state of the feature.
 * @returns {Object}
 */
function _knockingParticipantArrivedOrUpdated(participant, state) {
    if (participant.guildRequirement) {
        return _handleGuildKnocking(participant, state);
    }

    let existingParticipant = state.knockingParticipants.find(p => p.id === participant.id);

    existingParticipant = {
        ...existingParticipant,
        ...participant
    };

    return {
        ...state,
        knockingParticipants: [
            ...state.knockingParticipants.filter(p => p.id !== participant.id),
            existingParticipant
        ]
    };
}
