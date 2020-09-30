
import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';
import { Page, Text, StyleSheet, View, Document, Image, PDFDownloadLink } from '@react-pdf/renderer';
import ReactToPrint, { PrintContextConsumer } from "react-to-print";
import { notification, Card, Modal, DatePicker, message, Select, Checkbox } from 'antd';
import 'antd/dist/antd.css';
import web from './utils/services';
import PropTypes from 'prop-types';
import moment from 'moment';


class ComponentToPrintDet extends React.Component {
    render() {
        var head = {padding: 10,  font: '500 12px Roboto',};
        var body = { paddingLeft: 10, 
            paddingTop: 8, paddingRight: 3, paddingBottom: 5, font: '300 13px Roboto'
        };
        var mtototaldet = 0;
        var monto = 0;
        var idventa = 0;
        var montodescuento = 0;
        return (
            <table style={{width: '100%', paddingTop: 40, paddingBottom: 40,  }} className='tables-respons'>
                <tbody>
                    <tr>
                        <th colSpan='7' style={{fontSize: 15, textAlign: 'center', fontWeight: 'bold', paddingBottom: 10,}}>
                            REPORTE DETALLADO DE SERVICIO DE MANTENIMIENTO
                        </th>
                    </tr>
                </tbody>
                    
                {this.props.array_resultprint.map(
                    (value, key) => {
                        monto = value.montototal;
                        montodescuento = value.mtodescuento;
                        if (idventa != value.id) {

                            mtototaldet += value.montototal * 1;
                            idventa = value.id;

                            var obj = {};
                            if (value.id * 1 > 1) {
                                obj = {marginTop: 20,}
                            }
                            return (
                                <tbody key={key}>
                                    { (value.id * 1 > 1) ? 
                                        <tr style={ {borderWidth: 1, borderColor: '#e8e8e8', backgroundColor: '#f5f5f5'} }>
                                            <th colSpan='7' style={{width: '100%', padding: 3, color: 'black', fontWeight: 'bold', fontSize: 8,textAlign: 'right', paddingRight: 5, }}>
                                                { 'DESC GRAL:  ' + parseFloat(this.props.array_resultprint[key - 1].mtodescuento).toFixed(2) + ' - TOTAL: ' + parseFloat(this.props.array_resultprint[key - 1].montototal).toFixed(2)} 
                                            </th>
                                        </tr> : null 
                                    }
                                    <tr style={obj}>
                                        <th style={{ padding: 3, color: 'black', fontWeight: 'bold', fontSize: 7, }}>
                                            {'VENDEDOR: '}
                                        </th>
                                        <th style={{ padding: 3, borderRightWidth: 1, borderColor: '#e8e8e8', color: 'black', fontWeight: 'bold', fontSize: 7 }}>
                                            
                                            {       (value.usuario == null) ? '-' :
                                                (value.userapellido == null) ? value.usuario : value.usuario + ' ' + value.userapellido
                                            }
                                        </th>
                                        <th colSpan='2' style={{width: '10%', padding: 3, color: 'black', fontWeight: 'bold', fontSize: 7, }}>
                                            {'CLIENTE: '}
                                        </th>
                                        <th style={{padding: 3, borderRightWidth: 1, borderColor: '#e8e8e8',color: 'black', fontWeight: 'bold', fontSize: 7, }}>
                                            
                                            {       (value.cliente == null) ? '-' :
                                                (value.cliapellido == null) ? value.cliente : value.cliente + ' ' + value.cliapellido
                                            }
                                        </th>
                                        <th style={{padding: 3, color: 'black', fontWeight: 'bold', fontSize: 7, }}>
                                            {'VEHICULO: '}
                                        </th>
                                        <th style={{ padding: 3, color: 'black', fontWeight: 'bold', fontSize: 7, }}>
                                            {(value.placa == null) ? '-' : value.placa}
                                        </th>
                                    </tr>
                                    <tr>
                                        <th style={{padding: 3, color: 'black', fontWeight: 'bold', fontSize: 8, }}>
                                                ID
                                        </th>
                                        <th style={{padding: 3, color: 'black', fontWeight: 'bold', fontSize: 8, }}>
                                                SERV/PROD
                                        </th>
                                        <th style={{padding: 3, color: 'black', fontWeight: 'bold', fontSize: 8, }}>
                                                MECANICO
                                        </th>
                                        <th style={{padding: 3, color: 'black', fontWeight: 'bold', fontSize: 8, }}>
                                                CANTIDAD
                                        </th>
                                        <th style={{padding: 3, color: 'black', fontWeight: 'bold', fontSize: 8, }}>
                                                PRECIO.
                                        </th>
                                        <th style={{padding: 3, color: 'black', fontWeight: 'bold', fontSize: 8, }}>
                                                DESC
                                        </th>
                                        <th style={{padding: 3, color: 'black', fontWeight: 'bold', fontSize: 8, }}>
                                                SUBTOTAL
                                        </th>
                                    </tr>
                                    <tr>
                                        <th style={{padding: 3, color: 'black', fontSize: 8 }}>
                                                {value.idproducto}
                                        </th>
                                        <th style={{padding: 3,color: 'black', fontSize: 8 }}>
                                                {value.descripcion}
                                        </th>
                                        <th style={{padding: 3, color: 'black', fontSize: 8 }}>
                                                {value.tipo == 'P' ? '-' : (value.mecanico == null) ? '-' : (value.mecapellido == null) ? 
                                                    value.mecanico : value.mecanico + ' ' + value.mecapellido
                                                }
                                        </th>
                                        <th style={{padding: 3, textAlign: 'right', paddingRight: 5, color: 'black', fontSize: 8 }}>
                                                {parseInt(value.cantidad)}
                                        </th>
                                        <th style={{padding: 3, textAlign: 'right', paddingRight: 5,color: 'black', fontSize: 8 }}>
                                                {value.precio}
                                        </th>
                                        <th style={{ padding: 3, textAlign: 'right', paddingRight: 5, color: 'black', fontSize: 8 }}>
                                                {parseInt(value.descuento)}
                                        </th>
                                        <th style={{padding: 3, textAlign: 'right', paddingRight: 5, color: 'black', fontSize: 8 }}>
                                                {parseFloat( (value.precio * value.cantidad) - (value.precio * value.cantidad * (value.descuento * 1 / 100)) ).toFixed(2)}
                                        </th>
                                    </tr>
                                </tbody>
                            );
                        }
                        return (
                            <tbody key={key}>
                                <tr>
                                    <th style={{padding: 3, color: 'black', fontSize: 8, }}>
                                            {value.idproducto}
                                    </th>
                                    <th style={{ padding: 3, color: 'black', fontSize: 8, }}>
                                            {value.descripcion}
                                    </th>
                                    <th style={{padding: 3, color: 'black', fontSize: 8, }}>
                                            {value.tipo == 'P' ? '-' : (value.mecanico == null) ? '-' : (value.mecapellido == null) ? 
                                                value.mecanico : value.mecanico + ' ' + value.mecapellido
                                            }
                                    </th>
                                    <th style={{padding: 3, textAlign: 'right', paddingRight: 5, color: 'black', fontSize: 8, }}>
                                            {parseInt(value.cantidad)}
                                    </th>
                                    <th style={{padding: 3, textAlign: 'right', paddingRight: 5, color: 'black', fontSize: 8, }}>
                                            {value.precio}
                                    </th>
                                    <th style={{padding: 3, textAlign: 'right', paddingRight: 5, color: 'black', fontSize: 8, }}>
                                            {parseInt(value.descuento)}
                                    </th>
                                    <th style={{ padding: 3, textAlign: 'right', paddingRight: 5, color: 'black', fontSize: 8, }}>
                                            {parseFloat( (value.precio * value.cantidad) - (value.precio * value.cantidad * (value.descuento * 1 / 100)) ).toFixed(2)}
                                        
                                    </th>
                                </tr>
                            </tbody>
                        );
                    }
                )}
                <tbody>
                    <tr>
                        <th colSpan='7' style={{ padding: 3, color: 'black', fontSize: 8,textAlign: 'right', paddingRight: 5, }}>
                                {  'DESC GRAL:' + parseFloat(montodescuento).toFixed(2) + ' - TOTAL: ' + parseFloat( monto ).toFixed(2)} 
                        </th>
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                    <th colSpan='7' style={{width: '100%', padding: 3, color: 'black', fontSize: 8,textAlign: 'right', paddingRight: 5, }}>
                            { 'TOTAL GENERAL: ' + parseFloat(mtototaldet).toFixed(2)} 
                    </th>
                    </tr>
                </tbody>
            </table>
        );
    }
}

