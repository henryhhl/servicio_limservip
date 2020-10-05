
import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

import { notification, Card, Modal, message, DatePicker, Select, Checkbox } from 'antd';
import 'antd/dist/antd.css';
import web from '../../utils/services';

import PropTypes from 'prop-types';

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
            
            descripcion: '',
            error_descripcion: '',
            errormontofinal: '',
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
        var colorsuccess = this.props.buttoncolor == '' ? 'primary' : this.props.buttoncolor;
        var colordanger = this.props.buttoncolor == '' ? 'danger' : 'outline-' + this.props.buttoncolor;
        var colorback = this.props.buttoncolor == '' ? 'focus' : this.props.buttoncolor;
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
