
import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

import { notification, Card, Modal, message } from 'antd';
import 'antd/dist/antd.css';
import web from '../../utils/services';

import PropTypes from 'prop-types';

import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

class AsignarTrabajo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            auth: false,
            loading: false,
            visible_solicitud: false,
            visible_personal: false,

            array_solicitud: [],
            solicitud_page: 0,
            
            select_solicitud: [],

            array_personal: [],
            personal_page: 0,
            img_personal: '',
            isOpenPersonal: false,
            
            descripcion: '',
            error_descripcion: '',
            error_servicio: '',
        }
    }
    componentDidMount() {
        this.props.get_link('categoria', true);
        this.get_data();
    }
    get_data() {
        axios.get( web.servidor + '/categoria/create').then(
            (response) => {
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        this.props.loadingservice(false, '');
                        this.setState({ });
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
            if (error.response.status == 401) {
                this.setState({ auth: true, });
            }
        } );
    }
    onBack() {
        this.props.history.goBack();
    }
    onValidar() {
        if ( this.state.descripcion.toString().trim().length > 0) {
            this.onSesion();
        }else {
            if (this.state.descripcion.toString().trim().length == 0) {
                notification.error({
                    message: 'ERROR',
                    description: 'NOMBRE REQUERIDO.',
                });
                this.setState({ error_descripcion: 'error', });
                return;
            }
        }
    }
    onSesion() {
        this.setState({ loading: true, });
        axios.get( web.servidor + '/home/sesion')
        .then( response => {
            if (response.data.response == 1) {
                if (response.data.sesion) {
                    this.props.logout();
                    return;
                }
                this.onSubmit();
                return;
            }
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO. INTENTAR NUEVAMENTE.',
            });
            this.setState({ loading: false, });
        } ).catch( error => {
            this.setState({ loading: false, });
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
            });
        });
    }
    onSubmit() {
        this.setState({ loading: true, });

        var formdata = new FormData();
        formdata.append('descripcion', this.state.descripcion);

        axios(
            {
                method: 'post',
                url: web.servidor + '/categoria/store',
                data: formdata,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'enctype' : 'multipart/form-data',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                }
            }
        ).then(
            response => {
                this.setState({ loading: false, });
                if (response.data.response == 1) {
                    notification.success({
                        message: 'SUCCESS',
                        description: 'CATEGORIA CREADO EXITOSAMENTE',
                    });
                    this.props.history.goBack();
                    return;
                }
                if (response.data.response == -1) {
                    notification.error({
                        message: 'ERROR',
                        description: 'LA DESCRIPCION DE LA CATEGORIA YA EXISTE. FAVOR DE INGRESAR OTRA DESCRIPCION',
                    });
                    this.setState({ error_descripcion: 'error', });
                    return;
                }
                notification.error({
                    message: 'ERROR',
                    description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE INTENTAR.',
                });
            }
        ).catch( error => {
            this.setState({ loading: false, });
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
            });
        } );
    }
    onPersonal() {
        this.setState({loading: true,});
        axios.get( web.servidor + '/asignar_trabajo/get_personal').then(
            (response) => {
                this.setState({
                    loading: false,
                });

                if (response.data.response == -3) {
                    this.props.logout();
                    return;
                }
                if (response.data.response == 1) {
                    
                    this.setState({
                        array_personal: response.data.data,
                    }, () => {
                        setTimeout(() => {
                            this.setState({visible_personal: true,});
                        }, 600);
                    });
                    return;
                }
                notification.error({
                    description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
                    zIndex: 1200,
                });
            }
        ).catch( error => {
            this.setState({
                loading: false,
            });
            notification.error({
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
                zIndex: 1200,
            });
        } );
    }
    OnSolicitudPedido() {
        this.setState({loading: true,});
        axios.get( web.servidor + '/solicitud/get_solicitudpendiente').then(
            (response) => {
                this.setState({
                    loading: false,
                });
                if (response.data.response == -3) {
                    this.props.logout();
                    return;
                }
                if (response.data.response == 1) {
                    this.setState({
                        array_solicitud: response.data.solicitud,
                    }, () => {
                        setTimeout(() => {
                            this.setState({visible_solicitud: true,});
                        }, 600);
                    });
                    return;
                }
                notification.error({
                    description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
                    zIndex: 1200,
                });
            }
        ).catch( error => {
            this.setState({
                loading: false,
            });
            notification.error({
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
                zIndex: 1200,
            });
        } );
    }
    componentLoading() {
        return (
            <Modal
                title="Cargando Informacion"
                centered closable={ false }
                visible={this.state.loading}
                footer={ null } bodyStyle={{ padding: 2, }}
                >
                <div className='forms-groups'>
                    <div className="loader-wrapper d-flex justify-content-center align-items-center" style={{width: '100%'}}>
                        <div className="loader">
                            <div className="ball-clip-rotate-multiple">
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                    <p style={{ textAlign: 'center', }}>LOADING...</p>
                </div>
            </Modal>
        );
    }
    onSelectSolicitud(data) {
        console.log(data)
        this.setState({
            select_solicitud: data,
            visible_solicitud: false,
        });
    }
    componentSolictudPedido() {
        return (
            <Modal
                title={null} footer={null}
                visible={this.state.visible_solicitud}
                onCancel={() => this.setState({ visible_solicitud: false, })}
                bodyStyle={{padding: 0, paddingTop: 5, paddingBottom: 5,}}
                width={450}
            >
                <div className="forms-groups" style={{ display: 'flex', justifyContent: 'center', }}>
                    <div className="col-sm-12">
                        <div className="card-hover-shadow-2x mb-3 mt-4 card">
                            <div className="card-header-tab card-header">
                                <div className="card-header-title font-size-lg text-capitalize font-weight-normal">
                                    <i className="header-icon lnr-database icon-gradient bg-malibu-beach"> </i>
                                    LISTADO DE SOLICITUDES PENDIENTES
                                </div>
                            </div>
                            <div className="scroll-area-lg">
                                <div className="scrollbar-container">
                                    <div className="p-2">
                                        <ul className="todo-list-wrapper list-group list-group-flush">
                                            {this.state.array_solicitud.map(
                                                (data, key) => (
                                                    <li className="list-group-item" key={key}>
                                                        <div className="todo-indicator bg-success"></div>
                                                        <div className="widget-content p-0">
                                                            <div className="widget-content-wrapper">
                                                                <div className="widget-content-left">
                                                                    <div className="widget-heading">
                                                                        Nro Solcitud
                                                                        <div className="badge badge-primary ml-2">
                                                                            {data.id}
                                                                        </div>
                                                                    </div>
                                                                    <div className="widget-heading">
                                                                        Cliente:
                                                                        <div className="badge ml-2">
                                                                            {data.nombre + ' ' + data.apellido}
                                                                        </div>
                                                                    </div>
                                                                    <div className="widget-heading">
                                                                        Monto Total:
                                                                        <div className="badge ml-2">
                                                                            {data.montototal}
                                                                        </div>
                                                                    </div>
                                                                    <div className="widget-subheading">
                                                                        {data.servicios.map(
                                                                            (element, i) => (
                                                                                <label key={i} style={{marginLeft: 2,}}>
                                                                                    {element.servicio},
                                                                                </label>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="widget-content-right">
                                                                    <button className="btn btn-outline-success"
                                                                        onClick={this.onSelectSolicitud.bind(this, data)}
                                                                    >
                                                                        <i className="fa fa-check"></i>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
    componentPersonal() {
        return (
            <Modal
                title={null} footer={null}
                visible={this.state.visible_personal}
                onCancel={() => this.setState({ visible_personal: false, })}
                bodyStyle={{padding: 0, paddingTop: 5, paddingBottom: 5,}}
                width={450}
            >
                <div className="forms-groups" style={{ display: 'flex', justifyContent: 'center', }}>
                    { (this.state.isOpenPersonal && this.state.img_personal != '' && this.state.img_personal != null) ? 
                        <Lightbox
                            mainSrc={this.state.img_personal}
                            onCloseRequest={() => this.setState({ isOpenPersonal: false, img_personal: '', })}
                        />
                        : null 
                    }
                    <div className="col-sm-12">
                        <div className="card-hover-shadow-2x mb-3 mt-4 card">
                            <div className="card-header-tab card-header">
                                <div className="card-header-title font-size-lg text-capitalize font-weight-normal">
                                    <i className="header-icon lnr-database icon-gradient bg-malibu-beach"> </i>
                                    PERSONAL DE LIMPIEZA
                                </div>
                            </div>
                            <div className="scroll-area-lg">
                                <div className="scrollbar-container">
                                    <div className="p-2">
                                        <ul className="todo-list-wrapper list-group list-group-flush">
                                            {this.state.array_personal.map(
                                                (data, key) => (
                                                    <li className="list-group-item" key={key}>
                                                        <div className="todo-indicator bg-success"></div>
                                                        <div className="widget-content p-0">
                                                            <div className="widget-content-wrapper">
                                                                <div className="widget-content-left mr-3">
                                                                    <div className="widget-content-left">
                                                                        { (data.imagen == null || data.imagen == '')  ?
                                                                            <img width="42" className="rounded" src="/images/anonimo.jpg" alt="" /> :
                                                                            <img width="65" height="55" className="rounded" src={data.imagen} alt="" 
                                                                                onClick={() => this.setState({ img_personal: data.imagen }, 
                                                                                () => setTimeout(() => {
                                                                                    this.setState({isOpenPersonal: true, })
                                                                                }, 500))} 
                                                                                style={{cursor: 'pointer',}}
                                                                            /> 
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className="widget-content-left">
                                                                    <div className="widget-heading">
                                                                        { data.nombre + ' ' + data.apellido }
                                                                    </div>
                                                                    <div className="widget-heading">
                                                                        CI:
                                                                        <div className="badge badge-primary ml-2">
                                                                            {data.ci == null ? '-' : data.ci}
                                                                        </div>
                                                                    </div>
                                                                    <div className="widget-subheading">
                                                                        { data.email == null ? '-' : data.email }
                                                                    </div>
                                                                </div>
                                                                <div className="widget-content-right">
                                                                    { (data.cantidad * 1 > 0) ? 
                                                                        <div className="badge badge-danger ml-2">
                                                                            ASIGNADO
                                                                        </div>
                                                                    : 
                                                                        <div className="badge badge-success ml-2">
                                                                            LIBRE
                                                                        </div>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
    render() {
        var colorsuccess = this.props.buttoncolor == '' ? 'primary' : this.props.buttoncolor;
        var colordanger = this.props.buttoncolor == '' ? 'danger' : 'outline-' + this.props.buttoncolor;
        var colorback = this.props.buttoncolor == '' ? 'focus' : this.props.buttoncolor;
        return (
            <div className="rows">
                {this.componentLoading()}
                {this.componentSolictudPedido()}
                {this.componentPersonal()}
                <div className="cards">

                    <div className='forms-groups'>
                        <Card
                            style={{ width: '100%', minWidth: '100%', }}
                            title="ASIGNAR TRABAJO"
                            headStyle={{fontSize: 14, }}
                            bodyStyle={{padding: 4, paddingTop: 0, }}
                            extra={ <button className={"btn-wide btn-outline-2x mr-md-2 btn-sm btn btn-outline-" + colorback}
                                onClick={this.onPersonal.bind(this)}
                            >
                                VER PERSONAL
                            </button> 
                        }
                        >
                            <div className="forms-groups">
                                <div className='cols-lg-4 cols-md-4 cols-sm-4'></div>
                                <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12'>
                                    <div className='inputs-groups d-flex justify-content-center'>
                                        <button className={"btn-wide btn-outline-2x mr-md-2 btn-sm btn btn-outline-" + colorback}
                                            onClick={this.OnSolicitudPedido.bind(this)}
                                        >
                                            VER SOLICITUD
                                        </button> 
                                    </div>
                                </div>
                            </div>
                            <div className='forms-groups'>
                                <div className="tabless" 
                                    style={{ overflowY: 'auto', overflowX: 'none', maxHeight: 400, 
                                        border: `2px solid ${this.state.error_servicio == '' ? 'transparent' : 'red'}` 
                                    }}
                                >
                                    <table className="tables-respons">
                                        <thead>
                                            <tr>
                                                <td className={`title_form ${this.props.buttoncolor}`}>SERVICIO</td>
                                                <td className={`title_form ${this.props.buttoncolor}`}>CANTIDAD</td>
                                                <td className={`title_form ${this.props.buttoncolor}`}>PRECIO</td>
                                                <td className={`title_form ${this.props.buttoncolor}`}>NOTA</td>
                                                <td className={`title_form ${this.props.buttoncolor}`}>SUBTOTAL</td>
                                                <td className={`title_form ${this.props.buttoncolor}`}>ASIGNAR PERSONAL</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.select_solicitud.map((data, key) => {})}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </Card>

                        <div className='forms-groups txts-center mt-4'>
                            <button className={"mb-2 mr-2 btn-hover-shine btn btn-" + colorsuccess}
                                onClick={this.onValidar.bind(this)}
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

AsignarTrabajo.propTypes = {
    buttoncolor: PropTypes.string,
}

AsignarTrabajo.defaultProps = {
    buttoncolor: '',
}

export default withRouter(AsignarTrabajo);
