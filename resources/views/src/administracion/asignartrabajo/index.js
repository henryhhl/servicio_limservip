
import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

import { notification, Card, Modal, message, Popover } from 'antd';
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
            
            select_informacion: null,
            select_solicitud: [],

            array_personal: [],
            personal_page: 0,
            img_personal: '',
            isOpenPersonal: false,

            productodetalle: {
                id: null, servicio: null, descripcion: null, cantidad: null, precio: null,
                imagen: null, categoria: null,
            },
            visible_producto: false,
            isOpenproducto: false,
            imagenproducto: '',
            
            descripcion: '',
            error_descripcion: '',
            error_servicio: '',
        }
    }
    componentDidMount() {
        this.props.get_link('asignar_trabajo', true);
        this.get_data();
    }
    get_data() {
        axios.get( web.servidor + '/asignar_trabajo/index').then(
            (response) => {
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        this.props.loadingservice(false, '');
                        this.setState({
                            array_personal: response.data.data,
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
            if (error.response.status == 401) {
                this.setState({ auth: true, });
            }
        } );
    }
    onBack() {
        this.props.history.goBack();
    }
    onValidar() {
        if (this.state.select_solicitud.length == 0) {
            notification.error({
                description: 'FAVOR DE SELECCIONAR SOLICITUD. DAR CLICK AL VER SOLICITUD PARA SELECCIONAR.',
            });
        }
        for (let index = 0; index < this.state.select_solicitud.length; index++) {
            var data = this.state.select_solicitud[index];
            var cantidad = 0;
            for (let j = 0; j < data.array_personal.length; j++) {
                var element = data.array_personal[j];
                if (!element.value) {
                    cantidad++;
                }
            }
            if (cantidad == data.array_personal.length) {
                notification.error({
                    description: 'FAVOR DE ASIGNAR PERSONAL EN EL SERVICIO ' + data.servicio,
                });
                return;
            }
        }
        this.onSesion();
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
        formdata.append('array_servicio', JSON.stringify(this.state.select_solicitud));

        axios(
            {
                method: 'post',
                url: web.servidor + '/asignar_trabajo/asignar',
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
                console.log(response.data)
                if (response.data.response == 1) {
                    notification.success({
                        description: 'ASIGNACIÓN DE PERSONAL REGISTRADO EXITOSAMENTE',
                    });
                    this.get_data();
                    this.setState({
                        select_informacion: null,
                        select_solicitud: [],
                    });
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
            console.log(error)
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
            select_solicitud: data.servicios,
            select_informacion: data,
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
    onModalProductoDetalle() {
        if (this.state.productodetalle.id == null) return null;
        return (
            <Modal
                title={null} footer={null}
                visible={this.state.visible_producto}
                onCancel={() => this.setState({ visible_producto: false, })}
                bodyStyle={{padding: 0, paddingTop: 5, paddingBottom: 5,}}
                width={400}
            >
                { (this.state.isOpenproducto && this.state.imagenproducto != '' && this.state.imagenproducto != null) ? 
                    <Lightbox
                        mainSrc={this.state.imagenproducto}
                        onCloseRequest={() => this.setState({ isOpenproducto: false, imagenproducto: '', })}
                    />
                    : null 
                }
                <div className="forms-groups" style={{ display: 'flex', justifyContent: 'center', }}>
                    <div className="col-sm-12">
                        <div className="card-hover-shadow-2x mb-3 card">
                            <div className="card-header-tab card-header">
                                <div className="card-header-title font-size-lg text-capitalize font-weight-normal">
                                    <i className="header-icon lnr-database icon-gradient bg-malibu-beach"> </i>
                                    DETALLE DE SERVICIO
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
                                                                { (this.state.productodetalle.imagen == null || this.state.productodetalle.imagen == '')  ?
                                                                    <img width="42" className="rounded" src="/images/anonimo.jpg" alt="" /> :
                                                                    <img width="65" height="55" className="rounded" src={this.state.productodetalle.imagen} alt="" 
                                                                        onClick={() => this.setState({ isOpenproducto: true, imagenproducto: this.state.productodetalle.imagen, })} style={{cursor: 'pointer',}}
                                                                    /> 
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="widget-content-left">
                                                            <div className="widget-heading">
                                                                { this.state.productodetalle.servicio }
                                                            </div>
                                                            <div className="widget-subheading">
                                                                { this.state.productodetalle.categoria }
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
                                                                { this.state.productodetalle.precio }
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
                                                            <textarea className="widget-subheading" readOnly value={this.state.productodetalle.descripcion} 
                                                                style={{width: '100%', height: 150, outline: 'none', maxHeight: 300, padding: 5, paddingLeft: 10, }}
                                                            />
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
                {this.onModalProductoDetalle()}
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
                                            {this.state.select_solicitud.map((data, key) => {
                                                if (typeof this.state.select_solicitud[key].array_personal == 'undefined') {
                                                    this.state.select_solicitud[key].array_personal = [];
                                                }
                                                return (
                                                    <tr key={key}>
                                                        <td style={{cursor: 'default', textAlign: 'left', paddingLeft: 10, 
                                                            fontWeight: 'bold', color: '#1890ff',  
                                                        }}>
                                                            <label className='cols_show'>SERVICIO: </label>
                                                            <label style={{borderBottom: '1px dashed #1890ff', cursor: 'pointer',}}
                                                                onClick={ () => this.setState({productodetalle: data, }, () => setTimeout(() => {
                                                                    this.setState({visible_producto: true,})
                                                                }, 800)) }
                                                            >
                                                                {data.servicio} <i className="fa fa-eye"></i>
                                                            </label>
                                                        </td>
                                                        <td style={{cursor: 'default', textAlign: 'left', paddingLeft: 10, 
                                                            fontWeight: 'bold', color: '#1890ff', 
                                                        }}>
                                                            <label className='cols_show'>CANTIDAD: </label>
                                                            
                                                            <a style={{ paddingLeft: 4, paddingRight: 4, }}>
                                                                <label style={{paddingLeft: 3, paddingRight: 3,}}>{data.cantidad}</label>
                                                            </a>
                                                        </td>
                                                        <td style={{cursor: 'default', textAlign: 'left', paddingLeft: 10, 
                                                            fontWeight: 'bold', color: '#1890ff', 
                                                        }}>
                                                            <label className='cols_show'>PRECIO: </label>
                                                            {data.precio}
                                                        </td>
                                                        <td style={{cursor: 'default', textAlign: 'left', paddingLeft: 10, 
                                                            fontWeight: 'bold', color: '#1890ff', 
                                                        }}>
                                                            <label className='cols_show'>NOTA: </label>
                                                            <Popover placement='top' trigger='click'
                                                                content={
                                                                    <div>
                                                                        <div style={{textAlign: 'center', paddingBottom: 5,}}>
                                                                            <div className='inputs-groups' style={{width: 200, }}>
                                                                                <textarea type='text' placeholder=''
                                                                                    className={`forms-control`} 
                                                                                    style={{paddingRight: 25, color: '#1890ff', paddingTop: 5, height: 80, background: '#e8e8e8' }}
                                                                                    value={data.nota == null ? '' : data.nota}
                                                                                    readOnly
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                } 
                                                                title='NOTA'
                                                            >
                                                                <a style={{color: 'blue', fontSize: 12, paddingLeft: 4, paddingRight: 4, border: '1px dashed blue' ,}}>
                                                                    {'VER NOTA'}
                                                                </a>
                                                            </Popover>
                                                        </td>
                                                        <td style={{cursor: 'default', textAlign: 'left', paddingLeft: 10, 
                                                            fontWeight: 'bold', color: '#1890ff', 
                                                        }}>
                                                            <label className='cols_show'>SUBTOTAL: </label>
                                                            {data.cantidad * data.precio}
                                                        </td>
                                                        <td style={{cursor: 'default', textAlign: 'left', paddingLeft: 10, 
                                                            fontWeight: 'bold', color: '#1890ff', 
                                                        }}>
                                                            <label className='cols_show'>ASIGNAR PERSONAL: </label>
                                                            <Popover placement='top' trigger='click'
                                                                content={
                                                                    <div className="card" style={{width: 320,}}>
                                                                        <div>
                                                                            <div className="bg-white">
                                                                                <div className="table-responsive">
                                                                                    <table className="text-nowrap table-lg mb-0 table table-hover">
                                                                                        <tbody>
                                                                                            {this.state.array_personal.map(
                                                                                                (personal, i) => {
                                                                                                    if (typeof this.state.select_solicitud[key].array_personal[i] == 'undefined') {
                                                                                                        this.state.select_solicitud[key].array_personal[i] = {
                                                                                                            value: false, id: personal.id,
                                                                                                        };
                                                                                                    }
                                                                                                    return (
                                                                                                    <tr key={i} onClick={() => {
                                                                                                        for (let j = 0; j < this.state.select_solicitud.length; j++) {
                                                                                                            var select = this.state.select_solicitud[j];
                                                                                                            if (key != j) {
                                                                                                                for (let k = 0; k < select.array_personal.length; k++) {
                                                                                                                    var solicitud = select.array_personal[k];
                                                                                                                    if (solicitud.id == this.state.select_solicitud[key].array_personal[i].id) {
                                                                                                                        if (solicitud.value) {
                                                                                                                            message.warning('EL PERSONAL HA SIDO SELECCIONADO.');
                                                                                                                            return;
                                                                                                                        }
                                                                                                                        break;
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                        this.state.select_solicitud[key].array_personal[i].value = !this.state.select_solicitud[key].array_personal[i].value;
                                                                                                        this.setState({select_solicitud: this.state.select_solicitud,})
                                                                                                    }}>
                                                                                                        <td className="text-center" style={{width: 30,}}>
                                                                                                            <div className="custom-checkbox custom-control">
                                                                                                                <input type="checkbox" 
                                                                                                                    checked={ this.state.select_solicitud[key].array_personal[i].value}
                                                                                                                    className="custom-control-input" 
                                                                                                                    readOnly
                                                                                                                />
                                                                                                                <label className="custom-control-label">&nbsp;</label>
                                                                                                            </div>
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            <div className="widget-content p-0">
                                                                                                                <div className="widget-content-wrapper">
                                                                                                                    <div className="widget-content-left mr-3">
                                                                                                                        {(personal.imagen == null || personal.imagen == '') ?
                                                                                                                            <img width="42" className="rounded-circle" src="/images/anonimo.jpg" alt="" />:
                                                                                                                            <img width="42" className="rounded-circle" src={personal.imagen} alt="" />
                                                                                                                        }
                                                                                                                    </div>
                                                                                                                    <div className="widget-content-left">
                                                                                                                        <div className="widget-heading">
                                                                                                                            {personal.nombre} {personal.apellido}
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                )}
                                                                                            )}
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                } 
                                                                title='ASIGNAR PERSONAL'
                                                            >
                                                                <a style={{color: 'blue', fontSize: 12, paddingLeft: 4, paddingRight: 4, border: '1px dashed blue' ,}}>
                                                                    {'AGREGAR PERSONAL'}
                                                                </a>
                                                            </Popover>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            <tr>
                                                <td colSpan="5" style={{textAlign: 'right', paddingRight: 20,}}>
                                                    TOTAL: 
                                                </td>
                                                <td style={{cursor: 'default', textAlign: 'right', paddingRight: 20, 
                                                    fontWeight: 'bold', color: '#1890ff', 
                                                }}>
                                                    {this.state.select_informacion == null ? '0.00' : this.state.select_informacion.montototal}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {this.state.select_informacion == null ? null :
                                <div className="forms-groups">
                                    <div className='cols-lg-6 cols-md-6 cols-sm-12' style={{border: '1px solid #e8e8e8'}}>
                                        <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12' style={{paddingTop: 0,}}>
                                            <div className='inputs-groups'>
                                                <input type='text' readOnly
                                                    className={`forms-control title_form ${this.props.buttoncolor}`} value={'Nro Solicitud'}
                                                />
                                            </div>
                                        </div>
                                        <div className='cols-lg-8 cols-md-8 cols-sm-8 cols-xs-12' style={{paddingTop: 0, }}>
                                            <div className='inputs-groups'>
                                                <input type='text'
                                                    style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                    className={`forms-control`}
                                                    value={this.state.select_informacion.id}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12' style={{paddingTop: 0,}}>
                                            <div className='inputs-groups'>
                                                <input type='text' readOnly
                                                    className={`forms-control title_form ${this.props.buttoncolor}`} value={'Cliente'}
                                                />
                                            </div>
                                        </div>
                                        <div className='cols-lg-8 cols-md-8 cols-sm-8 cols-xs-12' style={{paddingTop: 0, }}>
                                            <div className='inputs-groups'>
                                                <input type='text'
                                                    style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                    className={`forms-control`}
                                                    value={this.state.select_informacion.nombre + ' ' + this.state.select_informacion.apellido}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12' style={{paddingTop: 0,}}>
                                            <div className='inputs-groups'>
                                                <input type='text' readOnly
                                                    className={`forms-control title_form ${this.props.buttoncolor}`} value={'Dirección'}
                                                />
                                            </div>
                                        </div>
                                        <div className='cols-lg-8 cols-md-8 cols-sm-8 cols-xs-12' style={{paddingTop: 0, }}>
                                            <div className='inputs-groups'>
                                                <input type='text'
                                                    style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                    className={`forms-control`}
                                                    value={this.state.select_informacion.direccioncompleto}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </Card>

                        <div className='forms-groups txts-center mt-4'>
                            <button className={"mb-2 mr-2 btn-hover-shine btn btn-" + colorsuccess + ' float-right'}
                                onClick={this.onValidar.bind(this)}
                            >
                                ASIGNAR
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
