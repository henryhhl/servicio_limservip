
import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

import { notification, Card, Modal, message, Select, Tag } from 'antd';

import { EnvironmentOutlined } from '@ant-design/icons';

import 'antd/dist/antd.css';
import web from '../../utils/services';

import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

import PropTypes from 'prop-types';

import { GoogleMap, InfoWindow, Marker, withGoogleMap, withScriptjs } from "react-google-maps";

const { Option } = Select;


const WrappedMap = withScriptjs( withGoogleMap(
    props => (
        <GoogleMap 
            defaultZoom={13}
            defaultCenter={{ lat: -17.775404, lng: -63.165923, }}
        >
            {props.children}
        </GoogleMap>
    )
) );

class VisualizarSeguimiento extends Component {

    constructor(props) {
        super(props);
        this.state = {
            auth: false,
            loading: false,

            mapPosition: {
                lat: -17.775404,
                lng: -63.165923,
            },
            markerPosition: {
                lat: 0,
                lng: 0,
            },
            
            descripcion: '',
            error_descripcion: '',

            idsolicitud: '',

            img_personal: '',
            isOpenPersonal: false,

            array_personalasignado: [],
            array_personallibre: [],
            array_solicitud: [],
            solicitud_pendienteproceso: [],

            //seguimiento: this.goSeguimiento(),
        }
    }
    // goSeguimiento() {
    //     setInterval(() => {
    //         console.log(34)
    //     }, 5000);
    // }
    // componentWillUnmount() {
    //     clearInterval( this.goSeguimiento );
    // }
    componentDidMount() {
        this.props.get_link('visualizar_seguimiento', true);
        this.get_data();
    }
    get_data() {
        axios.get( web.servidor + '/visualizar_seguimiento/create').then(
            (response) => {
                console.log(response.data)
                if (response.data.response == -3) {
                    this.props.logout();
                    return;
                }
                if (response.data.response == 1) {
                    this.props.loadingservice(false, '');
                    this.setState({
                        array_personalasignado: response.data.personalasignado,
                        array_personallibre: response.data.personallibre,
                        array_solicitud: response.data.solicitud,
                        solicitud_pendienteproceso: response.data.solicitud_pendproc,
                    });
                    return;
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
    onChangeIDSolicitud(value) {}
    IniciarSegumiento() {}
    formatFecha(date) {
        var array = date.split('-');
        return array[2] + '/' + array[1] + '/' + array[0];
    }
    render() {
        var colorsuccess = this.props.buttoncolor == '' ? 'primary' : this.props.buttoncolor;
        var colordanger = this.props.buttoncolor == '' ? 'danger' : 'outline-' + this.props.buttoncolor;
        var colorback = this.props.buttoncolor == '' ? 'focus' : this.props.buttoncolor;

        return (
            <div className="rows">
                { (this.state.isOpenPersonal && this.state.img_personal != '' && this.state.img_personal != null) ? 
                    <Lightbox
                        mainSrc={this.state.img_personal}
                        onCloseRequest={() => this.setState({ isOpenPersonal: false, img_personal: '', })}
                    />
                    : null 
                }
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
                            title="SEGUIMIENTO"
                            headStyle={{fontSize: 14, }}
                            bodyStyle={{padding: 4, paddingTop: 0, }}
                            
                        >
                            <div className="forms-groups">
                                <div className='cols-lg-2 cols-md-2'></div>
                                <div className='cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12' style={{paddingTop: 4,}}>
                                    <div className='inputs-groups'>
                                        <input type='text' readOnly
                                            className={`forms-control title_form ${this.props.buttoncolor}`} value={'Solicitud'}
                                        />
                                    </div>
                                </div>
                                <div className='cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12' style={{paddingTop: 4,}}>
                                    <div className='inputs-groups'>
                                        <Select
                                            style={{ width: '100%', minWidth: '100%', }}
                                            value={this.state.idsolicitud} className={'hg_40'}
                                            onChange={this.onChangeIDSolicitud.bind(this)}
                                        >
                                            <Option value=''>SELECCIONAR...</Option>
                                            {this.state.array_solicitud.map(
                                                (data, key) => (
                                                    <Option key={key} value={data.id}>
                                                        <div className="demo-option-label-item">
                                                            <div style={{display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e8e8e8', paddingTop: 5,}}>
                                                                <div style={{fontSize: 10,}}>
                                                                    
                                                                </div>
                                                                <div style={{fontSize: 10,}}>
                                                                    <Tag 
                                                                        color={(data.estado == 'P') ? 'warning' : (data.estado == 'E') ? 'processing' : 
                                                                            (data.estado == 'C') ? 'red' : (data.estado == 'N') ? 'red' : 'success'
                                                                        }
                                                                    >
                                                                        {(data.estado == 'P') ? 'PENDIENTE' : (data.estado == 'E') ? 'EN PROCESO' : 
                                                                            (data.estado == 'C') ? 'CANCELADO' : (data.estado == 'N') ? 'FALLIDO' : 'FINALIZADO'
                                                                        }
                                                                    </Tag>
                                                                </div>
                                                            </div>
                                                            <span role="img" style={{marginRight: 6, fontWeight: 'bold', }}>
                                                                <label style={{fontSize: 12,}}>NRO:</label> 000{data.id}
                                                            </span>
                                                            <label style={{color: 'blue', fontWeight: 'bold', fontSize: 12,}}> CLIENTE: </label> {data.nombre + ' ' + data.apellido} 
                                                            <div style={{display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e8e8e8', paddingTop: 5,}}>
                                                                <div style={{fontSize: 10,}}>
                                                                    {this.formatFecha(data.fecha)}
                                                                </div>
                                                                <div style={{fontSize: 10,}}>
                                                                    {data.hora}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Option>
                                                )
                                            )}
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <div className="forms-groups">
                                <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                                    <div className='inputs-groups'>
                                        <div style={{width: '100%', height: 400, }}>
                                        <WrappedMap 
                                            // googleMapURL={'https://maps.googleapis.com/maps/api/js?key=AIzaSyAofod0Bp0frLcLHVLxuacn0QBXqVyJ7lc&callback=initMap'}
                                            googleMapURL={'https://maps.googleapis.com/maps/api/js?key=AIzaSyAofod0Bp0frLcLHVLxuacn0QBXqVyJ7lc&v=3.exp&libraries=geometry,drawing,places'}
                                            loadingElement={ <div style={ {height:'100%', } }></div> }
                                            containerElement={ <div style={ {height: '100%',} }></div> }
                                            mapElement={ <div style={ {height: '100%',} }></div> }

                                            latitud={ this.state.mapPosition.lat }
                                            longitud={ this.state.mapPosition.lng }
                                        >

                                            <Marker 
                                                name={'LIMSERVIP'}
                                                position={{ lat: -17.775404, lng: -63.165923, }}
                                                icon={'/img/marker_limservip.png'}
                                            >
                                                <InfoWindow 
                                                    position={{ lat: (-17.775404 * 1 + 0.0018), lng: -63.165923 * 1 }}
                                                >
                                                    <div>
                                                        <div>
                                                            <span role="img" style={{marginRight: 6, fontWeight: 'bold', }}>
                                                                <label style={{fontSize: 12,}}>LIMSERVIP</label> 
                                                            </span>
                                                        </div>
                                                    </div>
                                                </InfoWindow>
                                            </Marker>

                                            {this.state.solicitud_pendienteproceso.map(
                                                (data, key) => (
                                                    <Marker key={key}
                                                        //google={this.props.google}
                                                        name={data.nombre + '' + data.apellido}
                                                        position={{ lat: parseFloat(data.latitud), lng: parseFloat(data.longitud), }}
                                                        icon={data.estado == 'P' ? '/img/orangemarker.png' : '/img/bluemarker.png'} //orangemarker.png
                                                    >
                                                        <InfoWindow 
                                                            //onClose={this.onInfoWindowClose} marker_limservip.png
                                                            position={{ lat: (data.latitud * 1 + 0.0018), lng: data.longitud * 1 }}
                                                        >
                                                            <div>
                                                                <div style={{display: 'flex', justifyContent: 'space-between', paddingTop: 5,}}>
                                                                    <div style={{fontSize: 10,}}>
                                                                        
                                                                    </div>
                                                                    <div style={{fontSize: 10,}}>
                                                                        <Tag 
                                                                            color={(data.estado == 'P') ? 'warning' : (data.estado == 'E') ? 'processing' : 
                                                                                (data.estado == 'C') ? 'red' : (data.estado == 'N') ? 'red' : 'success'
                                                                            }
                                                                        >
                                                                            {(data.estado == 'P') ? 'PENDIENTE' : (data.estado == 'E') ? 'EN PROCESO' : 
                                                                                (data.estado == 'C') ? 'CANCELADO' : (data.estado == 'N') ? 'FALLIDO' : 'FINALIZADO'
                                                                            }
                                                                        </Tag>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <span role="img" style={{marginRight: 6, fontWeight: 'bold', }}>
                                                                        <label style={{fontSize: 12,}}>NRO:</label> 000{data.id}
                                                                    </span>
                                                                    <span style={{position: 'relative', top: 10, marginBottom: 10,}}>
                                                                        <label style={{color: 'blue', fontWeight: 'bold', fontSize: 12,}}> CLIENTE: </label> {data.nombre + ' ' + data.apellido}
                                                                    </span> 
                                                                </div>
                                                                <div style={{display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e8e8e8', paddingTop: 5,}}>
                                                                    <div style={{fontSize: 10,}}>
                                                                        {this.formatFecha(data.fecha)}
                                                                    </div>
                                                                    <div style={{fontSize: 10,}}>
                                                                        {data.hora}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </InfoWindow>
                                                    </Marker>
                                                )
                                            )}
                                        </WrappedMap>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="forms-groups">
                                <div className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12' style={{border: '1px solid #e8e8e8', paddingTop: 0, }}>
                                    <div className="card-header-title font-size-md text-capitalize font-weight-bold text-primary" style={{borderBottom: '1px solid #e8e8e8'}}>
                                        PERSONAL ASIGNADO
                                    </div>
                                    <div className="scroll-area-lg">
                                        <div className="scrollbar-container">
                                            <div className="p-2">
                                                <ul className="todo-list-wrapper list-group list-group-flush">
                                                    {this.state.array_personalasignado.map(
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
                                                                                <div className="badge ml-2">
                                                                                    {data.ci == null ? '-' : data.ci}
                                                                                </div>
                                                                            </div>
                                                                            <div className="widget-heading">
                                                                                Contacto:
                                                                                <div className="badge ml-2">
                                                                                    {data.contacto == null ? '-' : data.contacto}
                                                                                </div>
                                                                            </div>
                                                                            <div className="widget-heading">
                                                                                Email:
                                                                                <div className="badge ml-2">
                                                                                    {data.email == null ? '-' : data.email}
                                                                                </div>
                                                                            </div>
                                                                            <div className="widget-subheading">
                                                                                { data.ciudad == null ? '' : data.ciudad } - { data.direccion == null ? '' : data.direccion }
                                                                            </div>
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
                                <div className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12' style={{border: '1px solid #e8e8e8', paddingTop: 0, }}>
                                    <div className="card-header-title font-size-md text-capitalize font-weight-bold text-primary" style={{borderBottom: '1px solid #e8e8e8'}}>
                                        PERSONAL LIBRE
                                    </div>
                                    <div className="scroll-area-lg">
                                        <div className="scrollbar-container">
                                            <div className="p-2">
                                                <ul className="todo-list-wrapper list-group list-group-flush">
                                                    {this.state.array_personallibre.map(
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
                                                                                <div className="badge ml-2">
                                                                                    {data.ci == null ? '-' : data.ci}
                                                                                </div>
                                                                            </div>
                                                                            <div className="widget-heading">
                                                                                Contacto:
                                                                                <div className="badge ml-2">
                                                                                    {data.contacto == null ? '-' : data.contacto}
                                                                                </div>
                                                                            </div>
                                                                            <div className="widget-heading">
                                                                                Email:
                                                                                <div className="badge ml-2">
                                                                                    {data.email == null ? '-' : data.email}
                                                                                </div>
                                                                            </div>
                                                                            <div className="widget-subheading">
                                                                                { data.ciudad == null ? '' : data.ciudad } - { data.direccion == null ? '' : data.direccion }
                                                                            </div>
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
                            
                        </Card>

                        <div className='forms-groups txts-center mt-4'>
                            <button className={"mb-2 mr-2 btn-hover-shine btn btn-" + colorsuccess}
                                onClick={this.IniciarSegumiento.bind(this)}
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

VisualizarSeguimiento.propTypes = {
    buttoncolor: PropTypes.string,
}

VisualizarSeguimiento.defaultProps = {
    buttoncolor: '',
}

export default withRouter(VisualizarSeguimiento);
