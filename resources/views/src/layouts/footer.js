

import React, { Component } from 'react';

import PropTypes from 'prop-types';

export default class Footer extends Component {

    render () {
        return (
            <div className="app-wrapper-footer" style={{ background: 'white' }}>
                <div className="app-footer">
                    <div className={"app-footer__inner " + this.props.footercolor}>
                        
                       
                    </div>
                </div>
            </div>  
        );
    }
};

Footer.propTypes = {
    visitasitio: PropTypes.string,
    footercolor: PropTypes.string,
}

Footer.defaultProps = {
    visitasitio: '',
    footercolor: '',
}