class ComponentToPrint extends React.Component {
    render() {
        var head = {padding: 10,  font: '500 12px Roboto',};
        var body = { paddingLeft: 10, 
            paddingTop: 8, paddingRight: 3, paddingBottom: 5, font: '300 13px Roboto'
        };
        return (
            <table style={{width: '100%', paddingTop: 40, paddingBottom: 40,  }}>
                <tbody>
                    <tr>
                        <th colSpan='6' style={{fontSize: 15, textAlign: 'center', fontWeight: 'bold', paddingBottom: 10,}}>
                            REPORTE DE SERVICIO DE MANTENIMIENTO
                        </th>
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <th style={head}> ID </th>
                        <th style={head}> VENDEDOR </th>
                        <th style={head}> CLIENTE </th>
                        <th style={head}> PLACA VEH. </th>
                        <th style={head}> DESC </th>
                        <th style={head}> MONTO </th>
                    </tr>
                </tbody>
                <tbody>
                    
                    {this.props.array_resultprint.map(
                        (data, key) => (
                            <tr key={key}>
                                <td style={body}>
                                    {data.id}
                                </td>
                                <td style={body}>
                                    {data.usuario == null ? '- ' : 
                                        data.userapellido == null ? data.usuario : data.usuario + ' ' + data.userapellido
                                    }
                                </td>
                                <td style={body}>
                                    {data.cliente == null ? '- ' : 
                                        data.cliapellido == null ? data.cliente : data.cliente + ' ' + data.cliapellido
                                    }
                                </td>
                                <td style={body}>
                                    {data.placa == null ? '-' : data.placa}
                                </td>
                                <td style={body}>
                                    {parseInt(data.descuento)}
                                </td>
                                <td style={body}>
                                    {data.montototal}
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        );
    }
}

export default class Reporte extends Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: false,
            loading_page: false,
            visible_loading: false,
            fechainicio: '',
            fechafinal: '',
            montoinicio: '',
            montofinal: '',
            opcion: '<',
            venta: false,
            ventadetalle: true,
            pdf: true,
            imprimir:false,
            errormontofinal: '',
            array_resultado: [],
            array_resultadodet: [],
        }
    }
    componentDidMount() {
        this.props.get_link('reporte');
        // this.get_informacion();
        this.setState({
            loading_page: true,
        });
    }
    get_data() {
        axios.get( web.servidor + '/get_informacion').then(
            (response) => {
                if (response.data.response == -3) {
                    this.props.logout();
                    return;
                }
                if (response.data.response == 1) {
                    this.setState({
                        auth: response.data.auth,
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
    onValidar() {
        if (this.state.opcion == '!' && this.state.montoinicio != '' && this.state.montofinal != '') {
            if (this.state.montoinicio > this.state.montofinal) {
                this.setState({
                    errormontofinal: 'error',
                });
                notification.error({
                    message: 'ERROR',
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
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO. INTENTAR NUEVAMENTE.',
            });
            this.setState({ visible_loading: false, });
        } ).catch( error => {
            this.setState({ visible_loading: false, });
            notification.error({
                message: 'ERROR',
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
        if (this.state.fechafinal != '') {
            var array = this.state.fechafinal.split('/');
            fechafinal = array[2] + '-' + array[1] + '-' + array[0];
        }
        var formdata = new FormData();
        formdata.append('fechainicio', fechainicio);
        formdata.append('fechafinal', fechafinal);
        formdata.append('montoinicio', this.state.montoinicio);
        formdata.append('opcion', this.state.opcion);
        formdata.append('montofinal', this.state.montofinal);
        formdata.append('venta', (this.state.venta) ? '1' : '0');
        axios(
            {
                method: 'post',
                url: web.servidor + '/venta/reporte',
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
                if (response.data.response == 1) {
                    console.log(response.data)
                    notification.success({
                        message: 'SUCCESS',
                        description: 'REPORTE ANALIZADO EXITOSAMENTE.',
                    });
                    if (this.state.venta) {
                        if (this.state.pdf) {
                            this.setState({ visible_loading: false, array_resultado: response.data.data, }, () => {
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
                    }else {
                        if (this.state.pdf) {
                            this.setState({ visible_loading: false, array_resultado: response.data.data, }, () => {
                                setTimeout(() => {
                                    document.getElementById('pdfdet_render').click();
                                }, 1000);
                            });
                        }else {
                            this.setState({ visible_loading: false, array_resultado: response.data.data, }, () => {
                                setTimeout(() => {
                                    document.getElementById('generate_printdet').click();
                                }, 1000);
                            });
                        }
                    }
                    return;
                }
                this.setState({ visible_loading: false, });
            }
        ).catch( error => {
            this.setState({ visible_loading: false, });
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
            });
        } );
    }
    render() {

        if (!this.props.loading_page) return null;
        if (!this.state.loading_page) return null;

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

        var montototal = 0;
        
        const MyDoc = (
            <Document title={'REPORTE DE SERVICIO DE MANTENIMIENTO'}>
                <Page size="A4" style={styles.body}>
                    <View style={{width: '100%', textAlign: 'center', paddingBottom: 15,}}>
                        <Text style={[styles.title, {fontSize: 12,}]}>
                            {'REPORTE DE SERVICIO DE MANTENIMIENTO'}
                        </Text>
                    </View>
                    <View style={ [styles.head, {borderWidth: 1, borderColor: '#e8e8e8', backgroundColor: '#f5f5f5'}] }>
                        <View style={{width: '5%', padding: 3, }}>
                            <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                ID
                            </Text>
                        </View>
                        <View style={{width: '30%', padding: 3, }}>
                            <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                VENDEDOR
                            </Text>
                        </View>
                        <View style={{width: '30%', padding: 3, }}>
                            <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                CLIENTE
                            </Text>
                        </View>
                        <View style={{width: '15%', padding: 3, }}>
                            <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                PLACA VEH.
                            </Text>
                        </View>
                        <View style={{width: '10%', padding: 3, }}>
                            <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                DESC
                            </Text>
                        </View>
                        <View style={{width: '10%', padding: 3, }}>
                            <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                MONTO
                            </Text>
                        </View>
                    </View>
                    {this.state.array_resultado.map( (value, key) => {
                        montototal += value.montototal *1;
                        return (
                            <View key={key} style={ [styles.head, {borderWidth: 1, borderColor: '#e8e8e8',}] }>
                                <View style={{width: '5%', padding: 3, }}>
                                    <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 7,} ]}>
                                        {value.id}
                                    </Text>
                                </View>
                                <View style={{width: '30%', padding: 3, }}>
                                    <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 7,} ]}>
                                        {       (value.usuario == null) ? '-' :
                                            (value.userapellido == null) ? value.usuario : value.usuario + ' ' + value.userapellido
                                        }
                                    </Text>
                                </View>
                                <View style={{width: '30%', padding: 3, }}>
                                    <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 7,} ]}>
                                        {       (value.cliente == null) ? '-' :
                                            (value.cliapellido == null) ? value.cliente : value.cliente + ' ' + value.cliapellido
                                        }
                                    </Text>
                                </View>
                                <View style={{width: '15%', padding: 3, }}>
                                    <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 7,} ]}>
                                        {(value.placa == null) ? '-' : value.placa}
                                    </Text>
                                </View>
                                <View style={{width: '10%', padding: 3, }}>
                                    <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 7, textAlign: 'right', paddingRight: 5,} ]}>
                                        {parseInt(value.descuento)}
                                    </Text>
                                </View>
                                <View style={{width: '10%', padding: 3, }}>
                                    <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 7, textAlign: 'right', paddingRight: 5, } ]}>
                                        {value.montototal}
                                    </Text>
                                </View>
                            </View>
                        );
                    } )}
                    <View style={ [styles.head, {borderWidth: 1, borderColor: '#e8e8e8', backgroundColor: '#f5f5f5'}] }>
                        <View style={{width: '100%', padding: 3, }}>
                            <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,textAlign: 'right', paddingRight: 5,} ]}>
                                {parseFloat(montototal).toFixed(2)}
                            </Text>
                        </View>
                    </View>
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

        var mtototaldet = 0;
        var monto = 0;
        var idventa = 0;
        var montodescuento = 0;

        const MyDocDet = (
            <Document title={'REPORTE DE SERVICIO DETALLADO DE MANTENIMIENTO'}>
                <Page size="A4" style={styles.body}>
                    <View style={{width: '100%', textAlign: 'center', paddingBottom: 15,}}>
                        <Text style={[styles.title, {fontSize: 12,}]}>
                            {'REPORTE DE SERVICIO DE MANTENIMIENTO'}
                        </Text>
                    </View>
                    {this.state.array_resultado.map( (value, key) => {
                        monto = value.montototal;
                        montodescuento = value.mtodescuento;
                        if (idventa != value.id) {

                            mtototaldet += value.montototal * 1;
                            idventa = value.id;

                            var obj = {};
                            if (value.id * 1 > 1) {
                                obj = {marginTop: 20,}
                            }
                            return (
                                <View key={key} style={{width: '100%',}}>

                                    { (value.id * 1 > 1) ? 
                                        <View style={ [styles.head, {borderWidth: 1, borderColor: '#e8e8e8', backgroundColor: '#f5f5f5'}] }>
                                            <View style={{width: '100%', padding: 3, }}>
                                                <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,textAlign: 'right', paddingRight: 5,} ]}>
                                                    { 'DESC GRAL:  ' + parseFloat(this.state.array_resultado[key - 1].mtodescuento).toFixed(2) + ' - TOTAL: ' + parseFloat(this.state.array_resultado[key - 1].montototal).toFixed(2)} 
                                                </Text>
                                            </View>
                                        </View> : null 
                                    }

                                    <View style={ [styles.head, {borderWidth: 1, borderColor: '#e8e8e8',}, obj] }>
                                        <View style={{width: '10%', padding: 3, }}>
                                            <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 7,} ]}>
                                                {'VENDEDOR: '}
                                            </Text>
                                        </View>
                                        <View style={{width: '23%', padding: 3, borderRightWidth: 1, borderColor: '#e8e8e8' }}>
                                            <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 7,} ]}>
                                                {       (value.usuario == null) ? '-' :
                                                    (value.userapellido == null) ? value.usuario : value.usuario + ' ' + value.userapellido
                                                }
                                            </Text>
                                        </View>
                                        <View style={{width: '10%', padding: 3, }}>
                                            <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 7,} ]}>
                                                {'CLIENTE: '}
                                            </Text>
                                        </View>
                                        <View style={{width: '23%', padding: 3, borderRightWidth: 1, borderColor: '#e8e8e8' }}>
                                            <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 7,} ]}>
                                                {       (value.cliente == null) ? '-' :
                                                    (value.cliapellido == null) ? value.cliente : value.cliente + ' ' + value.cliapellido
                                                }
                                            </Text>
                                        </View>
                                        <View style={{width: '10%', padding: 3, }}>
                                            <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 7,} ]}>
                                                {'VEHICULO: '}
                                            </Text>
                                        </View>
                                        <View style={{width: '23%', padding: 3, }}>
                                            <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 7,} ]}>
                                                {(value.placa == null) ? '-' : value.placa}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={ [styles.head, {borderRightWidth: 1, borderColor: '#e8e8e8'}] }>
                                        <View style={{width: '5%', padding: 3, }}>
                                            <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                                ID
                                            </Text>
                                        </View>
                                        <View style={{width: '30%', padding: 3, }}>
                                            <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                                SERV/PROD
                                            </Text>
                                        </View>
                                        <View style={{width: '30%', padding: 3, }}>
                                            <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                                MECANICO
                                            </Text>
                                        </View>
                                        <View style={{width: '10%', padding: 3, }}>
                                            <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                                CANTIDAD
                                            </Text>
                                        </View>
                                        <View style={{width: '10%', padding: 3, }}>
                                            <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                                PRECIO.
                                            </Text>
                                        </View>
                                        <View style={{width: '5%', padding: 3, }}>
                                            <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                                DESC
                                            </Text>
                                        </View>
                                        <View style={{width: '10%', padding: 3, }}>
                                            <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                                SUBTOTAL
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={ [styles.head, {borderWidth: 1, borderColor: '#e8e8e8', backgroundColor: '#f5f5f5'}] }>
                                        <View style={{width: '5%', padding: 3, }}>
                                            <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                                {value.idproducto}
                                            </Text>
                                        </View>
                                        <View style={{width: '30%', padding: 3, }}>
                                            <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                                {value.descripcion}
                                            </Text>
                                        </View>
                                        <View style={{width: '30%', padding: 3, }}>
                                            <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                                {value.tipo == 'P' ? '-' : (value.mecanico == null) ? '-' : (value.mecapellido == null) ? 
                                                    value.mecanico : value.mecanico + ' ' + value.mecapellido
                                                }
                                            </Text>
                                        </View>
                                        <View style={{width: '10%', padding: 3, textAlign: 'right', paddingRight: 5, }}>
                                            <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                                {parseInt(value.cantidad)}
                                            </Text>
                                        </View>
                                        <View style={{width: '10%', padding: 3, textAlign: 'right', paddingRight: 5, }}>
                                            <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                                {value.precio}
                                            </Text>
                                        </View>
                                        <View style={{width: '5%', padding: 3, textAlign: 'right', paddingRight: 5, }}>
                                            <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                                {parseInt(value.descuento)}
                                            </Text>
                                        </View>
                                        <View style={{width: '10%', padding: 3, textAlign: 'right', paddingRight: 5, }}>
                                            <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                                {parseFloat( (value.precio * value.cantidad) - (value.precio * value.cantidad * (value.descuento * 1 / 100)) ).toFixed(2)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        }
                        return (
                            <View key={key} style={{width: '100%',}}>
                                <View style={ [styles.head, {borderWidth: 1, borderColor: '#e8e8e8',}] }>
                                    <View style={{width: '5%', padding: 3, }}>
                                        <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                            {value.idproducto}
                                        </Text>
                                    </View>
                                    <View style={{width: '30%', padding: 3, }}>
                                        <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                            {value.descripcion}
                                        </Text>
                                    </View>
                                    <View style={{width: '30%', padding: 3, }}>
                                        <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                            {value.tipo == 'P' ? '-' : (value.mecanico == null) ? '-' : (value.mecapellido == null) ? 
                                                value.mecanico : value.mecanico + ' ' + value.mecapellido
                                            }
                                        </Text>
                                    </View>
                                    <View style={{width: '10%', padding: 3, textAlign: 'right', paddingRight: 5, }}>
                                        <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                            {parseInt(value.cantidad)}
                                        </Text>
                                    </View>
                                    <View style={{width: '10%', padding: 3, textAlign: 'right', paddingRight: 5, }}>
                                        <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                            {value.precio}
                                        </Text>
                                    </View>
                                    <View style={{width: '5%', padding: 3, textAlign: 'right', paddingRight: 5, }}>
                                        <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                            {parseInt(value.descuento)}
                                        </Text>
                                    </View>
                                    <View style={{width: '10%', padding: 3, textAlign: 'right', paddingRight: 5, }}>
                                        <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,} ]}>
                                            {parseFloat( (value.precio * value.cantidad) - (value.precio * value.cantidad * (value.descuento * 1 / 100)) ).toFixed(2)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        );
                    } )}
                    <View style={ [styles.head, {borderWidth: 1, borderColor: '#e8e8e8', backgroundColor: '#f5f5f5'}] }>
                        <View style={{width: '100%', padding: 3, }}>
                            <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,textAlign: 'right', paddingRight: 5,} ]}>
                                {  'DESC GRAL:' + parseFloat(montodescuento).toFixed(2) + ' - TOTAL: ' + parseFloat( monto ).toFixed(2)} 
                            </Text>
                        </View>
                    </View>
                    <View style={ [styles.head, {borderWidth: 1, borderColor: '#e8e8e8', backgroundColor: '#f5f5f5'}] }>
                        <View style={{width: '100%', padding: 3, }}>
                            <Text style={[ {color: 'black', fontWeight: 'bold', fontSize: 8,textAlign: 'right', paddingRight: 5,} ]}>
                                { 'TOTAL GENERAL: ' + parseFloat(mtototaldet).toFixed(2)} 
                            </Text>
                        </View>
                    </View>
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

        var colorsuccess = this.props.buttoncolor == '' ? 'primary' : this.props.buttoncolor;

        return (
            <div className="rows">
                <PDFDownloadLink document={ MyDoc } fileName='mantenimiento.pdf' >
                    { ( {blob, url, loading, error} ) => 
                        // ( loading ? 'LOADING DOCUMENT...' : <button style={{display: 'none'}} id='pdf_render'>insertar</button> ) 
                        ( loading ? 'LOADING DOCUMENT...' : <a href={url} id='pdf_render' style={{display: 'none'}} target='_blank'>insertar</a> ) 
                    }
                </PDFDownloadLink>
                <PDFDownloadLink document={ MyDocDet } fileName='mantenimientodet.pdf' >
                    { ( {blob, url, loading, error} ) => 
                        // ( loading ? 'LOADING DOCUMENT...' : <button style={{display: 'none'}} id='pdf_render'>insertar</button> ) 
                        ( loading ? 'LOADING DOCUMENT...' : <a href={url} id='pdfdet_render' style={{display: 'none'}} target='_blank'>insertar</a> ) 
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
                    <ComponentToPrint array_resultprint={this.state.array_resultado} ref={el => (this.componentRef = el)} />
                </div>
                <ReactToPrint bodyClass={'mt_30'} pageStyle={'pt_20'} 
                    onBeforePrint={() => this.setState({visible_reporte: false, })} 
                    content={() => this.componentRef}
                >
                    <PrintContextConsumer >
                        {({ handlePrint }) => (
                            <a style={{display: 'none',}} onClick={handlePrint} id="generate_printdet">Generar</a>
                        )}
                    </PrintContextConsumer>
                </ReactToPrint>
                <div style={{display: 'none'}}>
                    <ComponentToPrintDet array_resultprint={this.state.array_resultado} ref={el => (this.componentRef = el)} />
                </div>
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
                <div className="cards">
                    <div className='forms-groups'>
                        <Card
                            style={{ width: '100%', minWidth: '100%', }}
                            title="REPORTE GENERAL"
                            headStyle={{fontSize: 14, }}
                            bodyStyle={{padding: 4, paddingTop: 0, }}
                        >
                            <div className="forms-groups" style={{marginTop: -10,}}>
                                <div className="forms-groups">
                                    <div className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12' style={{padding: 0, }}>
                                        <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <input type='text' readOnly
                                                    className={`forms-control title_form ${this.props.buttoncolor}`} value={'Fecha Inicio'}
                                                />
                                            </div>
                                        </div>
                                        <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <DatePicker className={'hg_40'}
                                                    style={{width: '100%', minWidth: '100%', }}
                                                    placeholder='SELECCIONAR FECHA'
                                                    format={'DD/MM/YYYY'}
                                                    value={this.state.fechainicio == '' ? undefined: moment(this.state.fechainicio, 'DD/MM/YYYY')}
                                                    onChange={(date, dateString) => {
                                                        if (dateString == '') {
                                                            this.setState({fechafinal: '', fechainicio: ''});
                                                            return;
                                                        }
                                                        this.setState({ fechainicio: dateString, });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12' style={{padding: 0, }}>
                                        <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <input type='text' readOnly
                                                    className={`forms-control title_form ${this.props.buttoncolor}`} value={'Fecha Final'}
                                                />
                                            </div>
                                        </div>
                                        <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <DatePicker className={'hg_40'}
                                                    style={{width: '100%', minWidth: '100%', }}
                                                    placeholder='SELECCIONAR FECHA'
                                                    format={'DD/MM/YYYY'}
                                                    disabled={this.state.fechainicio == '' ? true : false}
                                                    value={this.state.fechafinal == '' ? undefined: moment(this.state.fechafinal, 'DD/MM/YYYY')}
                                                    onChange={(date, dateString) => {
                                                        if (dateString >= this.state.fechainicio) {
                                                            this.setState({ fechafinal: dateString, });
                                                        }else {
                                                            message.warning('LA FECHA DEBE SER MAYOR O IGUAL A LA FECHA INICIO');
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="forms-groups" style={{marginTop: -10,}}>
                                    <div className='cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12' style={{padding: 0, }}>
                                        <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <input type='text' readOnly
                                                    className={`forms-control title_form ${this.props.buttoncolor}`} value={'Mto. Inicio'}
                                                />
                                            </div>
                                        </div>
                                        <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <input type='text' placeholder='INGRESAR MONTO'
                                                    style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                    className={`forms-control`}
                                                    value={this.state.montoinicio}
                                                    onChange={ (event) => {
                                                        if (event.target.value == '') {
                                                            this.setState({montoinicio: '', montofinal: ''});
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
                                    </div>
                                    <div className='cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12' style={{padding: 0, }}>
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
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
                                    </div>
                                    <div className='cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12' style={{padding: 0, }}>
                                        <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <input type='text' readOnly
                                                    className={`forms-control title_form ${this.props.buttoncolor}`} value={'Mto. Final'}
                                                />
                                            </div>
                                        </div>
                                        <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
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
                                </div>
                                <div className='forms-groups mt-2' style={{display: 'flex', justifyContent: 'center',}}>
                                    <div className="position-relative form-check mr-2">
                                        <label className="form-check-label">
                                            <input type="radio" className="form-check-input" 
                                                checked={this.state.ventadetalle}
                                                onChange={() => {
                                                    this.setState({venta: false, ventadetalle: true, });
                                                }}
                                            /> 
                                            SOLICITUD DE SERVICIO DETALLADO
                                        </label>
                                    </div>
                                    <div className="position-relative form-check">
                                        <label className="form-check-label">
                                            <input type="radio" className="form-check-input" 
                                                checked={this.state.venta}
                                                onChange={() => {
                                                    this.setState({venta: true, ventadetalle: false, });
                                                }}
                                            /> 
                                            SOLICITUD DE SERVICIOS
                                        </label>
                                    </div>
                                </div>
                                <div className='forms-groups mt-2' style={{display: 'flex', justifyContent: 'center',}}>
                                    <Checkbox checked={this.state.imprimir} onChange={() => {
                                        this.setState({imprimir: true, pdf: false,});
                                    }}>
                                        IMPRIMIR
                                    </Checkbox>
                                    <Checkbox checked={this.state.pdf} onChange={() => {
                                        this.setState({imprimir: false, pdf: true,});
                                    }}>
                                        PDF
                                    </Checkbox>
                                </div>
                                <div className='forms-groups txts-center mt-2'>
                                    <button className={"mb-2 mr-2 btn-hover-shine btn btn-" + colorsuccess}
                                        onClick={this.onValidar.bind(this)}
                                    >
                                        GENERAR REPORTE
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }
}

Reporte.propTypes = {
    buttoncolor: PropTypes.string,
    sizetext: PropTypes.string,
    loading_page: PropTypes.bool,
}

Reporte.defaultProps = {
    buttoncolor: '',
    sizetext: '',
    loading_page: false,
}
