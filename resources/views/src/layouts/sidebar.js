
import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import web from '../utils/services';

import { isPermission } from '../utils/functions';
import permissions from '../utils/permisions';

export default class Sidebar extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className={"app-sidebar sidebar-shadow " + this.props.sidebarcolor} style={{width: '200px !important',}}>
                <div className="app-header__logo">
                    <div className="logo-src"></div>
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

                <div className="scrollbar-sidebar">
                    <div className="app-sidebar__inner">
                        
                        <ul className="vertical-nav-menu">
                            <li className={"app-sidebar__heading" + ' ' + this.props.sizetext}>inicio</li>

                            <li>
                                <Link to={ web.home + '/home'} onClick={this.props.init} 
                                    className={this.props.link_active.home + ' ' + this.props.sizetext}
                                >
                                    <i className="metismenu-icon">
                                    </i>HOME
                                </Link>
                            </li>

                            <li>
                                <Link to={ web.serv_link + '/perfil'} onClick={this.props.init} 
                                    className={this.props.link_active.perfil + ' ' + this.props.sizetext}
                                >
                                    <i className="metismenu-icon">
                                    </i>MI PERFIL
                                </Link>
                            </li>
                            <li>
                                <Link to={ web.serv_link + '/ajuste'} onClick={this.props.init} 
                                    className={this.props.link_active.ajuste + ' ' + this.props.sizetext}
                                >
                                    <i className="metismenu-icon">
                                    </i> AJUSTE
                                </Link>
                            </li>
                            
                            <li className={"app-sidebar__heading" + ' ' + this.props.sizetext}>MÓDULO</li>
                            
                            { isPermission(this.props.permisos_habilitados, permissions.paqueteseguridad) ?
                                <li className={this.props.menu_active.seguridad}>
                                    <a href="#">
                                        <i className="fa fa-clone pe-7s-rocket"></i>
                                            <label className={this.props.sizetext}> SEGURIDAD </label>
                                        <i className="metismenu-state-icon pe-7s-angle-down fa fa-angle-double-down"></i>
                                    </a>
                                    <ul>
                                        { isPermission(this.props.permisos_habilitados, permissions.gestionarusuario) ?
                                            <li>
                                                <Link to={ web.serv_link + '/usuario'} onClick={this.props.init} 
                                                    className={this.props.link_active.usuario + ' ' + this.props.sizetext}
                                                >
                                                    <i className="metismenu-icon">
                                                    </i> Usuario
                                                </Link>
                                            </li> : null 
                                        }
                                        { isPermission(this.props.permisos_habilitados, permissions.gestionarrol) ?
                                            <li>
                                                <Link to={ web.serv_link + '/rol'} onClick={this.props.init} 
                                                    className={this.props.link_active.rol + ' ' + this.props.sizetext}
                                                >
                                                    <i className="metismenu-icon">
                                                    </i> Rol
                                                </Link>
                                            </li> : null 
                                        }
                                        { isPermission(this.props.permisos_habilitados, permissions.asignarpermiso) ?
                                            <li>
                                                <Link to={ web.serv_link + '/asignar_permiso'} onClick={this.props.init} 
                                                    className={this.props.link_active.asignar_permiso + ' ' + this.props.sizetext}
                                                >
                                                    <i className="metismenu-icon">
                                                    </i> Asignar Permiso
                                                </Link>
                                            </li> : null 
                                        }
                                    </ul>
                                </li> : null 
                            }

                            { isPermission(this.props.permisos_habilitados, permissions.paqueteadministracion) ?
                                <li className={this.props.menu_active.administracion}>
                                    <a href="#">
                                        <i className="fa fa-clone pe-7s-rocket"></i>
                                            <label className={this.props.sizetext}> ADMINISTRACION </label>
                                        <i className="metismenu-state-icon pe-7s-angle-down fa fa-angle-double-down"></i>
                                    </a>
                                    <ul>
                                        { isPermission(this.props.permisos_habilitados, permissions.gestionarpersonal) ?
                                            <li>
                                                <Link to={ web.serv_link + '/personal'} onClick={this.props.init} 
                                                    className={this.props.link_active.personal + ' ' + this.props.sizetext}
                                                >
                                                    <i className="metismenu-icon">
                                                    </i> Personal
                                                </Link>
                                            </li> : null 
                                        }
                                        { isPermission(this.props.permisos_habilitados, permissions.asignartrabajo) ?
                                            <li>
                                                <Link to={ web.serv_link + '/asignar_trabajo'} onClick={this.props.init} 
                                                    className={this.props.link_active.asignar_trabajo + ' ' + this.props.sizetext}
                                                >
                                                    <i className="metismenu-icon">
                                                    </i> Asignar Trabajo
                                                </Link>
                                            </li> : null 
                                        }
                                        { isPermission(this.props.permisos_habilitados, permissions.seguimientoshow) ?
                                            <li>
                                                <Link to={ web.serv_link + '/visualizar_seguimiento'} onClick={this.props.init} 
                                                    className={this.props.link_active.visualizar_seguimiento + ' ' + this.props.sizetext}
                                                >
                                                    <i className="metismenu-icon">
                                                    </i> Seguimiento
                                                </Link>
                                            </li> : null 
                                        }
                                    </ul>
                                </li> : null 
                            }

                            { isPermission(this.props.permisos_habilitados, permissions.paquetesolicitudservicio) ?

                                <li className={this.props.menu_active.servicio}>
                                    <a href="#" className={ this.props.sizetext }>
                                        <i className="fa fa-clone pe-7s-rocket"></i>
                                            <label className={this.props.sizetext}> SOLICITUD DE SERVICIO </label>
                                        <i className="metismenu-state-icon pe-7s-angle-down fa fa-angle-double-down"></i>
                                    </a>
                                    <ul>

                                        { isPermission(this.props.permisos_habilitados, permissions.gestionarcliente) ?
                                            <li>
                                                <Link to={ web.serv_link + '/cliente'} onClick={this.props.init} 
                                                    className={this.props.link_active.cliente + ' ' + this.props.sizetext}
                                                >
                                                    <i className="metismenu-icon">
                                                    </i> Cliente
                                                </Link>
                                            </li> : null 
                                        }

                                        { isPermission(this.props.permisos_habilitados, permissions.gestionarcategoria) ?
                                            <li>
                                                <Link to={ web.serv_link + '/categoria'} onClick={this.props.init} 
                                                    className={this.props.link_active.categoria + ' ' + this.props.sizetext}
                                                >
                                                    <i className="metismenu-icon">
                                                    </i> Categoria 
                                                </Link>
                                            </li> : null 
                                        }

                                        { isPermission(this.props.permisos_habilitados, permissions.gestionarservicio) ?
                                            <li>
                                                <Link to={ web.serv_link + '/servicio'} onClick={this.props.init} 
                                                    className={this.props.link_active.servicio + ' ' + this.props.sizetext}
                                                >
                                                    <i className="metismenu-icon">
                                                    </i> Servicio
                                                </Link>
                                            </li> : null 
                                        }

                                        { isPermission(this.props.permisos_habilitados, permissions.gestionarsolicitud) ?
                                            <li>
                                                <Link to={ web.serv_link + '/solicitud_pedido'} onClick={this.props.init} 
                                                    className={this.props.link_active.solicitud + ' ' + this.props.sizetext}
                                                >
                                                    <i className="metismenu-icon">
                                                    </i> Solictud Pedido
                                                </Link>
                                            </li> : null 
                                        }

                                        { isPermission(this.props.permisos_habilitados, permissions.generarreporte) ?
                                            <li>
                                                <Link to={ web.serv_link + '/generar_reporte'} onClick={this.props.init} 
                                                    className={this.props.link_active.generar_reporte + ' ' + this.props.sizetext}
                                                >
                                                    <i className="metismenu-icon">
                                                    </i> Reporte
                                                </Link>
                                            </li> : null 
                                        }
                                        
                                    </ul>
                                </li> : null 
                            }

                        { isPermission(this.props.permisos_habilitados, permissions.generarreporte) ?
                            <li>
                                <Link to={ web.serv_link + '/reporte_general'} onClick={this.props.init} 
                                    className={this.props.link_active.reporte + ' ' + this.props.sizetext}
                                >
                                    <i className="fa fa-clipboard"></i> REPORTE
                                </Link>
                            </li> : null 
                        }

                        </ul>
                    </div>
                </div>
            </div> 
        );
    }
}

Sidebar.propTypes = {
    menu_active: PropTypes.object,
    link_active: PropTypes.object,
    sidebarcolor: PropTypes.string,
    sizetext: PropTypes.string,
    permisos_habilitados: PropTypes.array,
}

Sidebar.defaultProps = {
    menu_active: {
        dashboards: '',
        seguridad: '',
        servicio: '',
        administracion: '',
    },
    link_active: {
        home: '',
        perfil: '',
        ajuste: '',
        reporte: '',
        
        usuario: '',
        rol: '',
        asignar_permiso: '',

        promocion: '',
        cliente: '',
        categoria: '',
        servicio: '',
        solicitud: '',
        generar_reporte: '',

        personal: '',
        asignar_trabajo: '',
        visualizar_seguimiento: '',
    },
    sidebarcolor: '',
    sizetext: '',
    permisos_habilitados: [],
}


