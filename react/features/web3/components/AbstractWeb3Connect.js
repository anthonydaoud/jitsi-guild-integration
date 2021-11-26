import { Component } from 'react';
import { ethers } from 'ethers';

import { setWalletState, setWalletAddress, storeGuildRequirement } from '../actions';
import { WALLET_API_STATES, MESSAGE_SIGN_TEXT } from '../constants';

/**
 * Implements some useful web3 connection functions
 */
export default class AbstractWeb3Connect extends Component {

    constructor(props) {
        super(props);

        // Bind event handlers so they are only bound once per instance.
        this._handleChainChanged = this._handleChainChanged.bind(this);
        this._handleAccountsChanged = this._handleAccountsChanged.bind(this);
        this._onClickConnectToMetamask = this._onClickConnectToMetamask.bind(this);
        this._loadMetamask = this._loadMetamask.bind(this);
    }
    
    /**
     * Handle chain (network) and chainChanged (per EIP-1193) 
     */
    _handleChainChanged() {
        // Will reload the page
        window.location.reload();
    }

    /**
     * Handles wallet account change
     * 
     * @param {array} accounts 
     * @param {boolean} isLobby 
     */
    _handleAccountsChanged(accounts, isLobby) {
        if (!isLobby) {
            this.props.dispatch(storeGuildRequirement(null))
        }
        if (accounts.length === 0) {
            if (this.props._walletAddress) {
                //Account was not null, must have logged out
                this.props.dispatch(setWalletAddress(null));
            }
            this.props.dispatch(setWalletState(WALLET_API_STATES.NEEDS_CONNECTING));
        } else if (accounts[0] !== this.props._walletAddress) {
            this.props.dispatch(setWalletAddress(accounts[0]));
            this.props.dispatch(setWalletState(WALLET_API_STATES.SIGNED_IN));
        }
    }

    /**
     * Handles connnecting to MetaMask
     */
    _onClickConnectToMetamask() {
        ethereum
            .request({ method: 'eth_requestAccounts' })
            .then((accs) => {
                this._handleAccountsChanged(accs);
            })
            .catch((err) => {
            if (err.code === 4001) {
                // EIP-1193 userRejectedRequest error
                // If this happens, the user rejected the connection request.
                console.log('Please connect to MetaMask.');
            } else {
                console.error(err);
            }
        });
    }

    /**
     * Loads MetaMask on initial mount
     */
    async _loadMetamask() {
        if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
            ethereum
                .request({ method: 'eth_accounts' })
                .then((accounts) => {
                    this._handleAccountsChanged(accounts)
                })
                .catch((err) => {
                // Some unexpected error.
                // For backwards compatibility reasons, if no accounts are available,
                // eth_accounts will return an empty array.
                console.error(err);
                });
            ethereum.on('chainChanged', this._handleChainChanged);
            ethereum.on('accountsChanged', (accounts) => { 
                this._handleAccountsChanged(accounts);
            });
        }
    }

    /**
     * Signs a message and returns the message, signature,
     * and address
     * 
     * @param {string} message 
     * @param {string} customMessage 
     * @returns object
     */
    async _signMessage(message, customMessage = null) {
        try {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            let signature;
            if (customMessage) {
                signature = await signer.signMessage(customMessage);
            } else {
                signature = await signer.signMessage(MESSAGE_SIGN_TEXT+message);
            }
            const address = await signer.getAddress();

            return {
                message,
                signature,
                address
            }
        } catch (err) {
            if (err.code === 4001) {
                console.log("Please sign the message to enter");
            } else {
                console.log(err)
            }
        }
    }
}