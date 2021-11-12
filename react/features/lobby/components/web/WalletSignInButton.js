import React from 'react';
import { connect } from '../../../base/redux';

import AbstractWeb3Connect from '../../../web3/components/AbstractWeb3Connect';
import { startGuildKnocking } from '../../actions';
import { hasGuildAccess } from '../../../web3/functions';
import Button from '@atlaskit/button/standard-button';


/**
 * The sign in button shown on the lobby screen
 */
class WalletSignInButton extends AbstractWeb3Connect {

    /* Initializes a new {@code WalletSignInButton} instance.
    *
    * @inheritdoc
    */
   constructor(props: Props) {
       super(props);

       // Bind event handlers so they are only bound once per instance.
       this._onClick = this._onClick.bind(this);
       this.state = {
           ...this.state,
           _badWallet: false
       }
   }

   render() {    
    return (
        <>
            <Button 
                className = 'sign-and-enter'
                appearance = 'primary'
                onClick ={ this._onClick }
                type = 'button' 
                isDisabled={ this.state._badWallet }
            >
                {this.props._walletAddress ? "Sign & Enter Meeting" : "Connect & Sign to Enter"}
            </Button>
            <div 
                className="bad-wallet-text" 
                style={{ visibility: this.state._badWallet ? 'visible': 'hidden'}}
            >
                This wallet is not part of the guild, please try another.
            </div>
        </>
        );
    }

    componentDidMount() {
        ethereum.on('accountsChanged', (accounts) => { 
            this._handleAccountsChanged(accounts, true);
            this.setState({
                _badWallet: false
            })
        });
    }

    async _onClick() {
        if (this.props._walletAddress) {
            //first, verify if walletAddress is part of guild
            const hasAccess = await hasGuildAccess(this.props._guildRequirement, this.props._walletAddress)
            if (hasAccess) {  
                //then, require them to sign a message to prove they own the account              
                const signed = await this._signMessage(this.props._challenge);
                if (signed) {
                    this.props.dispatch(startGuildKnocking(signed))
                }
            }  else {
                this.setState({
                    _badWallet: true
                })
            }    
        } else {
            this._onClickConnectToMetamask();
        }
    }
}

function _mapStateToProps(state) {
    return {
        _allGuilds: state['features/web3'].allGuilds,
        _challenge: state['features/web3'].challenge,
        _guildRequirement: state['features/web3'].guildRequirement,
        _walletAddress: state['features/web3'].walletAddress
    }
}

export default connect(_mapStateToProps)(WalletSignInButton);
