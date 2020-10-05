
import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

import { notification, Card, Modal, message, DatePicker, Select, Checkbox } from 'antd';
import 'antd/dist/antd.css';
import web from '../../utils/services';

import PropTypes from 'prop-types';
import moment from 'moment';

import { Page, Text, StyleSheet, View, Document, Image, PDFDownloadLink } from '@react-pdf/renderer';
import ReactToPrint, { PrintContextConsumer } from "react-to-print";

class ComponentToPrint extends React.Component {
    render() {
        var head = {padding: 8,  font: '500 10px Roboto', border: '1px solid #e8e8e8', };
        var body = { paddingLeft: 7,  border: '1px solid #e8e8e8', 
            paddingTop: 8, paddingRight: 3, paddingBottom: 5, font: '300 11px Roboto'
        };
        return (
            <table style={{width: '100%', paddingTop: 40, paddingBottom: 40,  }}>
                <tbody>
                    <tr>
                        <th colSpan='6' style={{fontSize: 15, textAlign: 'center', fontWeight: 'bold', paddingBottom: 10,}}>
                            REPORTE DE SOLICITUD DE PEDIDO
                        </th>
                    </tr>
                </tbody>
                <tbody>
                    
                    {this.props.array_resultado.map(
                        (data, key) => (
                            <tbody key={key}>
                                <tr>
                                    <td style={body}>
                                        <strong>Cliente: </strong>
                                    </td>
                                    <td style={body}>
                                        {data.usuario == null ? '- ' : 
                                            data.apellidouser == null ? data.usuario : data.usuario + ' ' + data.apellidouser
                                        }
                                    </td>
                                    <td style={body}>
                                        <strong>Email: </strong>
                                    </td>
                                    <td style={body}>
                                        {data.email == null ? '-' : data.email}
                                    </td>
                                    <td style={body}>
                                        <strong>Fecha: </strong>
                                    </td>
                                    <td style={body}>
                                        {data.fecha }
                                    </td>
                                </tr>
                                <tr>
                                    <td style={body}>
                                        <strong>Direccion: </strong>
                                    </td>
                                    <td style={body} colSpan="3">
                                        {data.direccion == null ? '-' : data.direccion} 
                                    </td>
                                    <td style={body}>
                                        <strong>Estado: </strong>
                                    </td>
                                    <td style={body}>
                                        {data.estadoproceso == 'P' ? 'PENDIENTE' : data.estadoproceso == 'E' ? 'EN PROCESO' : 'FINALIZADO'}
                                    </td>
                                </tr>
                                { (data.servicios.length == 0) ? null :  
                                    <tr>
                                        <th style={head}> ID </th>
                                        <th style={head}> SERVICIO </th>
                                        <th style={head}> CATEGORIA </th>
                                        <th style={head}> CANTIDAD </th>
                                        <th style={head}> PRECIO </th>
                                        <th style={head}> SUBTOTAL </th>
                                    </tr>
                                }
                                {data.servicios.map(
                                    (value, i) => {
                                        return (
                                            <tr key={i}>
                                                <th style={body}>
                                                    {value.id}
                                                </th>
                                                <th style={body}>
                                                    {value.servicio}
                                                </th>
                                                <th style={body}>
                                                    {value.categoria == null ? '' : value.categoria}
                                                </th>
                                                <th style={body}>
                                                    {value.cantidad}
                                                </th>
                                                <th style={body}>
                                                    {value.precio}
                                                </th>
                                                <th style={body}>
                                                    {value.cantidad * value.precio}
                                                </th>
                                            </tr>
                                        )
                                    }
                                )}
                                <tr>
                                    <th colSpan='6' style={{ padding: 3, color: 'black', fontSize: 8,textAlign: 'right', paddingRight: 5, }}>
                                        {  'TOTAL: ' + parseFloat( data.montototal ).toFixed(2)} 
                                    </th>
                                </tr>
                                
                            </tbody>
                        )
                    )}
                
                </tbody>
            </table>
        );
    }
}

class GenerarReporte extends Component {

