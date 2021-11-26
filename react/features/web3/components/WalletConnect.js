import React from 'react';
import { connect } from '../../base/redux';

import WalletDialog from './WalletDialog';
import AbstractWeb3Connect from './AbstractWeb3Connect';
import { setAllGuilds, setChallenge, setWalletAddress, setWalletState, 
    storeGuildRequirement, openWalletDialog } from '../actions';
import { WALLET_API_STATES, ALL_GUILDS_URL } from '../constants';

/**
 * The connect button on the welcome screen
 */
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
    }

    render() {
        return (<button 
                    className = 'welcome-wallet-button'
                    onClick ={ this._onClick }
                    type = 'button' >
                    {this.props._walletAddress ? this._makeButtonLabel() : "Connect Wallet"}
                </button>);
    }

    _clearSavedState() {
        this.props.dispatch(setAllGuilds(null));
        this.props.dispatch(setChallenge(null));
        this.props.dispatch(setWalletAddress(null));
        this.props.dispatch(setWalletState(WALLET_API_STATES.INSTALL_METAMASK));
        this.props.dispatch(storeGuildRequirement(null));
    }

    async componentDidMount() {
        this._clearSavedState();
        this._loadMetamask();
        
        fetch(ALL_GUILDS_URL).then((res) => {
            return res.json()
        }).then( (allGuilds) => {
            allGuilds.sort((a, b) => a.name.localeCompare(b.name))
            this.props.dispatch(setAllGuilds(allGuilds));
        }).catch((err) => {
            console.error(err);
        });
    }


    /**
     * Helper function to get the button string from the wallet address
     * 
     * @returns string
     */
    _makeButtonLabel() {
        const acc = this.props._walletAddress;
        return acc.substring(0,6) + "..." + acc.substring(acc.length-6);
    }

    async _onClick() {
        switch (this.props._walletState) {
            case WALLET_API_STATES.INSTALL_METAMASK:
                this.props.dispatch(openWalletDialog(WalletDialog));
                break;
            case WALLET_API_STATES.NEEDS_CONNECTING:
                this.props.dispatch(openWalletDialog(WalletDialog));
                break;
            case WALLET_API_STATES.SIGNED_IN:
                //Note, could add another feature here in the future
                break;
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