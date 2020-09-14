
import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

import { notification, Card, Modal } from 'antd';
import 'antd/dist/antd.css';
import web from '../../utils/services';

import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

import PropTypes from 'prop-types';

class ShowServicio extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            nombre: '',
            apellido: '',
            precio: '',
            descripcion: '',
            imagen: '',
            
        }
    }
    componentDidMount() {
        this.props.get_link('servicio', true);
        this.get_data();
    }
    get_data() {
        axios.get( web.servidor + '/servicio/show/' + this.props.match.params.id).then(
            (response) => {
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        this.props.loadingservice(false, '');
                        this.setState({
                            nombre: response.data.data.nombre,
                            precio: response.data.data.precio,
                            descripcion: response.data.data.descripcion == null ? '' : response.data.data.descripcion,
                            imagen: response.data.data.imagen == null ? '' : response.data.data.imagen,
                        });
                        return;
                    }
                }
                if (response.status == 401) {
                    this.setState({ auth: true, });
                }
                Modal.error({
                    title: 'ERROR DE COMUNICACIÓN',
                    content: (
                        <div>
                            <p>Ha habido un error de comunicación</p>
                            <p>Favor de intentar nuevamente</p>
                        </div>
                    ),
                    onOk: () => this.get_data(),
                    zIndex: 1500,
                    centered: true,
                });
            }
        ).catch( error => {
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
                zIndex: 1200,
            });
            Modal.error({
                title: 'ERROR DE COMUNICACIÓN',
                content: (
                    <div>
                        <p>Ha habido un error de comunicación</p>
                        <p>Favor de intentar nuevamente</p>
                    </div>
                ),
                onOk: () => this.get_data(),
                zIndex: 1500,
                centered: true,
            });
        } );
    }
    onBack() {
        this.props.history.goBack();
    }
    render() {
        var colorback = this.props.buttoncolor == '' ? 'focus' : this.props.buttoncolor;
        return (
            <div className="rows">
                <div className="cards">
                    { (this.state.isOpen && this.state.imagen != '') ? 
                        <Lightbox
                            mainSrc={this.state.imagen}
                            onCloseRequest={() => this.setState({ isOpen: false })}
                        />
                        : null 
                    }
                    <div className='forms-groups'>
                        <Card
                            style={{ width: '100%', minWidth: '100%', }}
                            title="DETALLE DEL SERVICIO"
                            headStyle={{fontSize: 14, }}
                            bodyStyle={{padding: 4, paddingTop: 0, }}
                            extra={ <button className={"btn-wide btn-outline-2x mr-md-2 btn-sm btn btn-outline-" + colorback}
                                    onClick={this.onBack.bind(this)}
                                >
                                    Atras
                                </button> 
                            }
                        >
                            <div className='forms-groups' style={{ display: 'flex', justifyContent: 'center', }}>
                                <div className="col-sm-12 col-lg-6">
                                    <div className="card-hover-shadow-2x mb-3 card">
                                        <div className="card-header-tab card-header">
                                            <div className="card-header-title font-size-lg text-capitalize font-weight-normal">
                                                <i className="header-icon lnr-database icon-gradient bg-malibu-beach"> </i>
                                                DATOS DE {this.state.nombre.toUpperCase()}
                                            </div>
                                        </div>
                                        <div className="scroll-area-lg">
                                            <div className="scrollbar-container">
                                                <div className="p-2">
                                                    <ul className="todo-list-wrapper list-group list-group-flush">
                                                        <li className="list-group-item">
                                                            <div className="todo-indicator bg-success"></div>
                                                            <div className="widget-content p-0">
                                                                <div className="widget-content-wrapper">
                                                                    <div className="widget-content-left mr-3">
                                                                        <div className="widget-content-left">
                                                                            { (this.state.imagen == null || this.state.imagen == '')  ?
                                                                                <img width="42" className="rounded" src="/images/anonimo.jpg" alt="" /> :
                                                                                <img width="65" height="55" className="rounded" src={this.state.imagen} alt="" 
                                                                                    onClick={() => this.setState({ isOpen: true })} style={{cursor: 'pointer',}}
                                                                                /> 
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <div className="widget-content-left">
                                                                        <div className="widget-heading">
                                                                            { this.state.nombre }
                                                                        </div>
                                                                        <div className="widget-subheading">
                                                                            { ' - ' }
                                                                        </div>
                                                                    </div>
                                                                    <div className="widget-content-right widget-content-actions">
                                                                        <button className="border-0 btn-transition btn btn-outline-success">
                                                                            <i className="fa fa-check"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li className="list-group-item">
                                                            <div className="todo-indicator bg-primary"></div>
                                                            <div className="widget-content p-0">
                                                                <div className="widget-content-wrapper">
                                                                    <div className="widget-content-left flex2">
                                                                        <div className="widget-heading">Precio</div>
                                                                        <div className="widget-subheading">
                                                                            { this.state.precio }
                                                                        </div>
                                                                    </div>
                                                                    <div className="widget-content-right widget-content-actions">
                                                                        <button className="border-0 btn-transition btn btn-outline-success">
                                                                            <i className="fa fa-check"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li className="list-group-item">
                                                            <div className="todo-indicator bg-primary"></div>
                                                            <div className="widget-content p-0">
                                                                <div className="widget-content-wrapper">
                                                                    <div className="widget-content-left flex2">
                                                                        <div className="widget-heading">Descripción</div>
                                                                        <textarea className="widget-subheading" readOnly value={this.state.descripcion} 
                                                                            style={{width: '100%', height: 150, outline: 'none', maxHeight: 300, padding: 5, paddingLeft: 10, }}
                                                                        />
                                                                    </div>
                                                                    <div className="widget-content-right widget-content-actions">
                                                                        <button className="border-0 btn-transition btn btn-outline-success">
                                                                            <i className="fa fa-check"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }
}

ShowServicio.propTypes = {
    buttoncolor: PropTypes.string,
}

ShowServicio.defaultProps = {
    buttoncolor: '',
}

export default withRouter(ShowServicio);