    constructor(props) {
        super(props);
        this.state = {
            auth: false,
            loading: false,
            visible_loading: false,
            solicituddetalle: true,
            imprimirpdf: true,

            nrosolicitud: '',
            cliente: '',
            fechainicio: '',
            fechafin: '',
            montoinicio: '',
            montofinal: '',
            opcion: '<',

            array_resultado: [],
            
            descripcion: '',
            error_descripcion: '',
            errormontofinal: '',

            cargando: true,
        }
    }
    componentDidMount() {
        this.props.get_link('generar_reporte', true);
        this.get_data();
    }
    get_data() {
        axios.get( web.servidor + '/generar_reporte/create').then(
            (response) => {
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        this.props.loadingservice(false, '');
                        this.setState({
                            cargando: false,
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
        if (this.state.opcion == '!' && this.state.montoinicio != '' && this.state.montofinal != '') {
            if (this.state.montoinicio > this.state.montofinal) {
                this.setState({
                    errormontofinal: 'error',
                });
                notification.error({
                    description: 'EL MONTO FINAL DEBE SER MAYOR O IGUAL AL MONTO INICIO.',
                    zIndex: 1200,
                });
                return;
            }
        }
        this.setState({ visible_loading: true, });
        this.onSesion();
    }
    onSesion() {
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
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO. INTENTAR NUEVAMENTE.',
            });
            this.setState({ visible_loading: false, });
        } ).catch( error => {
            this.setState({ visible_loading: false, });
            notification.error({
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
            });
        });
    }
    onSubmit() {

        var fechainicio = '';
        if (this.state.fechainicio != '') {
            var array = this.state.fechainicio.split('/');
            fechainicio = array[2] + '-' + array[1] + '-' + array[0];
        }
        var fechafinal = '';
        if (this.state.fechafin != '') {
            var array = this.state.fechafin.split('/');
            fechafinal = array[2] + '-' + array[1] + '-' + array[0];
        }

        var formdata = new FormData();
        formdata.append('fechainicio', fechainicio);
        formdata.append('fechafinal', fechafinal);
        formdata.append('cliente', this.state.cliente);
        formdata.append('nrosolicitud', this.state.nrosolicitud);
        formdata.append('montoinicio', this.state.montoinicio);
        formdata.append('opcion', this.state.opcion);
        formdata.append('montofinal', this.state.montofinal);
        formdata.append('tiposolicitud', (this.state.solicituddetalle) ? '1' : '0');

        axios(
            {
                method: 'post',
                url: web.servidor + '/generar_reporte/generar',
                data: formdata,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'enctype' : 'multipart/form-data',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                }
            }
        ).then(
            response => {
                console.log(response.data)
                this.setState({ visible_loading: false, });
                if (response.data.response == 1) {
                    notification.success({
                        message: 'SUCCESS',
                        description: 'REPORTE ANALIZADO EXITOSAMENTE',
                    });
                    if (this.state.imprimirpdf) {
                        this.setState({ array_resultado: response.data.data, }, () => {
                            setTimeout(() => {
                                document.getElementById('pdf_render').click();
                            }, 1000);
                        });
                    }else {
                        this.setState({ visible_loading: false, array_resultado: response.data.data, }, () => {
                            setTimeout(() => {
                                document.getElementById('generate_print').click();
                            }, 1000);
                        });
                    }
                    return;
                }
                notification.error({
                    description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE INTENTAR.',
                });
            }
        ).catch( error => {
            this.setState({ visible_loading: false, });
            notification.error({
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
            });
        } );
    }
    render() {

        if (this.state.cargando) return null;

        var colorsuccess = this.props.buttoncolor == '' ? 'primary' : this.props.buttoncolor;
        var colordanger = this.props.buttoncolor == '' ? 'danger' : 'outline-' + this.props.buttoncolor;
        var colorback = this.props.buttoncolor == '' ? 'focus' : this.props.buttoncolor;


        const styles = StyleSheet.create({
            body: {
                paddingTop: 35, paddingBottom: 40,
                paddingHorizontal: 20,
            },
            tile: {
                fontWeight: 'bold',
            },
            section: {
                margin: 10, padding: 10, flexGrow: 1,
            },
            head: {
                width: '100%', height: 'auto',
                display: 'flex', flexDirection: 'row',
            },
            thead: {
                color: 'black', fontWeight: 'bold', fontSize: 10,
            },
            tbody: {
                color: 'black', fontSize: 8, height: 'auto',
            },
            borderwidth: {
                borderLeftWidth: 1, borderLeftColor: '#e8e8e8',
                borderRightWidth: 1, borderRightColor: '#e8e8e8',
                borderBottomWidth: 1, borderBottomColor: '#e8e8e8',
            },
        });

        const MyDoc = (
            <Document title={'REPORTE DE SOLICITUD DE PEDIDO'}>
                <Page size="A4" style={styles.body}>
                    <View style={{width: '100%', textAlign: 'center', paddingBottom: 15,}}>
                        <Text style={[styles.title, {fontSize: 12,}]}>
                            {'REPORTE DE SOLICITUD DE PEDIDO'}
                        </Text>
                    </View>

                    {this.state.array_resultado.map(
                        (data, key) => (
                            <View style={{width: '100%'}} key={key}>
                                <View style={ [styles.head, {borderWidth: 1, borderColor: '#e8e8e8', backgroundColor: '#f5f5f5'}] }>
                                    <View style={{width: '10%', padding: 3, }}>
                                        <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                            CLIENTE: 
                                        </Text>
                                    </View>
                                    <View style={{width: '30%', padding: 3, }}>
                                        <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                            {data.usuario == null ? '- ' : 
                                                data.apellidouser == null ? data.usuario : data.usuario + ' ' + data.apellidouser
                                            }
                                        </Text>
                                    </View>
                                    <View style={{width: '10%', padding: 3, }}>
                                        <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                            Email: 
                                        </Text>
                                    </View>
                                    <View style={{width: '20%', padding: 3, }}>
                                        <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                            {data.email == null ? '-' : data.email}
                                        </Text>
                                    </View>
                                    <View style={{width: '10%', padding: 3, }}>
                                        <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                            FECHA
                                        </Text>
                                    </View>
                                    <View style={{width: '20%', padding: 3, }}>
                                        <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                            {data.fecha}
                                        </Text>
                                    </View>
                                </View>

                                <View style={ [styles.head, {borderWidth: 1, borderColor: '#e8e8e8', backgroundColor: '#f5f5f5'}] }>
                                    <View style={{width: '10%', padding: 3, }}>
                                        <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                            DIRECCION: 
                                        </Text>
                                    </View>
                                    <View style={{width: '60%', padding: 3, }}>
                                        <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                            {data.direccion == null ? '-' : data.direccion}
                                        </Text>
                                    </View>
                                    <View style={{width: '10%', padding: 3, }}>
                                        <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                            Estado: 
                                        </Text>
                                    </View>
                                    <View style={{width: '20%', padding: 3, }}>
                                        <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                            {data.estadoproceso == 'P' ? 'PENDIENTE' : data.estadoproceso == 'E' ? 'EN PROCESO' : 'FINALIZADO'}
                                        </Text>
                                    </View>
                                </View>

                                {data.servicios.length == 0 ? null :

                                    <View style={ [styles.head, {borderRightWidth: 1, borderColor: '#e8e8e8'}] }>
                                        <View style={{width: '5%', padding: 3, }}>
                                            <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                                ID
                                            </Text>
                                        </View>
                                        <View style={{width: '40%', padding: 3, }}>
                                            <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                                SERVICIO
                                            </Text>
                                        </View>
                                        <View style={{width: '25%', padding: 3, }}>
                                            <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                                CATEGORIA
                                            </Text>
                                        </View>
                                        <View style={{width: '10%', padding: 3, }}>
                                            <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                                CANTIDAD
                                            </Text>
                                        </View>
                                        <View style={{width: '10%', padding: 3, }}>
                                            <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                                PRECIO
                                            </Text>
                                        </View>
                                        <View style={{width: '10%', padding: 3, }}>
                                            <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                                SUBTOTAL
                                            </Text>
                                        </View>
                                    </View> 
                                }

                                {data.servicios.map(
                                    (value, i) => (
                                        <View key={i} style={ [styles.head, {borderRightWidth: 1, borderColor: '#e8e8e8'}] }>
                                            <View style={{width: '5%', padding: 3, }}>
                                                <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                                    {value.id}
                                                </Text>
                                            </View>
                                            <View style={{width: '40%', padding: 3, }}>
                                                <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                                    {value.servicio}
                                                </Text>
                                            </View>
                                            <View style={{width: '25%', padding: 3, }}>
                                                <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                                    {value.categoria}
                                                </Text>
                                            </View>
                                            <View style={{width: '10%', padding: 3, }}>
                                                <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                                    {value.cantidad}
                                                </Text>
                                            </View>
                                            <View style={{width: '10%', padding: 3, }}>
                                                <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                                    {value.precio}
                                                </Text>
                                            </View>
                                            <View style={{width: '10%', padding: 3, }}>
                                                <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                                    {value.cantidad * value.precio}
                                                </Text>
                                            </View>
                                        </View> 
                                    )
                                )}

                                <View style={ [styles.head, {borderWidth: 1, borderColor: '#e8e8e8', backgroundColor: '#f5f5f5'}] }>
                                    <View style={{width: '100%', padding: 3, }}>
                                        <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,textAlign: 'right', paddingRight: 15,} ]}>
                                           TOTAL:  {parseFloat(data.montototal).toFixed(2)}
                                        </Text>
                                    </View>
                                </View>

                            </View>
                        )
                    )}
                    
                    <Text style={{left: 0, right: 25, color: 'grey', bottom: 15, 
                            position: 'absolute', textAlign: 'right', fontSize: 10, 
                        }}
                        render={ ({ pageNumber, totalPages }) => (
                            `${pageNumber} / ${totalPages}`
                        )} fixed
                    />
                </Page>
            </Document>
        );


        return (
            <div className="rows">
                <Modal
                    title="Cargando Informacion"
                    centered closable={ false }
                    visible={this.state.visible_loading}
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

                <PDFDownloadLink document={ MyDoc } fileName='mantenimiento.pdf' >
                    { ( {blob, url, loading, error} ) => 
                        // ( loading ? 'LOADING DOCUMENT...' : <button style={{display: 'none'}} id='pdf_render'>insertar</button> ) 
                        ( loading ? 'LOADING DOCUMENT...' : <a href={url} id='pdf_render' style={{display: 'none'}} target='_blank'>insertar</a> ) 
                    }
                </PDFDownloadLink>

                <ReactToPrint bodyClass={'mt_30'} pageStyle={'pt_20'} 
                    onBeforePrint={() => this.setState({visible_reporte: false, })} 
                    content={() => this.componentRef}
                >
                    <PrintContextConsumer >
                        {({ handlePrint }) => (
                            <a style={{display: 'none',}} onClick={handlePrint} id="generate_print">Generar</a>
                        )}
                    </PrintContextConsumer>
                </ReactToPrint>
                <div style={{display: 'none'}}>
                    <ComponentToPrint array_resultado={this.state.array_resultado} ref={el => (this.componentRef = el)} />
                </div>

                <div className="cards">
                    <div className='forms-groups'>
                        <Card
                            style={{ width: '100%', minWidth: '100%', }}
                            title="GENERAR REPORTE"
                            headStyle={{fontSize: 14, }}
                            bodyStyle={{padding: 4, paddingTop: 0, }}
                        >
                            <div className="forms-groups">
                                <div className='cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12'>
                                    <div className='inputs-groups'>
                                        <input type='text' readOnly
                                            className={`forms-control title_form ${this.props.buttoncolor}`} value={'Nro Solicitud'}
                                        />
                                    </div>
                                </div>
                                <div className='cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12'>
                                    <div className='inputs-groups'>
                                        <input type='text' readOnly
                                            className={`forms-control title_form ${this.props.buttoncolor}`} value={'Fecha Inicio'}
                                        />
                                    </div>
                                </div>
                                <div className='cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12'>
                                    <div className='inputs-groups'>
                                        <input type='text' readOnly
                                            className={`forms-control title_form ${this.props.buttoncolor}`} value={'Fecha Final'}
                                        />
                                    </div>
                                </div>
                                <div className='cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12'>
                                    <div className='inputs-groups'>
                                        <input type='text' readOnly
                                            className={`forms-control title_form ${this.props.buttoncolor}`} value={'Cliente'}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="forms-groups">
                                <div className='cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12' style={{paddingTop: 0,}}>
                                    <div className='inputs-groups'>
                                        <input type='text' placeholder='INGRESAR NRO SOLICITUD'
                                            style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                            className={`forms-control`}
                                            value={this.state.nrosolicitud}
                                            onChange={ (event) => {
                                                if (!isNaN(event.target.value)) 
                                                this.setState({ nrosolicitud: parseInt(event.target.value) });
                                                else message.warning('SOLO SE PERMITE NUMERO');
                                            } }
                                        />
                                        {this.state.nrosolicitud.toString().length == 0 ? null : 
                                            <i className='fa fa-close delete_icon'
                                                onClick={() => this.setState({ nrosolicitud: '', }) }
                                            ></i> 
                                        }
                                    </div>
                                </div>
                                <div className='cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12' style={{paddingTop: 0,}}>
                                    <div className='inputs-groups'>
                                        <DatePicker className={'hg_40'}
                                            style={{width: '100%', minWidth: '100%', }}
                                            placeholder='SELECCIONAR FECHA INICIO'
                                            format={'DD/MM/YYYY'}
                                            value={this.state.fechainicio == '' ? undefined: moment(this.state.fechainicio, 'DD/MM/YYYY')}
                                            onChange={(date, dateString) => {
                                                this.setState({ fechainicio: dateString, });
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className='cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12' style={{paddingTop: 0,}}>
                                    <div className='inputs-groups'>
                                        <DatePicker className={'hg_40'}
                                            style={{width: '100%', minWidth: '100%', }}
                                            placeholder='SELECCIONAR FECHA FINAL'
                                            format={'DD/MM/YYYY'}
                                            value={this.state.fechafin == '' ? undefined: moment(this.state.fechafin, 'DD/MM/YYYY')}
                                            onChange={(date, dateString) => {
                                                this.setState({ fechafin: dateString, });
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className='cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12' style={{paddingTop: 0,}}>
                                    <div className='inputs-groups'>
                                        <input type='text' placeholder='INGRESAR CLIENTE'
                                            style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                            className={`forms-control`}
                                            value={this.state.cliente}
                                            onChange={ (event) => {
                                                this.setState({ cliente: parseInt(event.target.value) });
                                            } }
                                        />
                                        {this.state.cliente.toString().length == 0 ? null : 
                                            <i className='fa fa-close delete_icon'
                                                onClick={() => this.setState({ cliente: '', }) }
                                            ></i> 
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="forms-groups">
                                <div className='cols-lg-1 cols-md-1 cols-sm-1'></div>
                                <div className='cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12' style={{paddingTop: 2,}}>
                                    <div className='inputs-groups'>
                                        <input type='text' readOnly
                                            className={`forms-control title_form ${this.props.buttoncolor}`} value={'Monto Inicio'}
                                        />
                                    </div>
                                </div>
                                <div className='cols-lg-2 cols-md-2 cols-sm-2'></div>
                                <div className='cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12' style={{paddingTop: 2,}}>
                                    <div className='inputs-groups'>
                                        <input type='text' readOnly
                                            className={`forms-control title_form ${this.props.buttoncolor}`} value={'Monto Final'}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="forms-groups">
                                <div className='cols-lg-1 cols-md-1 cols-sm-1'></div>
                                <div className='cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12' style={{paddingTop: 0,}}>
                                    <div className='inputs-groups'>
                                        <input type='text' placeholder='INGRESAR MONTO'
                                            style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                            className={`forms-control`}
                                            value={this.state.montoinicio}
                                            onChange={ (event) => {
                                                if (event.target.value == '') {
                                                    this.setState({montoinicio: '', montofinal: '', opcion: '<',});
                                                    return;
                                                }
                                                if (!isNaN(event.target.value)) 
                                                this.setState({ montoinicio: parseFloat(event.target.value) });
                                                else message.warning('SOLO SE PERMITE NUMERO');
                                            } }
                                        />
                                        {this.state.montoinicio.toString().length == 0 ? null : 
                                            <i className='fa fa-close delete_icon'
                                                onClick={() => this.setState({ montoinicio: '', montofinal: '', opcion: '<' }) }
                                            ></i> 
                                        }
                                    </div>
                                </div>
                                <div className='cols-lg-2 cols-md-2 cols-sm-2 cols-xs-12' style={{paddingTop: 0,}}>
                                    <div className='inputs-groups'>
                                        <Select
                                            style={{ width: '100%', minWidth: '100%', textAlign: 'center' }}
                                            value={this.state.opcion} className={'hg_40'}
                                            onChange={ (value) => this.setState({opcion: value, }) }
                                        >
                                            <Select.Option value='<'> {'menor'} </Select.Option>
                                            <Select.Option value='<='> {'menor y igual'} </Select.Option>
                                            <Select.Option value='>'> {'mayor'} </Select.Option>
                                            <Select.Option value='>='> {'mayor y igual'} </Select.Option>
                                            <Select.Option value='='> {'igual'} </Select.Option>
                                            <Select.Option value='!'>ENTRE</Select.Option>
                                        </Select>
                                    </div>
                                </div>
                                <div className='cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12' style={{paddingTop: 0,}}>
                                    <div className='inputs-groups'>
                                        <input type='text' placeholder='INGRESAR MONTO'
                                                style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, 
                                                    background: (this.state.montoinicio == '' || this.state.opcion != '!') ? '#f5f5f5' : 'white'
                                                }}
                                                className={`forms-control ${this.state.errormontofinal}`}
                                                value={this.state.montofinal}
                                                readOnly={(this.state.montoinicio == '' || this.state.opcion != '!') ? true : false}
                                                onChange={ (event) => {
                                                    if (event.target.value == '') {
                                                        this.setState({montofinal: ''});
                                                        return;
                                                    }
                                                    if (!isNaN(event.target.value)) this.setState({ montofinal: parseFloat(event.target.value), errormontofinal: '' });
                                                    else message.warning('SOLO SE PERMITE NUMERO');
                                                } }
                                            />
                                            {this.state.montofinal.toString().length == 0 ? null : 
                                                <i className='fa fa-close delete_icon'
                                                    onClick={() => this.setState({ montofinal: '', }) }
                                                ></i> 
                                            }
                                    </div>
                                </div>
                            </div>
                            <div className='forms-groups mt-2' style={{display: 'flex', justifyContent: 'center',}}>
                                <div className="position-relative form-check mr-2">
                                    <label className="form-check-label">
                                        <input type="radio" className="form-check-input" 
                                            checked={this.state.solicituddetalle}
                                            onChange={() => {
                                                this.setState({solicituddetalle: !this.state.solicituddetalle, });
                                            }}
                                        /> 
                                        SOLICITUD PEDIDO DETALLADO
                                    </label>
                                </div>
                                <div className="position-relative form-check">
                                    <label className="form-check-label">
                                        <input type="radio" className="form-check-input" 
                                            checked={!this.state.solicituddetalle}
                                            onChange={() => {
                                                this.setState({solicituddetalle: !this.state.solicituddetalle, });
                                            }}
                                        /> 
                                        SOLICITUD PEDIDO GENERAL
                                    </label>
                                </div>
                            </div>
                            <div className='forms-groups mt-2' style={{display: 'flex', justifyContent: 'center',}}>
                                <Checkbox checked={!this.state.imprimirpdf} onChange={() => {
                                    this.setState({imprimirpdf: !this.state.imprimirpdf,});
                                }}>
                                    IMPRIMIR
                                </Checkbox>
                                <Checkbox checked={this.state.imprimirpdf} onChange={() => {
                                    this.setState({imprimirpdf: !this.state.imprimirpdf,});
                                }}>
                                    PDF
                                </Checkbox>
                            </div>
                        </Card>

                        <div className='forms-groups txts-center mt-4'>
                            <button className={"mb-2 mr-2 btn-hover-shine btn btn-" + colorsuccess}
                                onClick={this.onValidar.bind(this)}
                            >
                                Generar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

GenerarReporte.propTypes = {
    buttoncolor: PropTypes.string,
}

GenerarReporte.defaultProps = {
    buttoncolor: '',
}

export default withRouter(GenerarReporte);
