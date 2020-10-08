
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import web from '../utils/services';

import {withRouter, Link} from 'react-router-dom';

import { notification, Dropdown, Menu, message, Badge } from 'antd';
import 'antd/dist/antd.css';

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible_perfil: false,
            visible_notificacion: false,
        };
    }

    onAjuste(event) {
        event.preventDefault();
        this.props.history.push( web.serv_link + '/ajuste');
    }

    onShowPedido(data) {

        axios.get( web.servidor + '/usuario/update_notificacion/' + data.id).then(
            (response) => {
                if (response.data.response == -3) {
                    this.onLogout();
                    return;
                }
                if (response.data.response == 1) {
                    this.props.desactivarnotificacion(response.data.notificacion)
                    this.setState({
                        visible_notificacion: false,
                    }, () => {
                        setTimeout(() => {
                            if (this.props.idrol == 1 || this.props.idrol == 2) {
                                this.props.history.push( web.serv_link + '/solicitud_pedido/show/' + data.idsolicitud);
                                return;
                            }
                            if (this.props.idrol == 4) {
                                this.props.history.push( web.serv_link + '/mysolicitud_asignado/show/' + data.idsolicitud);
                                return;
                            }
                            this.props.history.push( web.serv_link + '/mysolicitud_pedido/show/' + data.idsolicitud);
                                return;
                        }, 500);
                    });
                    return;
                }
                notification.error({
                    description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
                    zIndex: 1200,
                });
            }
        ).catch( error => {
            notification.error({
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
                zIndex: 1200,
            });
        } );
    }

    render() {

        var usuario = this.props.usuario;

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

        const menunotificacion = (
            <div className="dropdown-menu-xl rm-pointers dropdown-menu dropdown-menu-right show" style={{display: 'block'}}>
                <div className="dropdown-menu-header mb-0">
                    <div className="dropdown-menu-header-inner bg-deep-blue">
                        <div className="menu-header-image opacity-1" style={{backgroundImage: "url('/assets/images/dropdown-header/city3.jpg')"}}></div>
                        <div className="menu-header-content text-dark">
                            <h5 className="menu-header-title">Notificatión</h5>
                            <h6 className="menu-header-subtitle"> Tienes <b> {this.props.notificacion.length} </b> mensajes</h6>
                        </div>
                    </div>
                </div>
                <div className="tab-content">
                    <div className="tab-pane active" id="tab-messages-header" role="tabpanel">
                        <div className="scroll-area-sm">
                            <div className="scrollbar-container">
                                <div className="p-3">
                                    <div className="notifications-box">
                                        <div className="vertical-time-simple vertical-without-time vertical-timeline vertical-timeline--one-column">

                                            {this.props.notificacion.map(
                                                (data, key) => (
                                                    <div key={key} className="vertical-timeline-item dot-primary vertical-timeline-element">
                                                        <div><span className="vertical-timeline-element-icon bounce-in"></span>
                                                            <div className="vertical-timeline-element-content bounce-in">
                                                                <h4 className="timeline-title"> 
                                                                    {data.mensaje} 
                                                                    <span className="badge badge-success ml-2" style={{cursor: 'pointer',}}
                                                                        onClick={this.onShowPedido.bind(this, data)}
                                                                    >
                                                                        IR AL PEDIDO
                                                                    </span>
                                                                </h4>
                                                                <p> {data.fecha} - <span className="text-success"> {data.hora}</span></p>
                                                                <span className="vertical-timeline-element-date"></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            )}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ul className="nav flex-column">
                    <li className="nav-item-divider nav-item"></li>
                    <li className="nav-item-btn text-center nav-item">
                        <button className="btn-shadow btn-wide btn-pill btn btn-focus btn-sm">
                            Ver Todos los Mensajes
                        </button>
                    </li>
                </ul>
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

                    </div>

                    <div className="app-header-right">
                        
                        <div className="header-dots">
      
                            <Dropdown overlay={menunotificacion} trigger={['click']} 
                                visible={this.state.visible_notificacion}
                                onVisibleChange={ () => this.setState({visible_notificacion: !this.state.visible_notificacion}) }
                            >
                                <Badge count={this.props.notificacion.length} overflowCount={999}>
                                    <button type="button" className="p-0 mr-2 btn btn-link">
                                        <span className="icon-wrapper icon-wrapper-alt rounded-circle">
                                            <span className="icon-wrapper-bg bg-danger"></span>
                                            <i className="icon text-danger icon-anim-pulse ion-android-notifications"></i>
                                            <span className="badge badge-dot badge-dot-sm badge-danger">Notificacion</span>
                                        </span>
                                    </button>
                                </Badge>
                            </Dropdown>
                        </div>
                        
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
    notificacion: PropTypes.array,
    idrol: PropTypes.any,
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
    notificacion: [],
    idrol: null,
}

export default withRouter(Header)

