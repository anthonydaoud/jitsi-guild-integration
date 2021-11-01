import React, { Component } from 'react';
import { setWalletState, openWalletDialog } from '../actions';
import { WALLET_API_STATES, WALLET_VIEW_ID } from '../constants';
import { connect } from '../../base/redux';


class WalletConnect extends Component<Props> {

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
            _currentAccount: null,
            _hasMetamask: false,
            _buttonLabel: "Connect Wallet"
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
        <button //aria-disabled = 'false'
        //aria-label = 'Connect wallet'
        className = 'welcome-wallet-button'
        //id = 'enter_room_button'
        onClick ={ this._onClick }
        //tabIndex = '0'
        type = 'button' >
        {this.state._buttonLabel}
        </button>
        );
    }

    async componentDidMount() {
        if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
            this.setState({_hasMetamask: true});
            ethereum
                .request({ method: 'eth_accounts' })
                .then((accounts) => this._handleAccountsChanged(accounts))
                .catch((err) => {
                // Some unexpected error.
                // For backwards compatibility reasons, if no accounts are available,
                // eth_accounts will return an empty array.
                console.error(err);
                });
            ethereum.on('chainChanged', this._handleChainChanged);
            ethereum.on('accountsChanged', (accounts) => this._handleAccountsChanged(accounts));

        }

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
        console.log(this.state);
        console.log(accounts);
        if (accounts.length === 0) {
            // MetaMask is locked or the user has not connected any accounts
            console.log('Please connect to MetaMask.');
        } else if (accounts[0] !== this.state._currentAccount) {
            const _buttonLabel = accounts[0].substring(0,6) + "..." + accounts[0].substring(accounts[0].length-6)
            this.setState({
                _currentAccount: accounts[0], 
                _buttonLabel
            })
            this.props.dispatch(setWalletState(WALLET_API_STATES.SIGNED_IN));


        }

            
        
    }

    async _onClick() {
        if (!this.state._hasMetamask) {
            this.props.dispatch(setWalletState(WALLET_API_STATES.INSTALL_METAMASK));
            this.props.dispatch(openWalletDialog(WALLET_VIEW_ID));
        } else {
            ethereum
                .request({ method: 'eth_requestAccounts' })
                .then((accs) => this._handleAccountsChanged(accs))
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

        console.log(this.props._walletState)
    }
}

function _mapStateToProps(state) {
    return {
        _walletState: state['features/web3'].walletState
    };
}

export default connect(_mapStateToProps)(WalletConnect);