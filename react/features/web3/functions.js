import { ethers } from 'ethers';

import { setChallenge } from './actions';
import { CHALLENGE_STR_LENGTH, MESSAGE_SIGN_TEXT, VALIDATE_GUILD_URL } from './constants';

/**
 * Generates the challenge to be signed and verified
 * 
 * @returns string
 */
export function generateChallenge() {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( var i = 0; i < CHALLENGE_STR_LENGTH; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    APP.store.dispatch(setChallenge(result));
    return result;
}

/**
 * Checks if the signature comes from the address
 * 
 * @param {string} address 
 * @param {string} signature 
 * @param {string} challenge 
 * @param {string} customMessage 
 * @returns boolean
 */
export async function signatureIsValid(address, signature, challenge, customMessage = null) {
    if (!address || !signature) {
        return false;
    }
    let message;
    if (customMessage) {
        message = customMessage;
    } else {
        message = MESSAGE_SIGN_TEXT+challenge;
    }
    let signerAddr;
    try {
        signerAddr = await ethers.utils.verifyMessage(message, signature);
        if (signerAddr !== address) {
            return false;
        }
        return true
    } catch (err) {
        console.log(err);
        return false;
    }
}

/**
 * Checks if the wallet has access to the guild
 * 
 * @param {object} guildRequirement 
 * @param {string} walletAddress 
 * @returns 
 */
export async function hasGuildAccess(guildRequirement, walletAddress) {
    try {
        const resp = await fetch(VALIDATE_GUILD_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'alpha:6QwMyTrbjyBDvCZ4ReNVkuzxh3dRCHs9'
            }, 
            body: JSON.stringify({
                "url": guildRequirement.urlName,
                //NOTE, they (guild.xyz) has a bug. They won't accept capital letters for some reason
                "accounts": [walletAddress.toLowerCase()]
            })
        })
        if (resp.status === 200) {
            const json = await resp.json();
            if (json[0].hasAccess) {
                return true;
            } else {
                return false;
            }
        } else {
            return false
        }
    } catch (e) {
        console.error(e)
        return false
    }
}