import React, { Component } from 'react';
import { connect } from '../../base/redux';
import { storeGuildRequirement, openWalletDialog } from '../actions';

class GuildMeetingStart extends Component<Props> {

    /**
     * Initializes a new {@code GuildMeetingStart} instance.
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
    let buttonStr = "Require Guild Membership?";
    if (this.props._guildRequirement !== null) {
        buttonStr = "Remove Guild Requirement";
    }
    
    return (
        <button aria-disabled = 'false'
            aria-label = 'Guild Meeting'
            className = 'welcome-guild-button'
            onClick = { this._onClick }
            type = 'button'>
            {buttonStr}
        </button>
        );
    }

    componentDidMount() {
        //Reset the guild everytime we load the welcome page
        this.props.dispatch(storeGuildRequirement(null))
    }

    _onClick() {
        console.log(this.props._guildRequirement);
        if (this.props._guildRequirement === null) {
            this.props.dispatch(openWalletDialog()); 
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