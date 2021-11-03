import React from 'react';
import { openWalletDialog, setWalletAddress } from '../actions';
import { WALLET_API_STATES } from '../constants';
import { connect } from '../../base/redux';
import { AbstractWeb3Connect } from './AbstractWeb3Connect';

class WalletConnect extends AbstractWeb3Connect {

    /**
     * Initializes a new {@code WalletConnect} instance.
     *
     * @inheritdoc
     */
    
    constructor(props: Props) {
        super(props);

        // Bind event handlers so they are only bound once per instance.
        this._onClick = this._onClick.bind(this);
        this.state = {
            ...this.state,
        }
    }

    /**
     * Implements React's {@link Component#render()}, renders the wallet connect 
     * button.
     * 
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
    
    return (
        <button 
        className = 'welcome-wallet-button'
        onClick ={ this._onClick }
        type = 'button' >
        {this.props._walletAddress ? this._makeButtonLabel() : "Connect Wallet"}
        </button>
        );
    }

    async componentDidMount() {
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

    _makeButtonLabel() {
        const acc = this.props._walletAddress;
        return acc.substring(0,6) + "..." + acc.substring(acc.length-6);
    }

    async _onClick() {
        switch (this.props._walletState) {
            case WALLET_API_STATES.INSTALL_METAMASK:
                this.props.dispatch(openWalletDialog());
                break;
            case WALLET_API_STATES.NEEDS_CONNECTING:
                this.props.dispatch(openWalletDialog())
                break;
            case WALLET_API_STATES.SIGNED_IN:
                //TODO: what do I show if signed in?
                {}
                break;
            default: 
                console.log(this.props._walletState)
        }
    }
}

function _mapStateToProps(state) {
    return {
        _walletState: state['features/web3'].walletState,
        _walletAddress: state['features/web3'].walletAddress

    };
}

export default connect(_mapStateToProps)(WalletConnect);