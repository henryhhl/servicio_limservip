
import React, { Component } from 'react';
import axios from 'axios';
import {withRouter, Redirect} from 'react-router-dom';

import { notification, Card, Modal, Popover, Button, Tag } from 'antd';
import 'antd/dist/antd.css';

import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

import web from '../../utils/services';

import PropTypes from 'prop-types';

import { GoogleMap, InfoWindow, Marker, withGoogleMap, withScriptjs } from "react-google-maps";

class ShowSolicitud extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isOpen: false,
            img_servicio: '',

            nropedido: 0,

            array_servicio: [],
            pagination_servicio: {
                'total': 0, 'current_page': 0,
                'per_page': 0, 'last_page': 0,
                'from': 0, 'to': 0,
            },
            pagina_servicio: 0,
            visible_servicio: false,
            
            selected_servicio: [
                {
                    id: null, servicio: null, descripcion: null, cantidad: null, precio: null, nota: null,
                    imagen: null, visible_nota: false, categoria: null, estado: null,
                },
            ],
            montototal: 0,

            imagen: '',
            foto: '',
            deleteimg: false,

            nombre: '',
            apellido: '',
            email: '',
            telefono: '',
            direccion: '',
            ciudad: '',
            zona: '',
            pais: '',
            fecha: '',
            hora: '',
            estadoproceso: '',

            search_servicio: '',
            active_servicio: 'active',
            error_servicio: '',
            error_email: '',

            mapPosition: {
                lat: 0,
                lng: 0,
            },
            markerPosition: {
                lat: 0,
                lng: 0,
            },

            direccioncompleto: '',

            productodetalle: {
                id: null, servicio: null, descripcion: null, cantidad: null, precio: null,
                imagen: null, categoria: null,
            },
            visible_producto: false,
            isOpenproducto: false,
            imagenproducto: '',
            
            loadingcomponent: false,
        }
    }
    formato(date) {
        let fecha = date.split('-');
        let year = parseInt(fecha[0]);
        let month = (parseInt(fecha[1]) < 10)?'0' + parseInt(fecha[1]):parseInt(fecha[1]);
        let day = (parseInt(fecha[2]) < 10)?'0' + parseInt(fecha[2]):parseInt(fecha[2]);

        return day + '/' + month + '/' + year;
    }
    componentDidMount() {
        this.props.get_link('solicitud', true);
        this.get_data();
    }
    get_data() {
        axios.get( web.servidor + '/solicitud/show/' + this.props.match.params.id ).then(
            (response) => {
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    console.log(response.data)
                    if (response.data.response == 1) {
                        this.props.loadingservice(false, '');
                        
                        this.state.selected_servicio = [];
                        for (let index = 0; index < response.data.detalle.length; index++) {
                            var data = response.data.detalle[index];
                            var object = {
                                id: data.id, servicio: data.servicio, descripcion: (data.descripcion == null) ? '' : data.descripcion, cantidad: data.cantidad, precio: data.precio, 
                                nota: (data.nota == null) ? '' : data.nota, imagen: (data.imagen == null) ? '' : data.imagen, 
                                visible_nota: false, categoria: (data.categoria == null) ? '' : data.categoria, estado: data.estadoproceso,
                            };
                            this.state.selected_servicio.push(object);
                        }
                        this.state.markerPosition = {
                            lat: parseFloat(response.data.informacion.latitud == null ? '0' : response.data.informacion.latitud),
                            lng: parseFloat(response.data.informacion.longitud == null ? '0' : response.data.informacion.longitud),
                        },
                        this.setState({
                            loadingcomponent: true,
                            nombre: response.data.informacion.nombre == null ? '' : response.data.informacion.nombre,
                            apellido: response.data.informacion.apellido == null ? '' : response.data.informacion.apellido,
                            direccion: response.data.informacion.direccion == null ? '' : response.data.informacion.direccion,
                            direccioncompleto: response.data.informacion.direccioncompleto == null ? '' : response.data.informacion.direccioncompleto,
                            email: response.data.informacion.email == null ? '' : response.data.informacion.email,
                            pais: response.data.informacion.pais == null ? '' : response.data.informacion.pais,
                            telefono: response.data.informacion.nombre == null ? '' : response.data.informacion.telefono,
                            zona: response.data.informacion.zona == null ? '' : response.data.informacion.zona,

                            markerPosition: this.state.markerPosition,
                            selected_servicio: this.state.selected_servicio,

                            montototal: response.data.solicitud.montototal,
                            nropedido: response.data.solicitud.id,
                            estadoproceso: response.data.solicitud.estadoproceso,

                            hora: response.data.solicitud.hora,
                            fecha: this.formato(response.data.solicitud.fecha),
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
    esServicioSeleccionado(data) {
        for (let index = 0; index < this.state.selected_servicio.length; index++) {
            var element = this.state.selected_servicio[index];
            if (element.id == data.id) {
                return true;
            }
        }
        return false;
    }
    addService(data) {
        if (this.esServicioSeleccionado(data)) {
            for (let index = 0; index < this.state.selected_servicio.length; index++) {
                var element = this.state.selected_servicio[index];
                if (element.id == data.id) {
                    this.state.selected_servicio[index].cantidad++;
                    break;
                }
            }
        } else {
            var objeto = {
                id: data.id, servicio: data.nombre, descripcion: data.descripcion, cantidad: 1, precio: data.precio, nota: '',
                imagen: data.imagen, visible_cantidad: false, visible_nota: false, error: null,
            };
            var bandera = true;
            for (let index = 0; index < this.state.selected_servicio.length; index++) {
                var element = this.state.selected_servicio[index];
                if (element.id == null) {
                    this.state.selected_servicio[index] = objeto;
                    bandera = false;
                    break;
                }
            }
            if (bandera) this.state.selected_servicio.push(objeto);
        }
        this.setState({
            selected_servicio: this.state.selected_servicio,
            visible_servicio: false, search_servicio: '', active_servicio: 'active',
        }, () => this.onGenerarTotal() );
    }
    onGenerarTotal() {
        var total = 0;
        for (let index = 0; index < this.state.selected_servicio.length; index++) {
            var element = this.state.selected_servicio[index];
            if (element.id != null) {
                total = total + element.cantidad * element.precio;
            }
        }
        this.setState({
            montototal: total,
        });
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
                                    DATOS DE {this.state.productodetalle.servicio.toUpperCase()}
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
    onModalServicio() {
        return (
            <Modal
                title={null} footer={null}
                visible={this.state.visible_servicio}
                onCancel={() => this.setState({ visible_servicio: false, search_servicio: '', active_servicio: 'active', })}
                bodyStyle={{padding: 0, paddingTop: 5, paddingBottom: 5,}}
                style={{ top: 50, }} width={400}
            >
                <div className="forms-groups" style={{position: 'relative',}}>
                    <div className='forms-groups' style={{display: 'flex', justifyContent: 'center', paddingBottom: 20,}}>
                        <div className={`search-wrapper ${this.state.active_servicio}`}>
                            <div className="input-holder">
                                <input type="text" className="search-input" placeholder="Ingresar Dato..." 
                                    value={this.state.search_servicio} onChange={(event) => this.setState({search_servicio: event.target.value,}) }
                                />
                                <button className="search-icon" onClick={ () => this.setState({active_servicio: 'active'}) }><span></span></button>
                            </div>
                        </div>
                    </div>
                    { (this.state.isOpen && this.state.img_servicio != '' && this.state.img_servicio != null) ? 
                        <Lightbox
                            mainSrc={this.state.img_servicio}
                            onCloseRequest={() => this.setState({ isOpen: false, img_servicio: '', })}
                        />
                        : null 
                    }
                    <Card title="LISTADO DE SERVICIO" 
                        bodyStyle={{ padding: 0, paddingRight: 20, paddingLeft: 5, }}
                        headStyle={{color: 'white', background: '#1890ff', fontSize: 12, fontWeight: 'bold',}}
                        style={{width: '100%', minWidth: '100%',}}
                    >
                        <div className="scroll-area-lg">
                            <div className="scrollbar-container">
                                <div className="p-2">
                                    <ul className="todo-list-wrapper list-group list-group-flush">
                                        {this.state.array_servicio.map((data, key) => (
                                            <li className="list-group-item" key={key}>
                                                <div className="todo-indicator bg-success"></div>
                                                <div className="widget-content p-0">
                                                    <div className="widget-content-wrapper">
                                                        <div className="widget-content-left mr-3">
                                                            <div className="widget-content-left">
                                                                { (data.imagen == null || data.imagen == '')  ?
                                                                    <img width="42" className="rounded" src="/images/anonimo.jpg" alt="" /> :
                                                                    <img width="65" height="55" className="rounded" src={data.imagen} alt="" 
                                                                        onClick={() => this.setState({ img_servicio: data.imagen }, 
                                                                        () => setTimeout(() => {
                                                                            this.setState({isOpen: true, })
                                                                        }, 500))} 
                                                                        style={{cursor: 'pointer',}}
                                                                    /> 
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="widget-content-left">
                                                            <div className="widget-heading">
                                                                { data.nombre }
                                                                <div className="badge badge-warning ml-2">
                                                                    {data.precio}
                                                                </div>
                                                            </div>
                                                            <div className="widget-subheading">
                                                                { data.descripcion == null ? '-' : data.descripcion }
                                                            </div>
                                                        </div>
                                                        <div className="widget-content-right">
                                                            <button className=" btn btn-outline-success"
                                                                onClick={this.addService.bind(this, data)}
                                                            >
                                                                <i className="fa fa-check"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </Modal>
        );
    }
    onBack() {
        this.props.history.goBack();
    }

    render() {

        // if (!this.state.loadingcomponent) return null;

        var colorsuccess = this.props.buttoncolor == '' ? 'primary' : this.props.buttoncolor;
        var colordanger = this.props.buttoncolor == '' ? 'danger' : 'outline-' + this.props.buttoncolor;
        var colorback = this.props.buttoncolor == '' ? 'focus' : this.props.buttoncolor;

        const WrappedMap = withScriptjs( withGoogleMap(
            props => <GoogleMap 
                defaultZoom={15}
                defaultCenter={ {lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng,} }
            >
                <Marker
                    position={{ lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng }}
                />
                <InfoWindow
                    position={{ lat: (this.state.markerPosition.lat + 0.0018), lng: this.state.markerPosition.lng }}
                >
                    <div>
                        <div style={{textAlign: 'center', paddingBottom: 8, paddingTop: 2,}}>
                            <span style={{ padding: 0, margin: 0, fontWeight: 'bold' }}>
                                {this.state.nombre} {this.state.apellido}
                            </span>
                        </div>
                        <span style={{ padding: 0, margin: 0 }}>
                            {this.state.direccioncompleto}
                        </span>
                    </div>
                </InfoWindow>
            </GoogleMap>
        ) );

        var estado = this.state.estadoproceso;
        estado = (estado == 'E') ? 'PENDIENTE' : (estado == 'P') ? 'PROCESO' : 'FINALIZADO';
        var color = (estado == 'E') ? 'warning' : (estado == 'P') ? 'processing' : 'success';

        return (
            <div className="rows">
                {this.onModalServicio()}
                {this.onModalProductoDetalle()}
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
                <div className="cards">
                    <div className='forms-groups'>
                        <Card
                            style={{ width: '100%', minWidth: '100%', }}
                            title="DETALLE SOLICITUD"
                            headStyle={{fontSize: 14, }}
                            bodyStyle={{padding: 4, paddingTop: 0, }}
                            extra={ <button className={"btn-wide btn-outline-2x mr-md-2 btn-sm btn btn-outline-" + colorback}
                                    onClick={this.onBack.bind(this)}
                                >
                                    Atras
                                </button> 
                            }
                        >
                            <div className="forms-groups">
                                
                                <div className='cols-lg-2 cols-md-2 cols-sm-2 cols-xs-12'>
                                    <div className='inputs-groups'>
                                        <input type='text' readOnly
                                            className={`forms-control title_form ${this.props.buttoncolor}`} value={'NRO ORDEN'}
                                        />
                                    </div>
                                </div>
                                <div className='cols-lg-2 cols-md-2 cols-sm-2 cols-xs-12'>
                                    <div className='inputs-groups'>
                                        <input type='text' readOnly 
                                            style={{ textAlign: 'center', height: 38, cursor: 'default', background: '#eee', }}
                                            className={`forms-control`} value={this.state.nropedido}
                                        />
                                    </div>
                                </div>
                                <div className='cols-lg-2 cols-md-2 cols-sm-2 text-center'>
                                    <Tag style={{position: 'relative', top: 5,}}
                                        color={color}
                                    >
                                        {estado}
                                    </Tag>
                                </div>
                                <div className='cols-lg-2 cols-md-2 cols-sm-2 cols-xs-12'>
                                    <div className='inputs-groups'>
                                        <input type='text' readOnly
                                            className={`forms-control title_form ${this.props.buttoncolor}`} value={'FECHA'}
                                        />
                                    </div>
                                </div>
                                <div className='cols-lg-2 cols-md-2 cols-sm-2 cols-xs-12'>
                                    <div className='inputs-groups'>
                                        <input type='text' readOnly 
                                            style={{ textAlign: 'center', height: 38, cursor: 'default', background: '#eee', }}
                                            className={`forms-control`} value={this.state.fecha + ' - ' + this.state.hora}
                                        />
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
                                                <td className={`title_form ${this.props.buttoncolor}`}>NRO</td>
                                                <td className={`title_form ${this.props.buttoncolor}`}>SERVICIO</td>
                                                <td className={`title_form ${this.props.buttoncolor}`}>CANTIDAD</td>
                                                <td className={`title_form ${this.props.buttoncolor}`}>PRECIO</td>
                                                <td className={`title_form ${this.props.buttoncolor}`}>NOTA</td>
                                                <td className={`title_form ${this.props.buttoncolor}`}>SUBTOTAL</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.selected_servicio.map((data, key) => {
                                                if (data.id == null) {
                                                    return (
                                                        <tr key={key}>
                                                            <td style={{height: 40, cursor: 'default', }}> </td>
                                                            <td style={{height: 40, cursor: 'default', }}> </td>
                                                            <td style={{height: 40, cursor: 'default', }}> </td>
                                                            <td style={{height: 40, cursor: 'default', }}> </td>
                                                            <td style={{height: 40, cursor: 'default', }}> </td>
                                                        </tr>
                                                    );
                                                }
                                                return (
                                                    <tr key={key}>
                                                        <td style={{cursor: 'default', textAlign: 'left', paddingLeft: 10, }}>
                                                            <label className='cols_show'>NRO: </label>
                                                            {key + 1}
                                                        </td>
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
                                                                visible={data.visible_nota}
                                                                onVisibleChange={() => {
                                                                    data.visible_nota = !data.visible_nota;
                                                                    this.setState({
                                                                        selected_servicio: this.state.selected_servicio,
                                                                    });
                                                                }}
                                                                content={
                                                                    <div>
                                                                        <div style={{textAlign: 'center', paddingBottom: 5,}}>
                                                                            <div className='inputs-groups' style={{width: 200, }}>
                                                                                <textarea type='text' placeholder=''
                                                                                    className={`forms-control`} 
                                                                                    style={{paddingRight: 25, color: '#1890ff', paddingTop: 5, height: 80, background: '#e8e8e8' }}
                                                                                    value={data.nota}
                                                                                    readOnly
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div style={{textAlign: 'center', }}>
                                                                            <Button size='small'
                                                                                onClick={() => {
                                                                                    data.visible_nota = !data.visible_nota;
                                                                                    this.setState({
                                                                                        selected_servicio: this.state.selected_servicio,
                                                                                    });
                                                                                }}
                                                                            >
                                                                                ACEPTAR
                                                                            </Button> &nbsp;
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
                                                    {this.state.montototal}
                                                </td>
                                            </tr>
                                            
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className='forms-groups'>
                                <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                                    <div className='inputs-groups'>
                                        <input type='text' readOnly
                                            className={`forms-control title_form ${this.props.buttoncolor}`} value={'DATOS GENERALES'}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='forms-groups'>
                                <div className='cols-lg-7 cols-md-7 cols-sm-12 cols-xs-12' style={{paddingTop: 0,}}>
                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{padding: 0, }}>
                                        <div className='cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12' style={{paddingTop: 0, }}>
                                            <div className='inputs-groups'>
                                                <label>Nombre*</label>
                                                <input type='text'
                                                    className={`forms-control`}
                                                    style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, background: '#e8e8e8', }}
                                                    value={this.state.nombre}
                                                    placeholder=' ...'
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className='cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12' style={{paddingTop: 0, }}>
                                            <div className='inputs-groups'>
                                                <label>Apellido*</label>
                                                <input type='text'
                                                    className={`forms-control`}
                                                    style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, background: '#e8e8e8', }}
                                                    value={this.state.apellido}
                                                    placeholder=' ...'
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{padding: 0, }}>
                                        <div className='cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12' style={{paddingTop: 0, }}>
                                            <div className='inputs-groups'>
                                                <label>Email*</label>
                                                <input type='text'
                                                    className={`forms-control ${this.state.error_email}`}
                                                    style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, background: '#e8e8e8', }}
                                                    value={this.state.email}
                                                    placeholder=' ...'
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className='cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12' style={{paddingTop: 0, }}>
                                            <div className='inputs-groups'>
                                                <label>Telefono*</label>
                                                <input type='text'
                                                    className={`forms-control`}
                                                    style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, background: '#e8e8e8', }}
                                                    value={this.state.telefono}
                                                    placeholder=' ...'
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{padding: 0, }}>
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{paddingTop: 0, }}>
                                            <div className='inputs-groups'>
                                                <label>Direccion*</label>
                                                <input type='text'
                                                    className={`forms-control`}
                                                    style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, background: '#e8e8e8', }}
                                                    value={this.state.direccion}
                                                    placeholder=' ...'
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{padding: 0, }}>
                                        <div className='cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12' style={{paddingTop: 0, }}>
                                            <div className='inputs-groups'>
                                                <label>Ciudad*</label>
                                                <input type='text'
                                                    className={`forms-control`}
                                                    style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, background: '#e8e8e8', }}
                                                    value={this.state.ciudad}
                                                    placeholder=' ...'
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className='cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12' style={{paddingTop: 0, }}>
                                            <div className='inputs-groups'>
                                                <label>Zona</label>
                                                <input type='text'
                                                    className={`forms-control`}
                                                    style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, background: '#e8e8e8', }}
                                                    value={this.state.zona}
                                                    placeholder=' ...'
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{padding: 0, }}>
                                        <div className='cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12' style={{paddingTop: 0, }}>
                                            <div className='inputs-groups'>
                                                <label>Pais*</label>
                                                <input type='text'
                                                    className={`forms-control`}
                                                    style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, background: '#e8e8e8', }}
                                                    value={this.state.pais}
                                                    placeholder=' ...'
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>

                                </div>


                                <div className='cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12' style={{paddingTop: 0,}}>
                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{padding: 0,}}>
                                        <div style={{width: '100%', height: 350, }}>
                                            <WrappedMap 
                                                // googleMapURL={'https://maps.googleapis.com/maps/api/js?key=AIzaSyAofod0Bp0frLcLHVLxuacn0QBXqVyJ7lc&callback=initMap'}
                                                googleMapURL={'https://maps.googleapis.com/maps/api/js?key=AIzaSyAofod0Bp0frLcLHVLxuacn0QBXqVyJ7lc&v=3.exp&libraries=geometry,drawing,places'}
                                                loadingElement={ <div style={ {height:'100%', } }></div> }
                                                containerElement={ <div style={ {height: '100%',} }></div> }
                                                mapElement={ <div style={ {height: '100%',} }></div> }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className='forms-groups txts-center mt-4'>
                            <button className={"mb-2 mr-2 btn-hover-shine btn btn-" + colorsuccess}
                                onClick={this.onBack.bind(this)}
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

ShowSolicitud.propTypes = {
    buttoncolor: PropTypes.string,
}

ShowSolicitud.defaultProps = {
    buttoncolor: '',
}

export default withRouter(ShowSolicitud);
