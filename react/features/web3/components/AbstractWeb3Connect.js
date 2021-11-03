import { Component } from 'react';
import { WALLET_API_STATES } from '../constants';
import { setWalletState, setWalletAddress } from '../actions';


export class AbstractWeb3Connect extends Component {

    constructor(props) {
        super(props);

        // Bind event handlers so they are only bound once per instance.
        this._handleChainChanged = this._handleChainChanged.bind(this);
        this._handleAccountsChanged = this._handleAccountsChanged.bind(this);
        this._onClickConnectToMetamask = this._onClickConnectToMetamask.bind(this);
    }
    
    /**
     * Handle chain (network) and chainChanged (per EIP-1193) 
     */
    _handleChainChanged() {
        // Will reload the page
        window.location.reload();
    }

    // For now, 'eth_accounts' will continue to always return an array
    _handleAccountsChanged(accounts) {
        if (accounts.length === 0) {
            if (this.props._walletAddress) {
                //Account was not null, must have logged out
                this.props.dispatch(setWalletAddress(null));
                this.props.dispatch(setWalletState(WALLET_API_STATES.NEEDS_CONNECTING));

            }
        } else if (accounts[0] !== this.props._walletAddress) {
            this.props.dispatch(setWalletAddress(accounts[0]));
            this.props.dispatch(setWalletState(WALLET_API_STATES.SIGNED_IN));
        }
    }

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
}