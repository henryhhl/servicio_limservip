
import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import axios from 'axios';

import { notification, Card, Transfer, Switch, Button, Modal, DatePicker, Select } from 'antd';
import 'antd/dist/antd.css';
import web from './utils/services';

import moment from 'moment';
import PropTypes from 'prop-types';

class Perfil extends Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: false,
            visible_loading: false,
            usuario: {
                id: '',
                nombre: '',
                apellido: '',
                nacimiento: '',
                usuario: '',
                imagen: '',
                genero: 'N',
                email: '',
                rol: '',
                descripcion: '',
            },
            nombre: '',
            apellido: '',
            nacimiento: '',
            imagen: '',
            genero: 'N',
            email: '',
            imagen: '',
            foto: '',
            error_nombre: '',
            error_email: '',
        }
    }
    componentDidMount() {
        this.props.get_link('perfil', true);
        this.get_data();
    }
    get_data() {
        axios.get( web.servidor + '/perfil').then(
            (response) => {
                if (response.data.response == -3) {
                    this.props.logout();
                    return;
                }
                if (response.data.response == 1) {
                    this.props.loadingservice(false, response.data.visitasitio);
                    this.setState({
                        usuario: response.data.usuario,
                        nombre: response.data.usuario.nombre,
                        apellido: response.data.usuario.apellido == null ? '' : response.data.usuario.apellido,
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
    onValidar() {
        if (this.state.email.toString().length > 0) {
            var email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!email.test(this.state.email)) {
                notification.error({
                    message: 'ERROR',
                    description: 'EMAIL INCORRECTO.',
                });
                this.setState({ error_email: 'error', });
                return;
            }
        }
        if ( this.state.nombre.toString().trim().length > 0 ) {
            this.onSesion();
        }else {
            if (this.state.nombre.toString().trim().length == 0) {
                this.setState({ error_nombre: 'error', });
            }
            notification.error({
                message: 'ERROR',
                description: 'FAVOR DE LLENAR LOS CAMPOS REQUERIDOS.',
            });
        }
    }
    onSesion() {
        this.setState({ visible_loading: true, });
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

        var nacimiento = '';
        if (this.state.nacimiento != '') {
            var array = this.state.nacimiento.split('/');
            nacimiento = array[2] + '-' + array[1] + '-' + array[0];
        }

        var formdata = new FormData();
        formdata.append('nombre', this.state.nombre);
        formdata.append('apellido', this.state.apellido);
        formdata.append('email', this.state.email);
        formdata.append('nacimiento', nacimiento);
        formdata.append('genero', this.state.genero);
        formdata.append('imagen', this.state.foto);
        formdata.append('foto', this.state.imagen);
        axios(
            {
                method: 'post',
                url: web.servidor + '/update_perfil',
                data: formdata,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'enctype' : 'multipart/form-data',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                }
            }
        ).then(
            response => {
                if (response.data.response == 1) {
                    notification.success({
                        message: 'SUCCESS',
                        description: 'PERFIL ACTUALIZADO EXITOSAMENTE.',
                    });
                    var img = document.getElementById('img-img');
                    img.value = '';
                    this.setState({ 
                        visible_loading: false, 
                        usuario: response.data.usuario,
                        nombre: '', apellido: '',
                        nacimiento: '', imagen: '',
                        genero: 'N', email: '',
                        imagen: '', foto: '',
                    });
                    this.props.updatePerfil(response.data.usuario);
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
    formato(date) {
        let fecha = date.split('-');
        let year = parseInt(fecha[0]);
        let month = (parseInt(fecha[1]) < 10)?'0' + parseInt(fecha[1]):parseInt(fecha[1]);
        let day = (parseInt(fecha[2]) < 10)?'0' + parseInt(fecha[2]):parseInt(fecha[2]);

        return day + '/' + month + '/' + year;
    }
    render() {
        var usuario =this.state.usuario;
        var colorsuccess = this.props.buttoncolor == '' ? 'primary' : this.props.buttoncolor;
        return (
            <div className='row'>
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
                <div className="tabs-animation" style={{width: '100%'}}>
                    <div className="card mb-3">
                        <div className="card-header-tab card-header">
                            <div className="card-header-title font-size-lg text-capitalize font-weight-normal">
                                <i className="header-icon lnr-laptop-phone mr-3 text-muted opacity-6"> </i>
                                    PERFIL DEL USUARIO
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row" style={{width: '100%'}}>
                    <div className="col-sm-12 col-lg-6">
                        <div className="card-hover-shadow-2x mb-3 card">
                            <div className="card-header-tab card-header">
                                <div className="card-header-title font-size-lg text-capitalize font-weight-normal">
                                    <i className="header-icon lnr-database icon-gradient bg-malibu-beach"> </i>
                                    DATOS DEL USUARIO
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
                                                                { (usuario.imagen == null || usuario.imagen == '')  ?
                                                                    <img width="42" className="rounded" src="/images/anonimo.jpg" alt="" /> :
                                                                    <img width="42" className="rounded" src={usuario.imagen} alt="" /> 
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="widget-content-left">
                                                            <div className="widget-heading">
                                                                { usuario.apellido == null ? usuario.nombre : usuario.nombre + ' ' + usuario.apellido }
                                                            </div>
                                                            <div className="widget-subheading">
                                                                { usuario.rol == null ? ' - ' : usuario.rol }
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
                                                            <div className="widget-heading">Genero</div>
                                                            <div className="widget-subheading">
                                                                { usuario.genero == 'N' ? ' - ': usuario.genero == 'M' ? 'Masculino' : 'Femenino' }
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
                                                            <div className="widget-heading">Fecha de Nacimiento</div>
                                                            <div className="widget-subheading">
                                                                { usuario.nacimiento == null ? ' - ': this.formato(usuario.nacimiento) }
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
                                                            <div className="widget-heading">Email</div>
                                                            <div className="widget-subheading">
                                                                { usuario.email == null ? ' - ': usuario.email }
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
                                                            <div className="widget-heading">Usuario</div>
                                                            <div className="widget-subheading">
                                                                { usuario.usuario }
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
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-lg-6">
                        <div className="card-hover-shadow-2x mb-3 card">
                            <div className="card-header-tab card-header">
                                <div className="card-header-title font-size-lg text-capitalize font-weight-normal">
                                    <i className="header-icon lnr-database icon-gradient bg-malibu-beach"> </i>
                                    ACTUALIZAR PERFIL
                                </div>
                            </div>
                            <div className="scroll-area-lg">
                                <div className="scrollbar-container">
                                    <div className="p-2">
                                        <div className='col-lg-12'>
                                            <div className='inputs-groups'>
                                                <input type='text'
                                                    className={`forms-control title_form ${this.props.buttoncolor}`} value={'Nombre'}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-12 mt-2'>
                                            <div className='inputs-groups'>
                                                <input type='text' placeholder='INGRESAR NOMBRE'
                                                    style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                    className={`forms-control ${this.state.error_nombre}`}
                                                    value={this.state.nombre}
                                                    onChange={ (event) => this.setState({nombre: event.target.value, error_nombre: '', }) }
                                                />
                                                {this.state.nombre.toString().length == 0 ? null : 
                                                    <i className='fa fa-close delete_icon'
                                                        onClick={() => this.setState({ nombre: '', }) }
                                                    ></i> 
                                                }
                                            </div>
                                        </div>
                                        <div className='col-lg-12 mt-2'>
                                            <div className='inputs-groups'>
                                                <input type='text'
                                                    className={`forms-control title_form ${this.props.buttoncolor}`} value={'Apellido'}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-12 mt-2'>
                                            <div className='inputs-groups'>
                                                <input type='text' placeholder='INGRESAR APELLIDO'
                                                    style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                    className={`forms-control`}
                                                    value={this.state.apellido}
                                                    onChange={ (event) => this.setState({apellido: event.target.value, }) }
                                                />
                                                {this.state.apellido.toString().length == 0 ? null : 
                                                    <i className='fa fa-close delete_icon'
                                                        onClick={() => this.setState({ apellido: '', }) }
                                                    ></i> 
                                                }
                                            </div>
                                        </div>

                                        <div className='col-lg-12 mt-2'>
                                            <div className='inputs-groups'>
                                                <input type='text'
                                                    className={`forms-control title_form ${this.props.buttoncolor}`} value={'Email'}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-12 mt-2'>
                                            <div className='inputs-groups'>
                                                <input type='text' placeholder='INGRESAR EMAIL'
                                                    style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                    className={`forms-control ${this.state.error_email}`}
                                                    value={this.state.email}
                                                    onChange={ (event) => this.setState({email: event.target.value, error_email: '', }) }
                                                />
                                                {this.state.email.toString().length == 0 ? null : 
                                                    <i className='fa fa-close delete_icon'
                                                        onClick={() => this.setState({ email: '', }) }
                                                    ></i> 
                                                }
                                            </div>
                                        </div>

                                        <div className='col-lg-12 mt-2'>
                                            <div className='inputs-groups'>
                                                <input type='text'
                                                    className={`forms-control title_form ${this.props.buttoncolor}`} value={'Nacimiento'}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-12 mt-2'>
                                            <div className='inputs-groups'>
                                                <DatePicker className={'hg_40'}
                                                    style={{width: '100%', minWidth: '100%', }}
                                                    placeholder='SELECCIONAR FECHA'
                                                    format={'DD/MM/YYYY'}
                                                    value={this.state.nacimiento == '' ? undefined: moment(this.state.nacimiento, 'DD/MM/YYYY')}
                                                    onChange={(date, dateString) => {
                                                        this.setState({ nacimiento: dateString, });
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className='col-lg-12 mt-2'>
                                            <div className='inputs-groups'>
                                                <input type='text'
                                                    className={`forms-control title_form ${this.props.buttoncolor}`} value={'Genero'}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-12 mt-2'>
                                            <div className='inputs-groups'>
                                                <Select
                                                    style={{ width: '100%', minWidth: '100%', }}
                                                    value={this.state.genero} className={'hg_40'}
                                                    onChange={ (value) => this.setState({genero: value, }) }
                                                >
                                                    <Select.Option value='N'>Ninguno</Select.Option>
                                                    <Select.Option value='F'>Femenino</Select.Option>
                                                    <Select.Option value='M'>Masculino</Select.Option>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className='col-lg-12 mt-2'>
                                            <div className='inputs-groups'>
                                                <input type='text'
                                                    className={`forms-control title_form ${this.props.buttoncolor}`} value={'Imagen'}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-12 mt-2'>
                                            <div className='inputs-groups'>
                                                <input type='file' id='img-img'
                                                    style={{ textAlign: 'left', paddingLeft: 10, paddingTop: 10, paddingRight: 24, }}
                                                    className={`forms-control`}
                                                    onChange={this.onChangeFoto.bind(this)}
                                                />
                                                {this.state.deleteimg ? 
                                                    <i className='fa fa-close delete_icon'
                                                        onClick={this.onDeleteImg.bind(this)}
                                                    ></i> :null
                                                }
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="d-block text-right card-footer">
                                <button className={"btn-hover-shine btn btn-" + colorsuccess}
                                    onClick={this.onValidar.bind(this)}
                                >
                                    Actualizar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        );
    }
}

Perfil.propTypes = {
    buttoncolor: PropTypes.string,
}

Perfil.defaultProps = {
    buttoncolor: '',
}

export default withRouter(Perfil);
