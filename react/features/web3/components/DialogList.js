import React, { Component } from 'react';
import ListItem from './ListItem';

class DialogList extends Component {

    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className='guild-list-head'>
                Choose one of your guilds
                </div>
                { this.props.sections.map((item) => 
                    <ListItem 
                        value={item.name} 
                        key={item.id} 
                        urlEnd={item.urlName}
                    />) 
                }
            </div>
        );
    }
}

export default DialogList;