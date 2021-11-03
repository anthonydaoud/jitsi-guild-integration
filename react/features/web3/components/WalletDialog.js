// @flow

import React, { Component } from 'react';
import { WALLET_API_STATES } from '../constants';
import { Dialog, hideDialog } from '../../base/dialog';
import { connect } from '../../base/redux';
import { tmpy } from './tmp';
import DialogList from './DialogList';
import { AbstractWeb3Connect } from './AbstractWeb3Connect';


class WalletDialog extends AbstractWeb3Connect {
    /**
     * Initializes a new {@code WalletDialog} instance.
     *
     * @param {Props} props - The React {@code Component} props to initialize
     * the new {@code WalletDialog} instance with.
     */
    constructor(props: Props) {
        super(props);

    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        let inner = null;
        let titleString = "Connect to a wallet";
        switch (this.props._walletState) {
            case WALLET_API_STATES.INSTALL_METAMASK:
                inner = this._installMetamaskView();
                break;
            case WALLET_API_STATES.NEEDS_CONNECTING:
                inner = this._needsConnectingView();
                break;
            case WALLET_API_STATES.SIGNED_IN:
                inner = this._signedInView();
                titleString = "Select A Guild"
                break;
        }
        return (
            <Dialog 
                submitDisabled = { true }
                hideCancelButton = { true }
                titleString = {titleString}
                 >
            {inner}      
            </Dialog>
        );
    }

    _installMetamaskView() {
        return <button 
                    className='metamask-button' 
                    onClick={(e) => {
                        e.preventDefault();
                        window.open('https://metamask.io');
                        this.props.dispatch(hideDialog());    
                    }}
                >Install Metamask</button>
    }

    _needsConnectingView() {
        return <button 
                    className='metamask-button' 
                    onClick={(e) => {
                        e.preventDefault(e);
                        this._onClickConnectToMetamask();;
                    }}
                    >Connect via MetaMask</button>
    }

    _signedInView() {
        /*const url = 'https://api.guild.xyz/guilds';
        fetch(url).then( (response) => {
            console.log(response);
        }).catch( (e)  => {
            console.log("Error: ",  e);
        })
        fetch('tmp.json').then( (response) => {
            return response.json();
        }).then( (js) => {
            console.log(js);
        }).catch( (e)  => {
            console.log("Error: ",  e);
        })*/
        /*
        tmpy.forEach((x) => {
            if (x.groups.length > 0) {
                console.log(x)
            }
        })*/    
        return (<div className = 'guild-modal-body'>
                    <DialogList 
                        sections={tmpy}
                        keyExtractor={(item, index)=>item+index}
                        renderItem={(item)=>1}
                    />
                </div>);
    }
    
}

function _mapStateToProps(state) {
    return {
        _walletState: state['features/web3'].walletState
    }
}

export default connect(_mapStateToProps)(WalletDialog);
