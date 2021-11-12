import React, { Component } from 'react';
import { connect } from '../../base/redux';

import WalletDialog from './WalletDialog';
import { storeGuildRequirement, openWalletDialog } from '../actions';

/**
 * The require guild meeting button on the welcome page
 */
class GuildMeetingStart extends Component<Props> {

    constructor(props: Props) {
        super(props);

        // Bind event handlers so they are only bound once per instance.
        this._onClick = this._onClick.bind(this);
    }

    render() {
    let buttonStr = "Require Guild Membership?";
    if (this.props._guildRequirement !== null) {
        buttonStr = "Remove Guild Requirement";
    }
    return (<button aria-disabled = 'false'
                aria-label = 'Guild Meeting'
                className = 'welcome-guild-button'
                onClick = { this._onClick }
                type = 'button'>
                {buttonStr}
            </button>);
    }

    componentDidMount() {
        //Reset the guild everytime we load the welcome page
        this.props.dispatch(storeGuildRequirement(null))
    }

    _onClick() {
        if (this.props._guildRequirement === null) {
            this.props.dispatch(openWalletDialog(WalletDialog)); 
        } else {
            this.props.dispatch(storeGuildRequirement(null));
        }
    }
}

function _mapStateToProps(state) {
    return {
        _walletState: state['features/web3'].walletState,
        _guildRequirement: state['features/web3'].guildRequirement
    }
}

export default connect(_mapStateToProps)(GuildMeetingStart);