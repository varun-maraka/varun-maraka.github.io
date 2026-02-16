import React, { Component } from 'react';
import UserList from '../containers/user-list';
import UserDetails from '../containers/user-detail';
import AllowDuplicates from '../containers/checkbox';
import Menu from './Menu';
import NotesApp from './NotesApp';
require('../../scss/style.scss');

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeApp: 'notes'
        };
    }

    handleMenuClick = (appName) => {
        this.setState({ activeApp: appName });
    }

    render() {
        const { activeApp } = this.state;

        return (
            <div className="app-wrapper">
                <Menu activeApp={activeApp} onMenuClick={this.handleMenuClick} />
                <div className="app-content">
                    {activeApp === 'notes' && (
                        <div>
                            <AllowDuplicates/>
                            <NotesApp />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default App;
