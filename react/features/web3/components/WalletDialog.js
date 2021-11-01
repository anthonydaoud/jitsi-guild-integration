// @flow

import React, { Component } from 'react';

import { WALLET_API_STATES } from '../constants';
import { Dialog, hideDialog } from '../../base/dialog';
import { connect } from '../../base/redux';



class WalletDialog extends Component<Props> {
    /**
     * Initializes a new {@code WalletDialog} instance.
     *
     * @param {Props} props - The React {@code Component} props to initialize
     * the new {@code WalletDialog} instance with.
     */
    constructor(props: Props) {
        super(props);

        // Bind event handlers so they are only bound once for every instance.
        this._closeDialog = this._closeDialog.bind(this);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <Dialog 
                closeDialog = { this._closeDialog }
                submitDisabled = { true }
                hideCancelButton = { true }
                titleString = {"Connect to a wallet"}
                 >
            Install Metamask      
            </Dialog>
        );
    }

    /**
     * Callback invoked to close the dialog without saving changes.
     *
     * @private
     * @returns {void}
     */
    _closeDialog() {
        this.props.dispatch(hideDialog());
    }
}

function _mapStateToProps(state) {
    return {
        _walletState: state['features/web3'].walletState
    }
}

export default connect(_mapStateToProps)(WalletDialog);
