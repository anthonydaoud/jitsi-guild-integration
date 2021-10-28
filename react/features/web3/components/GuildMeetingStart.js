import React, { Component } from 'react';
import type { Dispatch } from 'redux';




class GuildMeetingStart extends Component<Props> {

    /**
     * Initializes a new {@code WalletConnect} instance.
     *
     * @inheritdoc
     */
    
    constructor(props: Props) {
        super(props);

        // Bind event handlers so they are only bound once per instance.
        //this._onOpenURL = this._onOpenURL.bind(this);
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
    
    
    return (
        <button aria-disabled = 'false'
            aria-label = 'Guild Meeting'
            className = 'welcome-guild-button'
            //onClick = { this._onFormSubmit }
            //tabIndex = '0'
            type = 'button'>
            Host Guild Meeting
        </button>
    );
    
    }
}
/*
const _mapStateToProps = function(state: Object) {
    return {
        _connectedToWallet: state['features/web3'].
    }
}
*/
export default GuildMeetingStart;