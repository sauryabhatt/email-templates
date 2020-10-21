import React from 'react';

import Error500 from './../components/Error500/Error500';


export default class ErrorHandler extends React.Component {
    
    state = {
        failure: false
    }

    componentDidCatch(error, info) {
        // console.log(error, info);
    }

    static getDerivedStateFromError(error) {
        return { failure: true, exception: error };
    }

    render() {
        return (
            this.state.failure ? <Error500 exception={this.state.exception} /> : this.props.children
        )
    }
}