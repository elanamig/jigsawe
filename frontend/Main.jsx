import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Puzzle from './Puzzle';
import Topbar from './Topbar';

export default class Main extends Component {
    render () {
        return (
            <div>
            <Topbar />
            
                    <main>
                        <Puzzle/>
                    </main>
            </div>
        )
    }
}