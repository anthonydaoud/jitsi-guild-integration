// @flow

import { type Dispatch } from 'redux';

import {
    conferenceWillJoin,
    getCurrentConference,
    sendLocalParticipant,
    setPassword
} from '../base/conference';
import { getLocalParticipant } from '../base/participants';

import {
    KNOCKING_PARTICIPANT_ARRIVED_OR_UPDATED,
    KNOCKING_PARTICIPANT_LEFT,
    SET_KNOCKING_STATE,
    SET_LOBBY_MODE_ENABLED,
    SET_PASSWORD_JOIN_FAILED,
    SET_LOBBY_VISIBILITY
} from './actionTypes';

/**
 * Tries to join with a preset password.
 *
 * @param {string} password - The password to join with.
 * @returns {Function}
 */
export function joinWithPassword(password: string) {
    return async (dispatch: Dispatch<any>, getState: Function) => {
        const conference = getCurrentConference(getState);

        dispatch(setPassword(conference, conference.join, password));
    };
}

/**
 * Action to be dispatched when a knocking poarticipant leaves before any response.
 *
 * @param {string} id - The ID of the participant.
 * @returns {{
 *     id: string,
 *     type: KNOCKING_PARTICIPANT_LEFT
 * }}
 */
export function knockingParticipantLeft(id: string) {
    return {
        id,
        type: KNOCKING_PARTICIPANT_LEFT
    };
}

/**
 * Action to be executed when a participant starts knocking or an already knocking participant gets updated.
 *
 * @param {Object} participant - The knocking participant.
 * @returns {{
 *     participant: Object,
 *     type: KNOCKING_PARTICIPANT_ARRIVED_OR_UPDATED
 * }}
 */
export function participantIsKnockingOrUpdated(participant: Object) {
    return {
        participant,
        type: KNOCKING_PARTICIPANT_ARRIVED_OR_UPDATED
    };
}

/**
 * Approves (lets in) or rejects a knocking participant.
 *
 * @param {string} id - The id of the knocking participant.
 * @param {boolean} approved - True if the participant is approved, false otherwise.
 * @returns {Function}
 */
export function setKnockingParticipantApproval(id: string, approved: boolean) {
    return async (dispatch: Dispatch<any>, getState: Function) => {
        const conference = getCurrentConference(getState);

        if (conference) {
            if (approved) {
                conference.lobbyApproveAccess(id);
            } else {
                conference.lobbyDenyAccess(id);
            }
        }
    };
}

/**
 * Action used to admit multiple participants in the conference.
 *
 * @param {Array<Object>} participants - A list of knocking participants.
 * @returns {void}
 */
export function admitMultiple(participants: Array<Object>) {
    return (dispatch: Function, getState: Function) => {
        const conference = getCurrentConference(getState);

        participants.forEach(p => {
            conference.lobbyApproveAccess(p.id);
        });
    };
}

/**
 * Approves the request of a knocking participant to join the meeting.
 *
 * @param {string} id - The id of the knocking participant.
 * @returns {Function}
 */
export function approveKnockingParticipant(id: string) {
    return (dispatch: Dispatch<any>, getState: Function) => {
        const conference = getCurrentConference(getState);

        conference && conference.lobbyApproveAccess(id);
    };
}

/**
 * Denies the request of a knocking participant to join the meeting.
 *
 * @param {string} id - The id of the knocking participant.
 * @returns {Function}
 */
export function rejectKnockingParticipant(id: string) {
    return (dispatch: Dispatch<any>, getState: Function) => {
        const conference = getCurrentConference(getState);

        conference && conference.lobbyDenyAccess(id);
    };
}

/**
 * Action to set the knocking state of the participant.
 *
 * @param {boolean} knocking - The new state.
 * @returns {{
 *     state: boolean,
 *     type: SET_KNOCKING_STATE
 * }}
 */
export function setKnockingState(knocking: boolean) {
    return {
        knocking,
        type: SET_KNOCKING_STATE
    };
}

/**
 * Action to set the new state of the lobby mode.
 *
 * @param {boolean} enabled - The new state to set.
 * @returns {{
 *     enabled: boolean,
 *     type: SET_LOBBY_MODE_ENABLED
 * }}
 */
export function setLobbyModeEnabled(enabled: boolean) {
    return {
        enabled,
        type: SET_LOBBY_MODE_ENABLED
    };
}

/**
 * Action to be dispatched when we failed to join with a password.
 *
 * @param {boolean} failed - True of recent password join failed.
 * @returns {{
 *     failed: boolean,
 *     type: SET_PASSWORD_JOIN_FAILED
 * }}
 */
export function setPasswordJoinFailed(failed: boolean) {
    return {
        failed,
        type: SET_PASSWORD_JOIN_FAILED
    };
}

/**
 * Starts knocking and waiting for approval.
 *
 * @returns {Function}
 */
export function startKnocking() {
    return async (dispatch: Dispatch<any>, getState: Function) => {
        const state = getState();
        const { membersOnly } = state['features/base/conference'];
        const localParticipant = getLocalParticipant(state);

        dispatch(conferenceWillJoin(membersOnly));

        // We need to update the conference object with the current display name, if approved
        // we want to send that display name, it was not updated in case when pre-join is disabled
        sendLocalParticipant(state, membersOnly);

        membersOnly.joinLobby(localParticipant.name, localParticipant.email);
        dispatch(setKnockingState(true));
    };
}

/**
 * Knocking procedure for conferences with guild requirement
 *
 * @returns {Function}
 */
 export function startGuildKnocking(signed) {
    const { signature, address } = signed;
    return async (dispatch: Dispatch<any>, getState: Function) => {
        const state = getState();
        const { membersOnly } = state['features/base/conference'];
        const localParticipant = getLocalParticipant(state);
        dispatch(conferenceWillJoin(membersOnly));

        // We need to update the conference object with the current display name, if approved
        // we want to send that display name, it was not updated in case when pre-join is disabled
        sendLocalParticipant(state, membersOnly);

        await Promise.all([
                APP.connection.addFeature("Signature:"+signature, true),
                APP.connection.addFeature("Address:"+address, true)
        ]);

        //Will either join or fail after this, depending on if you are actually a member of the guild
        membersOnly.joinLobby(localParticipant.name, localParticipant.email)
    };
}

/**
 * Action to toggle lobby mode on or off.
 *
 * @param {boolean} enabled - The desired (new) state of the lobby mode.
 * @returns {Function}
 */
export function toggleLobbyMode(enabled: boolean) {
    return async (dispatch: Dispatch<any>, getState: Function) => {
        const conference = getCurrentConference(getState);

        if (enabled) {
            conference.enableLobby();
        } else {
            conference.disableLobby();
        }
    };
}

/**
 * Action to open the lobby screen.
 *
 * @returns {openDialog}
 */
export function openLobbyScreen() {
    return {
        type: SET_LOBBY_VISIBILITY,
        visible: true
    };
}

/**
 * Action to hide the lobby screen.
 *
 * @returns {hideDialog}
 */
export function hideLobbyScreen() {
    return {
        type: SET_LOBBY_VISIBILITY,
        visible: false
    };
}
