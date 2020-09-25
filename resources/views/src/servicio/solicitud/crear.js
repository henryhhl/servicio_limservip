
import React, { Component } from 'react';
import axios from 'axios';
import {withRouter, Redirect} from 'react-router-dom';

import { notification, Card, Modal, Popover, Button } from 'antd';
import 'antd/dist/antd.css';

import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

import web from '../../utils/services';

import PropTypes from 'prop-types';

import { GoogleMap, InfoWindow, Marker, withGoogleMap, withScriptjs } from "react-google-maps";

import Geocode from "react-geocode";

Geocode.setApiKey("AIzaSyAofod0Bp0frLcLHVLxuacn0QBXqVyJ7lc");
Geocode.enableDebug();

class CreateSolicitud extends Component {

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
                    imagen: null, visible_cantidad: false, visible_nota: false, error: null,
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

            search_servicio: '',
            active_servicio: 'active',
            error_servicio: '',

            mapPosition: {
                lat: 0,
                lng: 0,
            },
            markerPosition: {
                lat: 0,
                lng: 0,
            },

            direccioncompleto: '',
            
            loadingcomponent: false,
        }
    }
    componentDidMount() {
        console.log(new Date())
        this.props.get_link('solicitud', true);
        this.getLocationActual();
        this.get_data();
    }
    getLocationActual() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.setState({
                    mapPosition: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    },
                    markerPosition: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    }
                },
                    () => {
                        Geocode.fromLatLng(position.coords.latitude, position.coords.longitude).then(
                            response => {
                                const address = response.results[0].formatted_address,
                                    addressArray = response.results[0].address_components,
                                    city = this.getCity(addressArray),
                                    area = this.getArea(addressArray),
                                    state = this.getState(addressArray);

                                var array = (address) ? address.split(',') : [];

                                this.state.direccion = address;
                                this.state.ciudad = array.length > 1 ? array[array.length - 2] : '';
                                this.state.pais = array.length > 0 ? array[array.length - 1] : '';

                                // console.log(area)
                                // console.log(state)

                                this.setState({
                                    direccioncompleto: (address) ? address : '',
                                    area: (area) ? area : '',
                                    city: (city) ? city : '',
                                    state: (state) ? state : '',

                                    direccion: this.state.direccion,
                                    ciudad: this.state.ciudad,
                                    pais: this.state.pais,
                                })
                            },
                            error => {
                                console.error(error);
                            }
                        );

                    })
            });
        } else {
            console.error("Geolocation is not supported by this browser!");
        }
    }
    getCity(addressArray) {
        let city = '';
        for (let i = 0; i < addressArray.length; i++) {
            if (addressArray[i].types[0] && 'administrative_area_level_2' === addressArray[i].types[0]) {
                city = addressArray[i].long_name;
                return city;
            }
        }
    };

    getArea(addressArray){
        let area = '';
        for (let i = 0; i < addressArray.length; i++) {
            if (addressArray[i].types[0]) {
                for (let j = 0; j < addressArray[i].types.length; j++) {
                    if ('sublocality_level_1' === addressArray[i].types[j] || 'locality' === addressArray[i].types[j]) {
                        area = addressArray[i].long_name;
                        return area;
                    }
                }
            }
        }
    };

    getState(addressArray) {
        let state = '';
        for (let i = 0; i < addressArray.length; i++) {
            for (let i = 0; i < addressArray.length; i++) {
                if (addressArray[i].types[0] && 'administrative_area_level_1' === addressArray[i].types[0]) {
                    state = addressArray[i].long_name;
                    return state;
                }
            }
        }
    };
    get_data() {
        axios.get( web.servidor + '/solicitud/create').then(
            (response) => {
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        this.props.loadingservice(false, '');
                        this.setState({
                            nropedido: response.data.nro,
                            loadingcomponent: true,
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
    onChangeFoto(event) {
        let files = event.target.files;
        if ((files[0].type === 'image/png') || (files[0].type === 'image/jpg') || (files[0].type === 'image/jpeg') || (files[0].type === 'image/bmp')) {
            let reader = new FileReader();
            reader.onload = (e) => {
                this.setState({
                    foto: e.target.result,
                    imagen: files[0], deleteimg: true,
                });
            };
            reader.readAsDataURL(event.target.files[0]);
            return;
        }
        setTimeout(() => {
            var img = document.getElementById('img-img');
            img.value = '';
            notification.warning({
                message: 'ADVERTENCIA',
                description: 'ARCHIVO INVALIDO',
            });
            this.setState({
                deleteimg: false,
                foto: '', imagen: '',
            });
        }, 500);
        return;
    }
    onDeleteImg() {
        var img = document.getElementById('img-img');
        img.value = '';
        this.setState({
            deleteimg: false,
            foto: '', imagen: '',
        });
    }
    get_servicio(page = 1) {
        axios.get( web.servidor + '/servicio/search_servicio?page=' + page + '&search=' + this.state.search_servicio ).then(
            (response) => {
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        this.setState({
                            array_servicio: response.data.data.data,
                            pagination_servicio: response.data.pagination,
                            pagina_servicio: response.data.data.data.length > 0 ? page : 0,
                            visible_servicio: true, search_servicio: '',
                        });
                    }
                }
            }
        ).catch( error => { 
            console.log(error); 
            console.log(error.response); 
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
            });
        });
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
    onValidar() {
        if ( this.state.nombre.toString().trim().length > 0 && this.state.usuario.toString().trim().length > 0 &&
                this.state.password.toString().trim().length > 0
            ) {
            this.onSesion();
        }else {
            if (this.state.nombre.toString().trim().length == 0) {
                notification.error({
                    message: 'ERROR',
                    description: 'NOMBRE REQUERIDO.',
                });
                this.setState({ error_nombre: 'error', });
                return;
            }
            if (this.state.usuario.toString().trim().length == 0) {
                notification.error({
                    message: 'ERROR',
                    description: 'USUARIO REQUERIDO.',
                });
                this.setState({ error_usuario: 'error', });
                return;
            }
            if (this.state.password.toString().trim().length == 0) {
                notification.error({
                    message: 'ERROR',
                    description: 'PASSWORD REQUERIDO.',
                });
                this.setState({ error_password: 'error', });
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
        formdata.append('nombre', this.state.nombre);
        formdata.append('apellido', this.state.apellido);
        formdata.append('nit', this.state.nit);
        formdata.append('email', this.state.email);
        formdata.append('contacto', this.state.contacto);
        formdata.append('imagen', this.state.imagen);
        formdata.append('foto', this.state.foto);
        formdata.append('usuario', this.state.usuario);
        formdata.append('password', this.state.password);

        axios(
            {
                method: 'post',
                url: web.servidor + '/cliente/store',
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
                        description: 'CLIENTE CREADO EXITOSAMENTE',
                    });
                    this.props.history.goBack();
                    return;
                }
                if (response.data.response == -1) {
                    notification.error({
                        message: 'ERROR',
                        description: 'EL USUARIO YA EXISTE. FAVOR DE INGRESAR OTRO USUARIO',
                    });
                    this.setState({ error_usuario: 'error', });
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

    onMarkerDragEnd(event) {
        let newLat = event.latLng.lat(),
            newLng = event.latLng.lng();

        Geocode.fromLatLng(newLat, newLng).then(
            response => {
                const address = response.results[0].formatted_address,
                    addressArray = response.results[0].address_components,
                    city = this.getCity(addressArray),
                    area = this.getArea(addressArray),
                    state = this.getState(addressArray);

                    var array = (address) ? address.split(',') : [];

                    this.state.direccion = address;
                    this.state.ciudad = array.length > 1 ? array[array.length - 2] : '';
                    this.state.pais = array.length > 0 ? array[array.length - 1] : '';

                this.setState({
                    direccioncompleto: (address) ? address : '',
                    area: (area) ? area : '',
                    city: (city) ? city : '',
                    state: (state) ? state : '',

                    direccion: this.state.direccion,
                    ciudad: this.state.ciudad,
                    pais: this.state.pais,

                    markerPosition: {
                        lat: newLat,
                        lng: newLng
                    },
                    mapPosition: {
                        lat: newLat,
                        lng: newLng
                    },
                })
            },
            error => {
                console.error(error);
            }
        );
    };

    onInfoWindowClose(event) { };

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
                    // google={this.props.google}
                    // name={ this.state.nombre.toString().trim().length == 0 ? '-' : this.state.nombre }
                    draggable={true}
                    onDragEnd={this.onMarkerDragEnd.bind(this)}
                    position={{ lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng }}
                />
                <InfoWindow
                    onClose={this.onInfoWindowClose.bind(this)}
                    position={{ lat: (this.state.markerPosition.lat + 0.0018), lng: this.state.markerPosition.lng }}
                >
                    <div>
                        <span style={{ padding: 0, margin: 0 }}>
                            {this.state.direccioncompleto}
                        </span>
                    </div>
                </InfoWindow>
            </GoogleMap>
        ) );

        return (
            <div className="rows">
                {this.onModalServicio()}
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
                            title="NUEVA SOLICITUD"
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
                                <div className='cols-lg-4 cols-md-4 cols-sm-3'></div>
                                <div className='cols-lg-2 cols-md-2 cols-sm-3 cols-xs-12'>
                                    <div className='inputs-groups'>
                                        <input type='text' readOnly
                                            className={`forms-control title_form ${this.props.buttoncolor}`} value={'NRO ORDEN'}
                                        />
                                    </div>
                                </div>
                                <div className='cols-lg-2 cols-md-2 cols-sm-3 cols-xs-12'>
                                    <div className='inputs-groups'>
                                        <input type='text' readOnly 
                                            style={{ textAlign: 'center', height: 38, cursor: 'default', background: '#eee', }}
                                            className={`forms-control`} value={this.state.nropedido}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='forms-groups'>
                                <div className='cols-lg-2 cols-md-2 cols-sm-2'></div>
                                <div className='cols-lg-8 cols-md-8 cols-sm-8 cols-xs-12' style={{paddingTop: 0, }}>
                                    <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12' style={{paddingTop: 0, }}>
                                        <div className='inputs-groups'>
                                            <input type='text' className={`forms-control title_form ${this.props.buttoncolor}`} 
                                                value={'Servicio'} readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12' style={{paddingTop: 0,}}>
                                        <div className='inputs-groups'>
                                            <input type='text'
                                                className={`forms-control ${this.state.error_servicio}`}
                                                style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                value={this.state.search_servicio}
                                                placeholder='Search Servicio...'
                                                onChange={ (event) => this.setState({
                                                    search_servicio: event.target.value, error_servicio: '',
                                                }) }
                                                onKeyPress={ (event) => {
                                                    if (event.key == 'Enter') this.get_servicio();
                                                } }
                                            />
                                            {this.state.search_servicio.toString().length == 0 ? null : 
                                                <i className='fa fa-close delete_icon'
                                                    onClick={() => this.setState({ search_servicio: '', }) }
                                                ></i> 
                                            }
                                        </div>
                                    </div>
                                    <div className='cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12' style={{paddingTop: 0,}}>
                                        <button className="btn-hover-shine btn btn-light btn-lg btn-block mt-1"
                                            onClick={() => this.get_servicio()}
                                            style={{paddingLeft: 0, paddingRight: 0, display: 'flex', justifyContent: 'center', fontSize: 10, }}
                                        >
                                            BUSCAR
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
                                                var error = data.error == null ? {} : {boxShadow: '0 0 15px 5px red inset'};
                                                return (
                                                    <tr key={key} style={error}>
                                                        <td style={{cursor: 'default', textAlign: 'left', paddingLeft: 10, }}>
                                                            <label className='cols_show'>NRO: </label>
                                                            {key + 1}
                                                        </td>
                                                        <td style={{cursor: 'default', textAlign: 'left', paddingLeft: 10, 
                                                            fontWeight: 'bold', color: '#1890ff', 
                                                        }}>
                                                            <label className='cols_show'>SERVICIO: </label>
                                                            {data.servicio}
                                                        </td>
                                                        <td style={{cursor: 'default', textAlign: 'left', paddingLeft: 10, 
                                                            fontWeight: 'bold', color: '#1890ff', 
                                                        }}>
                                                            <label className='cols_show'>CANTIDAD: </label>
                                                            <Popover placement='top' trigger='click'
                                                                visible={data.visible_cantidad}
                                                                onVisibleChange={() => {
                                                                    data.visible_cantidad = !data.visible_cantidad;
                                                                    this.setState({
                                                                        selected_servicio: this.state.selected_servicio,
                                                                    });
                                                                }}
                                                                content={
                                                                    <div>
                                                                        <div style={{textAlign: 'center', paddingBottom: 5,}}>
                                                                            <div className='inputs-groups' style={{width: 150, }}>
                                                                                <input type='text' placeholder=''
                                                                                    className={`forms-control`} 
                                                                                    style={{paddingRight: 25, color: '#1890ff', textAlign: 'center', }}
                                                                                    value={data.cantidad}
                                                                                    onChange={(event) => {
                                                                                        var cantidad = event.target.value == '' ? 0 : event.target.value;
                                                                                        if (!isNaN(cantidad)) {
                                                                                            if (parseInt(cantidad) >= 0) {
                                                                                                data.cantidad = cantidad;
                                                                                                this.setState({
                                                                                                    search_servicio: this.state.selected_servicio,
                                                                                                }, () => this.onGenerarTotal() );
                                                                                            }
                                                                                        }
                                                                                    }}
                                                                                />
                                                                                <i className='fa fa-plus blue_hover' 
                                                                                    style={{fontSize: 14, position: 'absolute', top: 10, bottom: 10, right: 5, cursor: 'pointer',
                                                                                        padding: 0, paddingLeft: 4, paddingRight: 3, display: 'flex', justifyContent: 'center', alignItems: 'center'
                                                                                    }}
                                                                                    onClick={ () => {
                                                                                        data.cantidad = data.cantidad == '' ? 0 : data.cantidad;
                                                                                        data.cantidad++;;
                                                                                        this.setState({
                                                                                            selected_servicio: this.state.selected_servicio,
                                                                                        }, () => this.onGenerarTotal() );
                                                                                    }}
                                                                                ></i>
                                                                                <i className='fa fa-minus blue_hover' 
                                                                                    style={{fontSize: 14, position: 'absolute', top: 10, bottom: 10, left: 5, cursor: 'pointer',
                                                                                        padding: 0, paddingLeft: 4, paddingRight: 3, display: 'flex', justifyContent: 'center', alignItems: 'center'
                                                                                    }}
                                                                                    onClick={ () => {
                                                                                        data.cantidad = data.cantidad == '' ? 0 : data.cantidad;
                                                                                        if (parseFloat(data.cantidad) > 0) {
                                                                                            data.cantidad--;
                                                                                            this.setState({
                                                                                                selected_servicio: this.state.selected_servicio,
                                                                                            }, () => this.onGenerarTotal() );
                                                                                        }
                                                                                    }}
                                                                                ></i>
                                                                            </div>
                                                                        </div>
                                                                        <div style={{textAlign: 'center', }}>
                                                                            <Button size='small'
                                                                                onClick={() => {
                                                                                    data.visible_cantidad = !data.visible_cantidad;
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
                                                                title='CANTIDAD'
                                                            >
                                                                <a style={{color: 'blue', fontSize: 12, paddingLeft: 4, paddingRight: 4, border: '1px dashed blue' ,}}>
                                                                    {data.cantidad}
                                                                </a>
                                                            </Popover>
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
                                                                                    style={{paddingRight: 25, color: '#1890ff', paddingTop: 5, height: 80, }}
                                                                                    value={data.nota}
                                                                                    onChange={(event) => {
                                                                                        data.nota = event.target.value;
                                                                                        this.setState({
                                                                                            selected_servicio: this.state.selected_servicio,
                                                                                        });
                                                                                    }}
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
                                                                    {'AGREGAR NOTA'}
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
                                                    style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                    value={this.state.nombre}
                                                    placeholder='INGRESAR NOMBRE...'
                                                    onChange={ (event) => this.setState({
                                                        nombre: event.target.value,
                                                    }) }
                                                />
                                            </div>
                                        </div>
                                        <div className='cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12' style={{paddingTop: 0, }}>
                                            <div className='inputs-groups'>
                                                <label>Apellido*</label>
                                                <input type='text'
                                                    className={`forms-control`}
                                                    style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                    value={this.state.apellido}
                                                    placeholder='INGRESAR APELLIDO...'
                                                    onChange={ (event) => this.setState({
                                                        apellido: event.target.value,
                                                    }) }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{padding: 0, }}>
                                        <div className='cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12' style={{paddingTop: 0, }}>
                                            <div className='inputs-groups'>
                                                <label>Email*</label>
                                                <input type='text'
                                                    className={`forms-control`}
                                                    style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                    value={this.state.email}
                                                    placeholder='INGRESAR EMAIL...'
                                                    onChange={ (event) => this.setState({
                                                        email: event.target.value,
                                                    }) }
                                                />
                                            </div>
                                        </div>
                                        <div className='cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12' style={{paddingTop: 0, }}>
                                            <div className='inputs-groups'>
                                                <label>Telefono*</label>
                                                <input type='text'
                                                    className={`forms-control`}
                                                    style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                    value={this.state.telefono}
                                                    placeholder='INGRESAR TELEFONO...'
                                                    onChange={ (event) => {
                                                        if (!isNaN(event.target.value)) {
                                                            this.setState({
                                                                telefono: event.target.value,
                                                            });
                                                        }
                                                    } }
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
                                                    style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                    value={this.state.direccion}
                                                    placeholder='INGRESAR DIRECCION...'
                                                    onChange={ (event) => this.setState({
                                                        direccion: event.target.value,
                                                    }) }
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
                                                    style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                    value={this.state.ciudad}
                                                    placeholder='INGRESAR NOMBRE...'
                                                    onChange={ (event) => this.setState({
                                                        ciudad: event.target.value,
                                                    }) } 
                                                    // readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className='cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12' style={{paddingTop: 0, }}>
                                            <div className='inputs-groups'>
                                                <label>Zona</label>
                                                <input type='text'
                                                    className={`forms-control`}
                                                    style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                    value={this.state.zona}
                                                    placeholder='INGRESAR ZONA...'
                                                    onChange={ (event) => this.setState({
                                                        zona: event.target.value,
                                                    }) }
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
                                                    style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                    value={this.state.pais}
                                                    placeholder='INGRESAR PAIS...'
                                                    onChange={ (event) => this.setState({
                                                        pais: event.target.value,
                                                    }) } 
                                                    // readOnly
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
                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{padding: 0, textAlign: 'center'}}>
                                        <button className={"mb-2 mr-2 btn-hover-shine btn btn-" + colorsuccess}
                                            onClick={this.getLocationActual.bind(this)}
                                        >
                                            IR MI UBICACIÓN ACTUAL
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className='forms-groups txts-center mt-4'>
                            <button className={"mb-2 mr-2 btn-hover-shine btn btn-" + colorsuccess}
                                onClick={this.onValidar.bind(this)}
                            >
                                Aceptar
                            </button>
                            <button className={"mb-2 mr-2 btn-hover-shine btn btn-" + colordanger}
                                onClick={this.onBack.bind(this)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

CreateSolicitud.propTypes = {
    buttoncolor: PropTypes.string,
}

CreateSolicitud.defaultProps = {
    buttoncolor: '',
}

export default withRouter(CreateSolicitud);
