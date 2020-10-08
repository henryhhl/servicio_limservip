
import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';

import { notification, Card, Transfer, Switch, Button, Modal } from 'antd';
import 'antd/dist/antd.css';
import web from './utils/services';

import { Bar, Pie } from 'react-chartjs-2';
import { isPermission } from './utils/functions';
import permissions from './utils/permisions';

import PropTypes from 'prop-types';
import { GoogleMap, InfoWindow, Marker, withGoogleMap, withScriptjs } from 'react-google-maps';

function Map() {
    return (
        <GoogleMap 
            defaultZoom={12}
            defaultCenter={{ lat: -17.775404, lng: -63.165923, }}
        >
            {this.props.children}
        </GoogleMap>
    );
}

const WrappedMap = withScriptjs( withGoogleMap(
    props => (
        <GoogleMap 
            defaultZoom={12}
            defaultCenter={{ lat: -17.775404, lng: -63.165923, }}
        >
            {props.children}
        </GoogleMap>
    )
) );

export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            auth: false,
            totalcliente: 0,
            totalventa: 0,
            montototal: 0,
            array_servicio: [],
            cantidad_estadistica: [],
            loading: false,
            array_color: [],
            texto: '',
        }
    }
    componentDidMount() {
        this.props.get_link('home');
        //this.get_data();
    }
    generarNumero(numero){
        return (Math.random()*numero).toFixed(0);
    }
    
    colorRGB(){
        var coolor = "("+this.generarNumero(255)+"," + this.generarNumero(255) + "," + this.generarNumero(255) +")";
        return "rgb" + coolor;
    }
    get_data() {
        axios.get( web.servidor + '/usuario/inicio').then(
            (response) => {
                if (response.data.response == -3) {
                    this.props.logout();
                    return;
                }
                if (response.data.response == 1) {
                    console.log(response.data)
                    for (let index = 0; index < response.data.servicio.length; index++) {
                        const element = response.data.servicio[index];
                        this.state.array_servicio.push(element.descripcion);
                        var cantidad = 0;
                        for (let j = 0; j < response.data.data.length; j++) {
                            const service = response.data.data[j];
                            if (element.id == service.idproducto) {
                                cantidad = cantidad + service.cantidad * 1;
                            }
                        }
                        this.state.cantidad_estadistica.push(cantidad);
                        this.state.array_color.push(this.colorRGB());
                    }
                    this.setState({
                        totalcliente: response.data.cliente,
                        totalventa: response.data.totalventa,
                        montototal: response.data.montototal,
                        array_servicio: this.state.array_servicio,
                        cantidad_estadistica: this.state.cantidad_estadistica,
                        loading: true,
                    })
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
        ).catch(
            error => {
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
                notification.error({
                    message: 'ERROR',
                    description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
                    zIndex: 1200,
                });
            }
        );
    }
    render() {

        //if (!this.state.loading) return null;

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }
        today = mm + '/' + dd + '/' + yyyy;


        var servicio = {
            labels: this.state.array_servicio,
            datasets: [{
                label: 'MANTENIMIENTOS',
                backgroundColor: 'rgba(0, 255, 0, 1)',
                borderColor: 'black',
                borderWidth: 1,
                hoverBackGroundColor: 'rgba(0, 255, 0, .2)',
                hoverBorderColor: '#FFFF00',
                data: this.state.cantidad_estadistica,
            }]
        }

        var opciones = {
            maintainAspectRatio: false,
            response: true,
        };


        var circular = {
            labels: this.state.array_servicio,
            datasets: [{
                data: this.state.cantidad_estadistica,
                backgroundColor: this.state.array_color,
            }]
        };

        var opcioncircular = {
            response: true,
        }

        return (
            <div style={{'width': '100%'}}>
                <div className="tabs-animation">
                    
                    <div className="card mb-3">
                        <div className="card-header-tab card-header">
                            <div className="card-header-title font-size-lg text-capitalize font-weight-normal">
                                <i className="header-icon lnr-laptop-phone mr-3 text-muted opacity-6"> </i>
                                    BIENVENIDO AL SISTEMA LIMSERVIP
                            </div>
                        </div>
                    </div>
                    <div className="tabs-animation">
                        <div className="row">
                        </div>

                        <div className="rows">
                            <div className="cards">
                                <div className="forms-groups" style={{width: '100%', height: 500,}}>
                                    <WrappedMap 
                                        googleMapURL={'https://maps.googleapis.com/maps/api/js?key=AIzaSyAofod0Bp0frLcLHVLxuacn0QBXqVyJ7lc&v=3.exp&libraries=geometry,drawing,places'}
                                        loadingElement={ <div style={ {height:'100%', } }></div> }
                                        containerElement={ <div style={ {height: '100%',} }></div> }
                                        mapElement={ <div style={ {height: '100%',} }></div> }
                                    >
                                        <Marker
                                            // google={this.props.google}
                                            // name={ this.state.nombre.toString().trim().length == 0 ? '-' : this.state.nombre }
                                            //draggable={true}
                                            //onDragEnd={this.onMarkerDragEnd.bind(this)}
                                            position={{ lat: -17.775404, lng: -63.165923, }}
                                        />
                                        <InfoWindow
                                            //onClose={this.onInfoWindowClose.bind(this)}
                                            position={{ lat: (-17.775404 + 0.0029), lng: -63.165923 }}
                                        >
                                            <div>
                                                <span style={{ padding: 0, margin: 0 }}>
                                                    {'aslmlkamsd'}
                                                </span>
                                            </div>
                                        </InfoWindow>
                                    </WrappedMap>
                                </div>
                            </div>
                        </div>

                        <div className='forms-groups'>
                            <div className='cols-lg-4 cols-md-4 cols-sm-4'></div>
                            <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12' style={{paddingTop: 0, }}>
                                <div className='inputs-groups'>
                                    <input type='text' placeholder='INGRESAR DESCRIPCION...'
                                        style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                        className={`forms-control`}
                                        value={this.state.texto}
                                        onChange={ (event) => this.setState({texto: event.target.value,}) }
                                    />
                                </div>
                            </div>
                        </div>



                    </div>
                </div>
            </div>
            
        );
    }
}

Home.propTypes = {
    permisos_habilitados: PropTypes.array,
}


Home.defaultProps = {
    permisos_habilitados: [],
}



