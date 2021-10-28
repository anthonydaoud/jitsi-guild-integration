import React, { Component } from 'react';
import { setWalletState } from '../actions';
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
            ...this.state,
        }

    }

    /**
     * Implements React's {@link Component#render()}, renders the sidebar item.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    
    render() {
    let walletButtonStr = "Connect Wallet"; 
    if (this.state.walletConnected) {
        walletButtonStr = "Connected!";
    }
    
    return (
        <button //aria-disabled = 'false'
        //aria-label = 'Connect wallet'
        className = 'welcome-wallet-button'
        //id = 'enter_room_button'
        onClick ={ this._onClick }
        //tabIndex = '0'
        type = 'button' value={walletButtonStr}>
        {walletButtonStr}
        </button>
        );
    }


    _onClick() {
        console.log(this.props._walletState)
        this.props.dispatch(setWalletState(1));
    }
}

function _mapStateToProps(state) {
    return {
        _walletState: state['features/web3'].walletState
    };
}

export default connect(_mapStateToProps)(WalletConnect);