import React from 'react';
import { connect } from '../../base/redux';
import { Dialog, hideDialog } from '../../base/dialog';
import Select from '@atlaskit/select';

import AbstractWeb3Connect from './AbstractWeb3Connect';
import { hasGuildAccess, signatureIsValid } from '../functions';
import { storeGuildRequirement } from '../actions';
import { WALLET_API_STATES, VERIFY_MESSAGE, METAMASK_MAIN_URL } from '../constants';

/**
 * The dialog displayed on the welcome screen. Handles wallet activities
 */
class WalletDialog extends AbstractWeb3Connect {

    constructor(props: Props) {
        super(props);

        this._onSubmit = this._onSubmit.bind(this);

        this.state = {
            selectValue: null,
            inputValue: null,
            menuIsOpen: false,
            okDisabled: false,
            badGuildName: false,
            noAccess: false,
        }
    }

    render() {
        let inner = null;
        let titleString = "Connect to a wallet";
        let submitDisabled = true;
        switch (this.props._walletState) {
            case WALLET_API_STATES.INSTALL_METAMASK:
                inner = this._installMetamaskView();
                break;
            case WALLET_API_STATES.NEEDS_CONNECTING:
                inner = this._needsConnectingView();
                break;
            case WALLET_API_STATES.SIGNED_IN:
                inner = this._signedInInput();
                titleString = "Select Your Guild";
                submitDisabled = false;
                break;
        }
        return (<Dialog 
                    submitDisabled = { submitDisabled }
                    hideCancelButton = { true }
                    titleString = {titleString}
                    onSubmit = {this._onSubmit}
                    okDisabled = {this.state.okDisabled}
                >
                    <div className = 'guild-dialog'>
                        {inner}   
                    </div>   
                </Dialog>);
    }

    /**
     * Helper that shows the proper view when MetaMask is
     * not installed
     * 
     * @returns ReactElement
     */
    _installMetamaskView() {
        return (<button 
                    className='metamask-button' 
                    onClick={(e) => {
                        e.preventDefault();
                        window.open(METAMASK_MAIN_URL);
                        this.props.dispatch(hideDialog());    
                    }}
                >
                    Install MetaMask
                </button>);
    }

    /**
     * Helper that shows the proper view the wallet is not
     * connected to jitsi
     * 
     * @returns ReactElement
     */
    _needsConnectingView() {
        return (<button 
                    className='metamask-button' 
                    onClick={(e) => {
                        e.preventDefault(e);
                        this._onClickConnectToMetamask();
                        this.props.dispatch(hideDialog());    
                    }}
                >
                    Connect via MetaMask
                </button>);
    }

    /**
     * Helper that handles submitting the guild in the dialog
     */
    async _onSubmit() {
        this.setState({
            menuIsOpen: false
        })
        if (!this.state.selectValue) {
            this.setState({
                badGuildName: true, 
                noAccess: false
            })
            throw 'Error: No Access'
        }
        const guild = this.props._allGuilds[this.state.selectValue.value];

        this.setState({
            okDisabled: true
        })
        const hasAccess = await hasGuildAccess(guild, this.props._walletAddress);
        if (hasAccess) {
            //ask for signature before storing requirement
            const signed = await this._signMessage(null, VERIFY_MESSAGE);
            if (signed) {
                const { signature, address } = signed;
                if (signatureIsValid(address, signature, null, VERIFY_MESSAGE)) {
                    this.props.dispatch(storeGuildRequirement(guild))
                }
            } else {
                this.setState({
                    noAccess: false,
                    okDisabled: false
                })
                throw 'Error: Please sign'
            }
        } else {
            this.setState({
                badGuildName: false, 
                noAccess: true,
                okDisabled: false
            })
            throw 'Error: Bad request'
        }
    }
    
    /**
     * Helper that shows the proper view the wallet is
     * connected to jitsi
     * 
     * @returns ReactElement
     */
    _signedInInput() {
        if (!this.props._allGuilds) {
            return (<div>
                        Loading guilds still...
                    </div>);     
        }

        const errorTextShow = this.state.badGuildName || this.state.noAccess;
        return (
            <div className = 'guild-modal-body'>
                <div className = 'guild-body-title'>
                    Choose a guild you are a member of 
                </div>
                <Select
                    options={this.props._allGuilds.map((guild, idx) => {
                        return {label: guild.name, value: idx}
                    })}
                    maxMenuHeight={225}
                    value={this.state.selectValue}
                    onChange={selectValue => this.setState({ selectValue })}
                    onInputChange={() => {this.setState({ 
                        selectValue: null,
                        badGuildName: false,
                        noAccess: false
                    })}}
                    menuIsOpen={this.state.menuIsOpen}
                    onMenuOpen={() => this.setState({ menuIsOpen: true })}
                    onMenuClose={() => this.setState({ menuIsOpen: false })}
                />
                <div className='guild-access-error' style={{ visibility: errorTextShow ? 'visible': 'hidden'}}>
                    {this.state.badGuildName ? "Please select a guild from the dropdown" : 
                                                "You don't have access to that guild"}
                </div>
            </div>
        );
    }
}

function _mapStateToProps(state) {
    return {
        _walletState: state['features/web3'].walletState,
        _walletAddress: state['features/web3'].walletAddress,
        _allGuilds: state['features/web3'].allGuilds
    }
}

export default connect(_mapStateToProps)(WalletDialog);
