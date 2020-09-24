

import React, { Component } from 'react';

import { Input } from 'antd';
import 'antd/dist/antd.css';
import './css/input.css';

import { esBoolean, existeData } from '../../utils/functions';

import PropTypes from 'prop-types';

class C_Input extends Component {

    on_verificar() {
        if ( esBoolean(this.props.password) ) {
            return (
                <Input.Password 
                    size={this.props.size}
                    style={{ width: '100%', minWidth: '100%', }}
                    allowClear={this.props.allowClear}
                    placeholder={'INGRESAR CONTRASEÑA'}
                    value={this.props.value}
                    onChange={ (event) => {
                        if (existeData(this.props.onChange)) {
                            this.props.onChange(event.target.value)
                        } 
                    } }
                    onPressEnter={this.props.onPressEnter}
                />
            );
        }
        if ( esBoolean(this.props.search) ) {
            return (
                <Input.Search
                    placeholder=""
                    size={this.props.size}
                    style={{ width: '100%', minWidth: '100%', }}
                    allowClear={this.props.allowClear}
                    value={this.props.value}
                    onChange={ (event) => {
                        if (existeData(this.props.onChange)) {
                            this.props.onChange(event.target.value)
                        } 
                    } }
                    onSearch={ (value) => {
                        if (existeData(this.props.onSearch)) {
                            this.props.onSearch(value)
                        } 
                    } }
                />
            );
        }
        if ( esBoolean(this.props.textarea) ) {
            return (
                <Input.TextArea
                    style={{ width: '100%', minWidth: '100%', }}
                    allowClear={this.props.allowClear}
                    value={this.props.value}
                    onChange={ (event) => {
                        if (existeData(this.props.onChange)) {
                            this.props.onChange(event.target.value)
                        } 
                    } }
                    autoSize={ {minRows: 3, maxRows: 6,} }
                    onPressEnter={ this.props.onPressEnter }
                />
            );
        }
        return (
            <Input 
                size={this.props.size}
                style={{ width: '100%', minWidth: '100%', }}
                allowClear={this.props.allowClear}
                value={this.props.value}
                onChange={ (event) => this.props.onChange(event.target.value) }
                placeholder={this.props.placeholder}
                prefix={this.props.prefix}
                suffix={this.props.suffix}
                onPressEnter={this.props.onPressEnter}
            />
        );
    }

    render() {

        return (
            <div className='input-group-component'>
                { this.on_verificar() }
            </div>
        );

    };
};

C_Input.propTypes = {
    size: PropTypes.string,                 // [ 'large', 'small', 'default' ]
    allowClear: PropTypes.bool,             // se permite eliminar el contenido con el icono que se va visulaizar 
    onChange: PropTypes.func,               // funcion que devuelve lo ingresado por el usuario 
    onSearch: PropTypes.func,
    onPressEnter: PropTypes.func,
    value: PropTypes.string,                // valor del contenido
    placeholder: PropTypes.string,
    prefix: PropTypes.any,
    suffix: PropTypes.any,

    password: PropTypes.bool,
    search: PropTypes.bool,
    textarea: PropTypes.bool,
}


C_Input.defaultProps = {
    size: "large",
    allowClear: true,
    placeholder: 'INGRESAR DATO...',
    prefix: null,
    suffix: null,

    password: false,
    search: false,
    textarea: false,
}


export default C_Input;

