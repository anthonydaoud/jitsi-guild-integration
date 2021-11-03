import React, { Component } from 'react';
//import EditorPanelIcon from '@atlaskit/icon/glyph/editor/panel';
import EditorLinkIcon from '@atlaskit/icon/glyph/editor/link';
import { storeGuildRequirement } from '../actions';
import { hideDialog } from '../../base/dialog';
import { connect } from '../../base/redux';

class ListItem extends Component  {
    constructor(props: Props) {
        super(props);
    }

    render() {
        const _guildLink = "https://alpha.guild.xyz/guild/"+this.props.urlEnd;
        return (
            <div className = 'guild-list-row'>
                <button className = 'guild-select-button'
                onClick={(e) => {
                    e.preventDefault();
                    console.log(typeof this.props.dispatch)
                    this.props.dispatch(storeGuildRequirement(this.props.urlEnd));
                    this.props.dispatch(hideDialog());
                }}> 
                {this.props.value}
                    
                </button>  
                <button 
                    className = 'guild-link-button' 
                    onClick={(e) => {
                    e.preventDefault();
                    window.open(_guildLink);
                }}>
                <EditorLinkIcon/>
                </button>
            </div>      
        );
    }
}

export default connect()(ListItem);