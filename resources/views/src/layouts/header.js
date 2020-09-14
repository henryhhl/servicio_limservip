
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import web from '../utils/services';

import {withRouter, Link} from 'react-router-dom';

import { notification, Dropdown, Menu, message } from 'antd';
import 'antd/dist/antd.css';

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible_perfil: false,
            visible_search: false,
            active_search: 'active',
            search: '',
            timeoutSearch: undefined,

            articulo: [],
            categoria: [],
            cliente: [],
            color: [],
            marca: [],
            mecanico: [],
            servicio: [],
            usuario: [],
            vehiculo: [],
        };
    }

    onAjuste(event) {
        event.preventDefault();
        this.props.history.push( web.serv_link + '/ajuste');
    }

    get_search(value) {
        var formdata = new FormData();
        formdata.append('search', value);
        axios.post( web.servidor + '/ajuste/search_general', formdata).then(
            (response) => {
                console.log(response.data)
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        console.log(response.data)
                        this.setState({
                            articulo: response.data.articulo,
                            categoria: response.data.categoria,
                            cliente: response.data.cliente,
                            color: response.data.color,
                            marca: response.data.marca,
                            mecanico: response.data.mecanico,
                            servicio: response.data.servicio,
                            usuario: response.data.usuario,
                            vehiculo: response.data.vehiculo,
                        });
                        return;
                    }
                }
            }
        ).catch( error => {
            message.error('HUBO PROBLEMA AL SOLICITUD SERVICIO');
        } );
    }

    onShowUsuario(id) {
        console.log(id)
        this.setState({
            visible_search: false,
            search: '',
            articulo: [],
            categoria: [],
            cliente: [],
            color: [],
            marca: [],
            mecanico: [],
            servicio: [],
            usuario: [],
            vehiculo: [],
        });
        setTimeout(() => {
            this.props.history.push(web.serv_link + '/usuario/show/' + id);
        }, 1000);
    }

    onShowVehiculo(id) {
        console.log(id)
        this.setState({
            visible_search: false,
            search: '',
            articulo: [],
            categoria: [],
            cliente: [],
            color: [],
            marca: [],
            mecanico: [],
            servicio: [],
            usuario: [],
            vehiculo: [],
        });
        setTimeout(() => {
            this.props.history.push(web.serv_link + '/vehiculo/show/' + id);
        }, 1000);
    }

    onShowServicio(id) {
        this.setState({
            visible_search: false,
            search: '',
            articulo: [],
            categoria: [],
            cliente: [],
            color: [],
            marca: [],
            mecanico: [],
            servicio: [],
            usuario: [],
            vehiculo: [],
        });
        setTimeout(() => {
            this.props.history.push(web.serv_link + '/almacen/show/' + id);
        }, 1000);
    }

    onShowCliente(id) {
        this.setState({
            visible_search: false,
            search: '',
            articulo: [],
            categoria: [],
            cliente: [],
            color: [],
            marca: [],
            mecanico: [],
            servicio: [],
            usuario: [],
            vehiculo: [],
        });
        setTimeout(() => {
            this.props.history.push(web.serv_link + '/cliente/show/' + id);
        }, 1000);
    }

    onShowMarca(id) {
        this.setState({
            visible_search: false,
            search: '',
            articulo: [],
            categoria: [],
            cliente: [],
            color: [],
            marca: [],
            mecanico: [],
            servicio: [],
            usuario: [],
            vehiculo: [],
        });
        setTimeout(() => {
            this.props.history.push(web.serv_link + '/vehiculo_marca/show/' + id);
        }, 1000);
    }
    onShowColor(id) {
        this.setState({
            visible_search: false,
            search: '',
            articulo: [],
            categoria: [],
            cliente: [],
            color: [],
            marca: [],
            mecanico: [],
            servicio: [],
            usuario: [],
            vehiculo: [],
        });
        setTimeout(() => {
            this.props.history.push(web.serv_link + '/vehiculo_color/show/' + id);
        }, 1000);
    }
    onShowMecanico(id) {
        this.setState({
            visible_search: false,
            search: '',
            articulo: [],
            categoria: [],
            cliente: [],
            color: [],
            marca: [],
            mecanico: [],
            servicio: [],
            usuario: [],
            vehiculo: [],
        });
        setTimeout(() => {
            this.props.history.push(web.serv_link + '/mecanico/show/' + id);
        }, 1000);
    }
    onShowCategoria(id) {
        this.setState({
            visible_search: false,
            search: '',
            articulo: [],
            categoria: [],
            cliente: [],
            color: [],
            marca: [],
            mecanico: [],
            servicio: [],
            usuario: [],
            vehiculo: [],
        });
        setTimeout(() => {
            this.props.history.push(web.serv_link + '/categoria/show/' + id);
        }, 1000);
    }
    onShowArticulo(id) {
        this.setState({
            visible_search: false,
            search: '',
            articulo: [],
            categoria: [],
            cliente: [],
            color: [],
            marca: [],
            mecanico: [],
            servicio: [],
            usuario: [],
            vehiculo: [],
        });
        setTimeout(() => {
            this.props.history.push(web.serv_link + '/categoria/show/' + id);
        }, 1000);
    }

    onchangeSearch(event) {
        var value = event.target.value;
        this.setState({
            search: value,
        });
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(() => {
            this.get_search(value)
        }, 1000);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }

    render() {

        var usuario = this.props.usuario;

        const menushearch = (
            <Menu style={{width: '200%', height: 350, overflow: 'scroll'}}>

                {this.state.articulo.map( (data, key) => {
                    if (key == 0) {
                        return (
                            <div style={{width: '100%',}} key={key}>
                                <div className="font-size-md text-capitalize font-weight-normal" 
                                    style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8'}}
                                >
                                    <strong>ARTICULOS ENCONTRADOS</strong>
                                </div>
                                <div className="font-size-md text-capitalize font-weight-normal"
                                    style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8', color: 'blue'}}
                                    onClick={this.onShowArticulo.bind(this, data.id)}
                                >
                                    {data.descripcion}
                                </div>
                            </div>
                        );
                    }
                    return (
                        <div className="font-size-md text-capitalize font-weight-normal" key={key}
                            style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8'}}
                        >
                            <div className="font-size-md text-capitalize font-weight-normal" 
                                style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8', color: 'blue'}}
                                onClick={this.onShowArticulo.bind(this, data.id)}
                            >
                                {data.descripcion}
                            </div>
                        </div>
                    );
                } )}

                {this.state.categoria.map( (data, key) => {
                    if (key == 0) {
                        return (
                            <div style={{width: '100%',}} key={key}>
                                <div className="font-size-md text-capitalize font-weight-normal"
                                    style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8'}}
                                >
                                    <strong>CATEGORIA ENCONTRADOS</strong>
                                </div>
                                <div className="font-size-md text-capitalize font-weight-normal" 
                                    style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8', color: 'blue'}}
                                    onClick={this.onShowCategoria.bind(this, data.id)}
                                >
                                    {data.descripcion}
                                </div>
                            </div>
                        );
                    }
                    return (
                        <div className="font-size-md text-capitalize font-weight-normal" key={key}
                            style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8'}}
                        >
                            <div className="font-size-md text-capitalize font-weight-normal" 
                                style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8', color: 'blue'}}
                                onClick={this.onShowCategoria.bind(this, data.id)}
                            >
                                {data.descripcion}
                            </div>
                        </div>
                    );
                } )}

                {this.state.cliente.map( (data, key) => {
                    if (key == 0) {
                        return (
                            <div style={{width: '100%',}} key={key}>
                                <div className="font-size-md text-capitalize font-weight-normal" 
                                    style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8'}}
                                >
                                    <strong>CLIENTES ENCONTRADOS</strong>
                                </div>
                                <div className="font-size-md text-capitalize font-weight-normal" 
                                    style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8', color: 'blue', cursor: 'pointer'}}
                                    onClick={this.onShowCliente.bind(this, data.id)}
                                >
                                    {data.nombre} - {data.apellido == null ? '' : data.apellido} - {data.telefono == null ? '' : data.telefono}
                                    
                                </div>
                            </div>
                        );
                    }
                    return (
                        <div className="font-size-md text-capitalize font-weight-normal" key={key}
                            style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8'}}
                        >
                            <div className="font-size-md text-capitalize font-weight-normal" 
                                style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8', color: 'blue', cursor: 'pointer'}}
                                onClick={this.onShowCliente.bind(this, data.id)}
                            >
                                {data.nombre} - {data.apellido == null ? '' : data.apellido} - {data.telefono == null ? '' : data.telefono}
                            </div>
                        </div>
                    );
                } )}

                {this.state.color.map( (data, key) => {
                    if (key == 0) {
                        return (
                            <div style={{width: '100%',}} key={key}>
                                <div className="font-size-md text-capitalize font-weight-normal" 
                                    style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8'}}
                                >
                                    <strong>COLORES ENCONTRADOS</strong>
                                </div>
                                <div className="font-size-md text-capitalize font-weight-normal" 
                                    style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8', color: 'blue'}}
                                    onClick={this.onShowColor.bind(this, data.id)}
                                >
                                    {data.descripcion}
                                </div>
                            </div>
                        );
                    }
                    return (
                        <div className="font-size-md text-capitalize font-weight-normal" key={key}
                            style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8'}}
                        >
                            <div className="font-size-md text-capitalize font-weight-normal" 
                                style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8', color: 'blue'}}
                                onClick={this.onShowColor.bind(this, data.id)}
                            >
                                {data.descripcion}
                            </div>
                        </div>
                    );
                } )}

                {this.state.marca.map( (data, key) => {
                    if (key == 0) {
                        return (
                            <div style={{width: '100%',}} key={key}>
                                <div className="font-size-md text-capitalize font-weight-normal" 
                                    style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8'}}
                                >
                                    <strong>MARCA ENCONTRADOS</strong>
                                </div>
                                <div className="font-size-md text-capitalize font-weight-normal" 
                                    style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8', color: 'blue', cursor: 'pointer'}}
                                    onClick={this.onShowMarca.bind(this, data.id)}
                                >
                                    {data.descripcion}
                                </div>
                            </div>
                        );
                    }
                    return (
                        <div className="font-size-md text-capitalize font-weight-normal" key={key}
                            style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8'}}
                        >
                            <div className="font-size-md text-capitalize font-weight-normal" 
                                style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8', color: 'blue', cursor: 'pointer'}}
                                onClick={this.onShowMarca.bind(this, data.id)}
                            >
                                {data.descripcion}
                            </div>
                        </div>
                    );
                } )}

                {this.state.mecanico.map( (data, key) => {
                    if (key == 0) {
                        return (
                            <div style={{width: '100%',}} key={key}>
                                <div className="font-size-md text-capitalize font-weight-normal" 
                                    style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8'}}
                                >
                                    <strong>MECANICOS ENCONTRADOS</strong>
                                </div>
                                <div className="font-size-md text-capitalize font-weight-normal" 
                                    style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8', color: 'blue', cursor:'pointer'}}
                                    onClick={this.onShowMecanico.bind(this, data.id)}
                                >
                                    {data.nombre} - {data.apellido == null ? '' : data.apellido} - {data.telefono == null ? '' : data.telefono}
                                    
                                </div>
                            </div>
                        );
                    }
                    return (
                        <div className="font-size-md text-capitalize font-weight-normal" key={key}
                            style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8'}}
                        >
                            <div className="font-size-md text-capitalize font-weight-normal"
                                style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8', color: 'blue', cursor: 'pointer'}}
                                onClick={this.onShowMecanico.bind(this, data.id)}
                            >
                                {data.nombre} - {data.apellido == null ? '' : data.apellido} - {data.telefono == null ? '' : data.telefono}
                            </div>
                        </div>
                    );
                } )}

                {this.state.servicio.map( (data, key) => {
                    if (key == 0) {
                        return (
                            <div style={{width: '100%',}} key={key}>
                                <div className="font-size-md text-capitalize font-weight-normal"
                                    style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8'}}
                                >
                                    <strong>SERVICIOS ENCONTRADOS</strong>
                                </div>
                                <div className="font-size-md text-capitalize font-weight-normal"
                                    style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8', color: 'blue', cursor: 'pointer'}}
                                    onClick={this.onShowServicio.bind(this, data.id)}
                                >
                                    {data.descripcion}
                                </div>
                            </div>
                        );
                    }
                    return (
                        <div className="font-size-md text-capitalize font-weight-normal" key={key}
                            style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8'}}
                        >
                            <div className="font-size-md text-capitalize font-weight-normal"
                                style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8', color: 'blue', cursor: 'pointer'}}
                                onClick={this.onShowServicio.bind(this, data.id)}
                            >
                                {data.descripcion}
                            </div>
                        </div>
                    );
                } )}

                {this.state.vehiculo.map( (data, key) => {
                    if (key == 0) {
                        return (
                            <div style={{width: '100%',}} key={key}>
                                <div className="font-size-md text-capitalize font-weight-normal"
                                    style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8'}}
                                >
                                    <strong>VEHICULOS ENCONTRADOS</strong>
                                </div>
                                <div className="font-size-md text-capitalize font-weight-normal"
                                    style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8', color: 'blue', cursor: 'pointer'}}
                                    onClick={this.onShowVehiculo.bind(this, data.id)}
                                >
                                    {data.descripcion}
                                </div>
                            </div>
                        );
                    }
                    return (
                        <div className="font-size-md text-capitalize font-weight-normal" key={key}
                            style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8'}}
                        >
                            <div className="font-size-md text-capitalize font-weight-normal"
                                style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8', color: 'blue', cursor: 'pointer'}}
                                onClick={this.onShowVehiculo.bind(this, data.id)}
                            >
                                {data.descripcion}
                            </div>
                        </div>
                    );
                } )}
                
                {this.state.usuario.map( (data, key) => {
                    if (key == 0) {
                        return (
                            <div style={{width: '100%',}} key={key}>
                                <div className="font-size-md text-capitalize font-weight-normal"
                                    style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8'}}
                                >
                                    <strong>USUARIOS ENCONTRADOS</strong>
                                </div>
                                <div className="font-size-md text-capitalize font-weight-normal"
                                    style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8', color: 'blue'}}
                                    onClick={this.onShowUsuario.bind(this, data.id)}
                                >
                                    {data.nombre} - {data.apellido == null ? '' : data.apellido} - {data.telefono == null ? '' : data.telefono}
                                </div>
                            </div>
                        );
                    }
                    return (
                        <div className="font-size-md text-capitalize font-weight-normal" key={key}
                            style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8'}}
                        >
                            <div className="font-size-md text-capitalize font-weight-normal" 
                                style={{paddingLeft: 10, paddingTop: 4, paddingBottom: 5, borderBottom: '1px solid #e8e8e8', color: 'blue', cursor: 'pointer'}}
                                onClick={this.onShowUsuario.bind(this, data.id)}
                            >
                                {data.nombre} - {data.apellido == null ? '' : data.apellido} - { ' USUARIO: ' + data.usuario}
                            </div>
                        </div>
                    );
                } )}

            </Menu>
        );

        const menu = (
            <div tabIndex="-1" role="menu" className={`rm-pointers dropdown-menu-lg dropdown-menu dropdown-menu-right show`}>
                <div className="dropdown-menu-header">
                    <div className="dropdown-menu-header-inner bg-info">
                        <div className="menu-header-image opacity-2" 
                            style={{'backgroundImage': 'url( ' + web.img_servidor + '/assets/images/dropdown-header/city3.jpg)'}}></div>
                        <div className="menu-header-content text-left">
                            <div className="widget-content p-0">
                                <div className="widget-content-wrapper">
                                    <div className="widget-content-left mr-3">
                                        { (usuario.imagen == null || usuario.imagen == '') ? 
                                            <img width="42" className="rounded-circle"
                                                src={ web.img_servidor + "/images/anonimo.jpg"}
                                                alt="" 
                                            /> : 
                                            <img width="42" className="rounded-circle"
                                                src={ usuario.imagen}
                                                alt="" 
                                            />
                                        }
                                    </div>
                                    <div className="widget-content-left">
                                        <div className="widget-heading">
                                            { usuario.apellido == null ? usuario.nombre : usuario.nombre + ' ' + usuario.apellido}
                                        </div>
                                        <div className="widget-subheading opacity-8">
                                            { usuario.rol == null ? '-' : usuario.rol}
                                        </div>
                                    </div>
                                    <div className="widget-content-right mr-2">
                                        <form action={ web.servidor + "/logout"} method="post" id='logout'>
                                            <input type="hidden" name="_token" value={this.props.token} />
                                            <button type='submit' className="btn-pill btn-shadow btn-shine btn btn-focus">
                                                Logout
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="scroll-area-xs" style={{'height': '150px'}}>
                    <div className="scrollbar-container ps">
                        <ul className="nav flex-column">
                            <li className="nav-item-header nav-item">
                                Actividad
                            </li>
                            <li className="nav-item">
                                <Link to={ web.serv_link + '/perfil' } onClick={ () => this.setState({ visible_perfil: false, }) } className="nav-link">
                                        Perfil
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={ web.serv_link + '/ajuste' } onClick={ () => this.setState({ visible_perfil: false, }) } className="nav-link">
                                        Ajuste
                                </Link>
                            </li>
                            {/* <li className="nav-item">
                                <a href="#" className="nav-link">
                                    Messages
                                    <div className="ml-auto badge badge-warning">
                                        512
                                    </div>
                                </a>
                            </li> */}
                        </ul>
                    </div>
                </div>
                {/* <ul className="nav flex-column">
                    <li className="nav-item-divider nav-item">
                    </li>
                    <li className="nav-item-btn text-center nav-item">
                        <button className="btn-wide btn btn-primary btn-sm" onChange={(event) => {
                            console.log(8)
                        }}>
                            Open Messages
                        </button>
                    </li>
                </ul> */}
            </div>
          );

        return (
            <div className={"app-header header-shadow " + this.props.headercolor}>
                <div className="app-header__logo">
                    <div className="logo-src" style={{background: 'none', fontWeight: 'bold',}}>
                        LIMSERVIP
                    </div>
                    <div className="header__pane ml-auto">
                        <div>
                            <button type="button" className="hamburger close-sidebar-btn hamburger--elastic" data-class="closed-sidebar">
                                <span className="hamburger-box">
                                    <span className="hamburger-inner"></span>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="app-header__mobile-menu">
                    <div>
                        <button type="button" className="hamburger hamburger--elastic mobile-toggle-nav">
                            <span className="hamburger-box">
                                <span className="hamburger-inner"></span>
                            </span>
                        </button>
                    </div>
                </div>
                <div className="app-header__menu">
                    <span>
                        <button type="button" className="btn-icon btn-icon-only btn btn-primary btn-sm mobile-toggle-header-nav">
                            <span className="btn-icon-wrapper">
                                <i className="fa fa-ellipsis-v fa-w-6"></i>
                            </span>
                        </button>
                    </span>
                </div>    
                <div className="app-header__content">
                    
                    <div className="app-header-left">

                        <Dropdown overlay={menushearch} trigger={['click']} 
                            visible={this.state.visible_search}
                            onVisibleChange={ () => this.setState({visible_search: !this.state.visible_search}) }
                        >
                            <div className={`search-wrapper ${this.state.active_search}`}>
                                <div className="input-holder">
                                    <input type="text" className="search-input" placeholder="INGRESAR DATO..." 
                                        value={this.state.search} onChange={this.onchangeSearch.bind(this)}
                                    />
                                    <button className="search-icon" onClick={ () => this.setState({active_search: 'active'}) }><span></span></button>
                                </div>
                                <button className="close" onClick={ () => this.setState({search: '', active_search: ''}) }></button>
                            </div>
                        </Dropdown>
                    </div>

                    <div className="app-header-right">
                        
                        
                        <div className="header-btn-lg pr-0">
                            <div className="widget-content p-0">
                                <div className="widget-content-wrapper">
                                    <div className="widget-content-left">
                                        <div className="btn-group">
                                            <Dropdown overlay={menu} trigger={['click']} 
                                                visible={this.state.visible_perfil}
                                                onVisibleChange={ () => this.setState({visible_perfil: !this.state.visible_perfil}) }
                                            >
                                                <a className="p-0 btn" onClick={e => e.preventDefault()}>
                                                    { (usuario.imagen == null || usuario.imagen == '') ?
                                                        <img width="42" className="rounded-circle" 
                                                            src={ web.img_servidor + "/images/anonimo.jpg"} alt="" 
                                                        /> : 
                                                        <img width="42" className="rounded-circle" 
                                                            src={ usuario.imagen } alt="" 
                                                        />
                                                    }
                                                    <i className="fa fa-angle-down ml-2 opacity-8"></i>
                                                </a>
                                            </Dropdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>  
                    </div>
                </div>
            </div>    
        );
    }
}

Header.propTypes = {
    usuario: PropTypes.object,
    token: PropTypes.string,
    headercolor:PropTypes.string,
}

Header.defaultProps = {
    usuario: {
        id: '',  nombre: '', apellido: '',
        nacimiento: '', usuario: '',
        imagen: '', genero: 'N',
        email: '', rol: '', descripcion: '',
    },
    token: '',
    headercolor: '',
}

export default withRouter(Header)

