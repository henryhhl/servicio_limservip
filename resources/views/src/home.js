
import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';

import { notification, Card, Transfer, Switch, Button, Modal, DatePicker } from 'antd';
import 'antd/dist/antd.css';
import web from './utils/services';

import { Bar, HorizontalBar, Pie } from 'react-chartjs-2';
import { isPermission } from './utils/functions';
import permissions from './utils/permisions';

import PropTypes from 'prop-types';
import { GoogleMap, InfoWindow, Marker, withGoogleMap, withScriptjs } from 'react-google-maps';

import moment from 'moment';

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
            cargando: false,

            loading: false,
            array_color: [],
            texto: '',

            yearpormes: 0,
            yearpordia: 0,
            name_mes: '',
            fechainicioactual: '',
            fechafinactual: '',
            cantdiasmes: 0,

            array_mes: ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", 
                "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
            ],

            array_solicitudpordia: [],
            array_cantidaddiapormes: [],
            fechapormes: '',

            array_cantidadmesporyear: ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", 
                "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
            ],
            array_solicitudpormes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        }
    }

    componentDidMount() {
        this.props.get_link('home');
        this.get_data();
    }
    generarNumero(numero){
        return (Math.random()*numero).toFixed(0);
    }
    
    colorRGB(){
        var color = "("+this.generarNumero(255)+"," + this.generarNumero(255) + "," + this.generarNumero(255) +")";
        return "rgb" + color;
    }
    get_data() {
        let date = new Date();
        let month = date.getMonth() + 1;
        let year  = date.getFullYear();

        let diasmes = new Date(year, month, 0).getDate();
        let namemes = this.state.array_mes[month - 1];
        month = month < 10 ? '0' + month : month;
        let fechainicio = '01' + '/' + month + '/' + year;
        let fechafin = diasmes + '/' + month + '/' + year;

        axios(  {
            method: 'get',
            url: web.servidor + '/usuario/inicio',
            params: { 
                fechainicio: year + '-' + month + '-' + '01',
                fechafin: year + '-' + month + '-' + diasmes,

                fechainiciomes: year + '-' + '01' + '-' + '01',
                fechafinmes: year + '-' + '12' + '-' + '31',
            },
            responseType: 'json',
        } ).then(
            (response) => {
                if (response.data.response == -3) {
                    this.props.logout();
                    return;
                }
                console.log(response.data)
                if (response.data.response == 1) {
                    
                    for (let index = 0; index < diasmes; index++) {
                        this.state.array_cantidaddiapormes.push(index + 1);
                        this.state.array_solicitudpordia.push(0);
                    }
                    for (let index = 0; index < response.data.solicitud.length; index++) {
                        var element = response.data.solicitud[index];
                        this.state.array_solicitudpordia[element.dia * 1 - 1] = element.cantidad;
                    }
                    for (let index = 0; index < response.data.solicitud_mes.length; index++) {
                        var element = response.data.solicitud_mes[index];
                        this.state.array_solicitudpormes[element.mes * 1 - 1] = element.cantidad;
                    }

                    this.setState({
                        yearpormes: year,
                        yearpordia: year,
                        fechapormes: month + '/' + year,
                        name_mes: namemes,
                        fechainicioactual: fechainicio,
                        fechafinactual: fechafin,
                        cantdiasmes: diasmes,
                        
                        array_cantidaddiapormes: this.state.array_cantidaddiapormes,
                        array_solicitudpordia: this.state.array_solicitudpordia,

                        array_solicitudpormes: this.state.array_solicitudpormes,
                    }, () => {
                        setTimeout(() => {
                            this.setState({ loading: true, });
                        }, 500);
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
    get_year(year) {
        this.setState({cargando: true, });
        axios(  {
            method: 'get',
            url: web.servidor + '/estadistica/get_year',
            params: { 

                fechainicio: year + '-' + '01' + '-' + '01',
                fechafin: year + '-' + '12' + '-' + '31',
            },
            responseType: 'json',
        } ).then(
            (response) => {
                if (response.data.response == -3) {
                    this.props.logout();
                    return;
                }
                this.setState({cargando: false,});
                
                if (response.data.response == 1) {
                    this.state.array_solicitudpormes =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    for (let index = 0; index < response.data.solicitud.length; index++) {
                        var element = response.data.solicitud[index];
                        this.state.array_solicitudpormes[element.mes * 1 - 1] = element.cantidad;
                    }
                    
                    this.setState({
                        yearpormes: year,
                        array_solicitudpormes: this.state.array_solicitudpormes,
                    }, () => {
                        setTimeout(() => {
                            this.setState({loading: true,});
                        }, 500);
                    })
                    return;
                }
                notification.error({
                    description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
                    zIndex: 1200,
                })
            }
        ).catch(
            error => {
                notification.error({
                    description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
                    zIndex: 1200,
                });
                this.setState({cargando: false, loading: true,});
            }
        );
    }
    get_mes(date) {
        var array = date.split('/');
        let diasmes = new Date(array[1], array[0], 0).getDate();
        this.setState({cargando: true, });
        axios(  {
            method: 'get',
            url: web.servidor + '/estadistica/get_mes',
            params: { 
                fechainicio: array[1] + '-' + array[0] + '-' + '01',
                fechafin: array[1] + '-' + array[0] + '-' + diasmes,
            },
            responseType: 'json',
        } ).then(
            (response) => {
                if (response.data.response == -3) {
                    this.props.logout();
                    return;
                }
                this.setState({cargando: false,});
                
                if (response.data.response == 1) {
                    this.state.array_solicitudpordia = [];
                    this.state.array_cantidaddiapormes = [];
                    for (let index = 0; index < diasmes; index++) {
                        this.state.array_cantidaddiapormes.push(index + 1);
                        this.state.array_solicitudpordia.push(0);
                    }
                    for (let index = 0; index < response.data.solicitud.length; index++) {
                        var element = response.data.solicitud[index];
                        this.state.array_solicitudpordia[element.dia * 1 - 1] = element.cantidad;
                    }
                    
                    this.setState({
                        fechapormes: date,
                        yearpordia: array[1],
                        name_mes: this.state.array_mes[array[0] - 1],

                        array_cantidaddiapormes: this.state.array_cantidaddiapormes,
                        array_solicitudpordia: this.state.array_solicitudpordia,

                    }, () => {
                        setTimeout(() => {
                            this.setState({loading: true,});
                        }, 500);
                    })
                    return;
                }
                notification.error({
                    description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
                    zIndex: 1200,
                })
            }
        ).catch(
            error => {
                notification.error({
                    description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
                    zIndex: 1200,
                });
                this.setState({cargando: false, loading: true,});
            }
        );
    }
    render() {

        if (!this.state.loading) {
        
            return (
                <div className="rows">
                    <Modal
                        title="Cargando Informacion"
                        centered closable={ false }
                        visible={this.state.cargando}
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
                </div>
            );
        }

        return (
            <div style={{'width': '100%'}}>
                <Modal
                    title="Cargando Informacion"
                    centered closable={ false }
                    visible={this.state.cargando}
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
                            {(this.props.idrol == 1 || this.props.idrol == 2) ? 
                                <div className="cards">
                                    <div className="forms-groups">
                                        <Card
                                            style={{ width: '100%', }}
                                            title="ESTADISTICA DE SOLICITUD DE SERVICIOS POR DIA"
                                            bodyStyle={{padding: 0,}}
                                            headStyle={{fontSize: 14, }}
                                        >
                                            <div className='forms-groups'>
                                                <div className="forms-groups">
                                                    <div className="cols-lg-5 cols-md-5 cols-sm-5"></div>
                                                    <div className="cols-lg-2 cols-md-2 cols-sm-2 cols-xs-12">
                                                        <div className="inputs-groups">
                                                            <DatePicker style={{width: '100%', minWidth: '100%',}}
                                                                picker="month" 
                                                                onChange={(date, dateString) => {
                                                                    this.get_mes(dateString);
                                                                }}
                                                                placeholder='SELECCIONAR AÑO'
                                                                value={(this.state.fechapormes == '') ? undefined : moment(this.state.fechapormes, 'MM/YYYY')}
                                                                format="MM/YYYY"
                                                                allowClear={false}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={'cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'} style={{padding: 2, height: 300}}>
                                                    <Bar 
                                                        data={{
                                                            labels: this.state.array_cantidaddiapormes,
                                                            datasets: [{ 
                                                                label: this.state.name_mes + ' - ' + this.state.yearpordia,
                                                                backgroundColor: 'rgba(22, 170, 255, 0.8)',
                                                                borderColor: 'black',
                                                                borderWidth: 1,
                                                                hoverBackGroundColor: 'rgba(0, 123, 255, 0.8)',
                                                                hoverBorderColor: '#FFFF00',
                                                                data: this.state.array_solicitudpordia,
                                                            }]
                                                        }} 
                                                        options={{
                                                            maintainAspectRatio: false,
                                                            response: true,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                    <div className="forms-groups">
                                        <Card
                                            style={{ width: '100%', }}
                                            title="ESTADISTICA DE SOLICITUD DE SERVICIOS POR MES"
                                            bodyStyle={{padding: 0,}}
                                            headStyle={{fontSize: 14, }}
                                        >
                                            <div className='forms-groups'>
                                                <div className="forms-groups">
                                                    <div className="cols-lg-5 cols-md-5 cols-sm-5"></div>
                                                    <div className="cols-lg-2 cols-md-2 cols-sm-2 cols-xs-12">
                                                        <div className="inputs-groups">
                                                            <DatePicker style={{width: '100%', minWidth: '100%',}}
                                                                picker="year" 
                                                                onChange={(date, dateString) => {
                                                                    this.get_year(dateString);
                                                                }}
                                                                placeholder='SELECCIONAR AÑO'
                                                                value={(this.state.yearpormes == '' || this.state.yearpormes == 0) ? undefined : moment(this.state.yearpormes, 'YYYY')}
                                                                format="YYYY"
                                                                allowClear={false}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={'cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'} style={{padding: 2, height: 350,}}>
                                                    <HorizontalBar 
                                                        data={{
                                                            labels: this.state.array_cantidadmesporyear,
                                                            datasets: [{ 
                                                                label: this.state.yearpormes,
                                                                backgroundColor: 'rgba(75,192,192,0.4)',
                                                                borderColor: 'rgba(75,192,192,1)',
                                                                borderWidth: 1,
                                                                hoverBackGroundColor: 'rgba(75,192,192,1)',
                                                                hoverBorderColor: 'rgba(220,220,220,1)',
                                                                data: this.state.array_solicitudpormes,
                                                            }]
                                                        }} 
                                                        options={{
                                                            maintainAspectRatio: false,
                                                            response: true,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </div> : 
                                <div className="cards"></div>
                            }
                        </div>

                    </div>
                </div>
            </div>
            
        );
    }
}

Home.propTypes = {
    permisos_habilitados: PropTypes.array,
    idrol: PropTypes.any,
}


Home.defaultProps = {
    permisos_habilitados: [],
    idrol: null,
}



