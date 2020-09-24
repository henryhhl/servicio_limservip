
import React, { Component } from 'react';
import axios from 'axios';
import {withRouter, Redirect} from 'react-router-dom';

import { notification, Card, Modal, DatePicker } from 'antd';
import 'antd/dist/antd.css';
import web from '../../utils/services';

import moment from 'moment';
import PropTypes from 'prop-types';

class CreatePersonal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            auth: false,
            loading: false,

            visible_rol: false,
            new_create: false,
            loading_create: false,

            nombre_rol: '',
            error_nombrerol: '',
            descripcion_rol: '',
            
            nombre: '',
            apellido: '',
            ci: '',
            ciudad: '',
            direccion: '',
            nacimiento: '',
            email: '',
            contacto: '',
            imagen: '',
            foto: '',
            deleteimg: false,
            usuario: '',
            password: '',

            rol: {id: '', nombre: '',},

            array_rol: [],
            
            error_nombre: '',
            error_apellido: '',
            error_ci: '',
            error_email: '',
            error_usuario: '',
            error_password: '',
            error_rol: '',
        }
    }
    componentDidMount() {
        this.props.get_link('personal', true);
        this.get_data();
    }
    get_data() {
        axios.get( web.servidor + '/personal/create').then(
            (response) => {
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        this.props.loadingservice(false, '');
                        this.setState({
                            array_rol: response.data.data,
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
    onBack() {
        this.props.history.goBack();
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
        if ( this.state.nombre.toString().trim().length > 0 && this.state.usuario.toString().trim().length > 0 &&
                this.state.apellido.toString().trim().length > 0 && this.state.ci.toString().trim().length > 0 &&
                this.state.password.toString().trim().length > 0 && this.state.rol.id.toString().trim().length > 0
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
            if (this.state.apellido.toString().trim().length == 0) {
                notification.error({
                    message: 'ERROR',
                    description: 'APELLIDO REQUERIDO.',
                });
                this.setState({ error_apellido: 'error', });
                return;
            }
            if (this.state.ci.toString().trim().length == 0) {
                notification.error({
                    message: 'ERROR',
                    description: 'CEDULA IDENTIDAD REQUERIDO.',
                });
                this.setState({ error_ci: 'error', });
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
            if (this.state.rol.id.toString().trim().length == 0) {
                notification.error({
                    message: 'ERROR',
                    description: 'GRUPO DE USUARIO REQUERIDO.',
                });
                this.setState({ error_rol: 'error', });
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

        var nacimiento = '';
        if (this.state.nacimiento != '') {
            var array = this.state.nacimiento.split('/');
            nacimiento = array[2] + '-' + array[1] + '-' + array[0];
        }

        var formdata = new FormData();
        formdata.append('nombre', this.state.nombre);
        formdata.append('apellido', this.state.apellido);
        formdata.append('ci', this.state.ci);
        formdata.append('ciudad', this.state.ciudad);
        formdata.append('direccion', this.state.direccion);
        formdata.append('nacimiento', nacimiento);
        formdata.append('email', this.state.email);
        formdata.append('contacto', this.state.contacto);
        formdata.append('imagen', this.state.imagen);
        formdata.append('foto', this.state.foto);
        formdata.append('usuario', this.state.usuario);
        formdata.append('password', this.state.password);

        formdata.append('idrol', this.state.rol.id);

        axios(
            {
                method: 'post',
                url: web.servidor + '/personal/store',
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
                        description: 'PERSONAL CREADO EXITOSAMENTE',
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
    onSubmitRol() {
        var formdata = new FormData();
        formdata.append('nombre', this.state.nombre_rol);
        formdata.append('descripcion', this.state.descripcion_rol);
        axios(
            {
                method: 'post',
                url: web.servidor + '/rol/store',
                data: formdata,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'enctype' : 'multipart/form-data',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                }
            }
        ).then(
            response => {
                if (response.status == 200) {
                    if (response.data.response == 1) {
                        notification.success({
                            message: 'SUCCESS',
                            description: 'ROL REGISTRADO EXITOSAMENTE.',
                        });
                        this.setState({
                            visible_rol: false, new_create: false,
                            loading_create: false, nombre_rol: '',
                            descripcion_rol: '', rol: response.data.data, 
                            array_rol: response.data.rol,
                        });
                        return;
                    }
                    if (response.data.response == -1) {
                        notification.warning({
                            message: 'ADVERTENCIA',
                            description: 'NO SE PERMITE ROL REPETIDO.',
                        });
                        this.setState({ error_nombrerol: 'error', });
                    }
                }
                this.setState({ loading_create: false, });
            }
        ).catch( error => {
            this.setState({ loading_create: false, });
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
            });
            if (error.response.status == 401) {
                this.setState({ auth: true, });
            }
        } );
    }
    onSesionRol() {
        axios.get( web.servidor + '/home/sesion')
        .then( response => {
            if (response.data.response == 1) {
                if (response.data.sesion) {
                    this.props.logout();
                    return;
                }
                this.onSubmitRol();
                return;
            }
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO. INTENTAR NUEVAMENTE.',
            });
            this.setState({ loading_create: false, });
        } ).catch( error => {
            this.setState({ loading_create: false, });
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
            });
        });
    }
    onValidarRol() {
        if (this.state.nombre_rol.toString().trim().length == 0) {
            notification.error({
                message: 'ADVERTENCIA',
                description: 'CAMPO NOMBRE REQUERIDO',
            });
            this.setState({ error_nombrerol: 'error', });
            return;
        }
        this.setState({ loading_create: true, });
        this.onSesionRol();
    }
    style_selected(data, id) {
        var objecto = { cursor: 'pointer', width: '100%', minWidth: '100%', fontSize: 13,
            height: 18, lineHeight: 0, textAlign: 'center',
            background: (data == null) ? 'white' : (data.id == id) ? '#e0f3ff' : 'white',
            color: (data == null) ? 'rgba(0, 0, 0, 0.65)' : (data.id == id) ? '#3f6ad8' : 'rgba(0, 0, 0, 0.65)',
            fontWeight: (data == null) ? '400' : (data.id == id) ? 'bold' : '400',
        }
        return objecto;
    }
    onModalRol() {
        var rol = this.state.rol;
        var colorsuccess = this.props.buttoncolor == '' ? 'primary' : this.props.buttoncolor;
        var colordanger = this.props.buttoncolor == '' ? 'danger' : 'outline-' + this.props.buttoncolor;
        var colornew = this.props.buttoncolor == '' ? 'secondary' : this.props.buttoncolor;
        return (
            <Modal
                title={(!this.state.new_create) ? <div>&nbsp;</div> : null}
                visible={this.state.visible_rol}
                onCancel={() => {
                    if (!this.state.new_create) {
                        this.setState({
                            visible_rol: false, new_create: false,
                            loading_create: false,
                        })
                    }
                }}
                bodyStyle={{padding: 0, paddingBottom: 5,}}
                style={{ top: 100, }} width={500} footer={null}
            >
                <div className="forms-groups">
                    {(!this.state.new_create) ?
                        <Card title="ROL" 
                            bodyStyle={{ padding: 0, }} style={{position: 'relative', top: -9,}}
                            headStyle={{color: 'white', background: '#1890ff', fontSize: 14, fontWeight: 'bold'}}
                            extra={
                                <button className={"btn-hover-shine btn btn-" + colornew}
                                    onClick={() => this.setState({new_create: true,})}
                                >
                                    Nuevo
                                </button>
                            }
                        >
                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                style={{
                                    padding: 0, height: 'auto', maxHeight: 350, overflowY: 'auto',
                                    overflowX: 'none',
                                }}
                            >
                                {this.state.array_rol.map(
                                    (data, key) => (
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                            style={{ padding: 0, }} key={key}
                                            onClick={() => this.setState({ rol: data, visible_rol: false, }) }
                                        >
                                            <Card.Grid hoverable={false} 
                                                style={ this.style_selected(rol, data.id) }
                                            >
                                                {data.nombre}
                                            </Card.Grid>
                                        </div>
                                    )
                                )}
                                <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                    style={{ padding: 0, }}
                                >
                                    <Card.Grid hoverable={false} className='gridStyle'
                                        style={{ cursor: 'pointer', width: '100%' }}>
                                    </Card.Grid>
                                </div>
                            </div>
                        </Card> : 
                        <div className="cards">
                            <div className="card-header-tab card-header">
                                <div className="card-header-title font-size-lg text-capitalize font-weight-normal">
                                    <i className="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
                                        NUEVO ROL
                                </div>
                            </div>
                            {(!this.state.loading_create) ?
                                <div className='forms-groups'>
                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{ paddingTop: 0, }}>
                                        <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <input type='text'
                                                    className={`forms-control title_form ${this.props.buttoncolor}`} value={'Nombre'}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <input type='text' placeholder='INGRESAR NOMBRE'
                                                    style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                    className={`forms-control ${this.state.error_nombrerol}`}
                                                    value={this.state.nombre_rol}
                                                    onChange={ (event) => this.setState({nombre_rol: event.target.value.toUpperCase(), error_nombrerol: '', }) }
                                                />
                                                {this.state.nombre_rol.toString().length == 0 ? null : 
                                                    <i className='fa fa-close delete_icon'
                                                        onClick={() => this.setState({ nombre_rol: '', }) }
                                                    ></i> 
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 mb-4' style={{ paddingTop: 0, }}>
                                        <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <input type='text'
                                                    className={`forms-control title_form ${this.props.buttoncolor}`} value={'Descripcion'}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <input type='text' placeholder='INGRESAR DESCRIPCION'
                                                    style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                    className={`forms-control`}
                                                    value={this.state.descripcion_rol}
                                                    onChange={ (event) => this.setState({descripcion_rol: event.target.value, }) }
                                                />
                                                {this.state.descripcion_rol.toString().length == 0 ? null : 
                                                    <i className='fa fa-close delete_icon'
                                                        onClick={() => this.setState({ descripcion_rol: '', }) }
                                                    ></i> 
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className='forms-groups txts-center mt-4'>
                                        <button className={"mb-2 mr-2 btn-hover-shine btn btn-" + colorsuccess}
                                            onClick={this.onValidarRol.bind(this)}
                                        >
                                            Aceptar
                                        </button>
                                        <button className={"mb-2 mr-2 btn-hover-shine btn btn-" + colordanger}
                                            onClick={() => this.setState({
                                                new_create: false, nombre_rol: '', error_nombrerol: '', descripcion_rol: '',
                                            })}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div> : 
                                <div className='forms-groups'>
                                    <div className='loaders-wrappers d-flexs justifys-contents-centers aligns-items-centers'>
                                        <div className='loaders'>
                                            <div className='balls-scales-multiples'>
                                                <div></div>
                                                <div></div>
                                                <div></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    }
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
                {this.onModalRol()}
                <div className="cards">
                    {(!this.state.loading)?
                        <div className='forms-groups'>
                            <Card
                                style={{ width: '100%', minWidth: '100%', }}
                                title="NUEVO PERSONAL"
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
                                    <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12'>
                                        <div className='inputs-groups'>
                                            <input type='text' readOnly
                                                className={`forms-control title_form ${this.props.buttoncolor}`} value={'Nombre'}
                                            />
                                        </div>
                                    </div>
                                    <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12'>
                                        <div className='inputs-groups'>
                                            <input type='text' readOnly
                                                className={`forms-control title_form ${this.props.buttoncolor}`} value={'Apellido'}
                                            />
                                        </div>
                                    </div>
                                    <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12'>
                                        <div className='inputs-groups'>
                                            <input type='text' readOnly
                                                className={`forms-control title_form ${this.props.buttoncolor}`} value={'Cédula Identidad'}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='forms-groups'>
                                    <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12' style={{paddingTop: 0, }}>
                                        <div className='inputs-groups'>
                                            <input type='text' placeholder='INGRESAR NOMBRE...'
                                                style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                className={`forms-control ${this.state.error_nombre}`}
                                                value={this.state.nombre}
                                                onChange={ (event) => this.setState({ nombre: event.target.value, error_nombre: '' }) }
                                            />
                                            {this.state.nombre.toString().length == 0 ? null : 
                                                <i className='fa fa-close delete_icon'
                                                    onClick={() => this.setState({ nombre: '', }) }
                                                ></i> 
                                            }
                                        </div>
                                    </div>
                                    <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12' style={{paddingTop: 0, }}>
                                        <div className='inputs-groups'>
                                            <input type='text' placeholder='INGRESAR APELLIDO...'
                                                style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                className={`forms-control ${this.state.error_apellido}`}
                                                value={this.state.apellido}
                                                onChange={ (event) => this.setState({apellido: event.target.value, error_apellido: '', }) }
                                            />
                                            {this.state.apellido.toString().length == 0 ? null : 
                                                <i className='fa fa-close delete_icon'
                                                    onClick={() => this.setState({ apellido: '', }) }
                                                ></i> 
                                            }
                                        </div>
                                    </div>
                                    <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12' style={{paddingTop: 0, }}>
                                        <div className='inputs-groups'>
                                            <input type='text' placeholder='INGRESAR CI...'
                                                style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                className={`forms-control ${this.state.error_ci}`}
                                                value={this.state.ci}
                                                onChange={ (event) => this.setState({ci: event.target.value, error_ci: '', }) }
                                            />
                                            {this.state.ci.toString().length == 0 ? null : 
                                                <i className='fa fa-close delete_icon'
                                                    onClick={() => this.setState({ ci: '', }) }
                                                ></i> 
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="forms-groups">
                                    <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12'>
                                        <div className='inputs-groups'>
                                            <input type='text' readOnly
                                                className={`forms-control title_form ${this.props.buttoncolor}`} value={'Ciudad'}
                                            />
                                        </div>
                                    </div>
                                    <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12'>
                                        <div className='inputs-groups'>
                                            <input type='text' readOnly
                                                className={`forms-control title_form ${this.props.buttoncolor}`} value={'Dirección'}
                                            />
                                        </div>
                                    </div>
                                    <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12'>
                                        <div className='inputs-groups'>
                                            <input type='text' readOnly
                                                className={`forms-control title_form ${this.props.buttoncolor}`} value={'Fecha Nacimiento'}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='forms-groups'>
                                    <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12' style={{paddingTop: 0, }}>
                                        <div className='inputs-groups'>
                                            <input type='text' placeholder='INGRESAR CIUDAD...'
                                                style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                className={`forms-control`}
                                                value={this.state.ciudad}
                                                onChange={ (event) => this.setState({ ciudad: event.target.value, }) }
                                            />
                                            {this.state.ciudad.toString().length == 0 ? null : 
                                                <i className='fa fa-close delete_icon'
                                                    onClick={() => this.setState({ ciudad: '', }) }
                                                ></i> 
                                            }
                                        </div>
                                    </div>
                                    <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12' style={{paddingTop: 0, }}>
                                        <div className='inputs-groups'>
                                            <input type='text' placeholder='INGRESAR DIRECCIÓN...'
                                                style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                className={`forms-control`}
                                                value={this.state.direccion}
                                                onChange={ (event) => this.setState({ direccion: event.target.value, }) }
                                            />
                                            {this.state.direccion.toString().length == 0 ? null : 
                                                <i className='fa fa-close delete_icon'
                                                    onClick={() => this.setState({ direccion: '', }) }
                                                ></i> 
                                            }
                                        </div>
                                    </div>
                                    <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12' style={{paddingTop: 0, }}>
                                        <div className='inputs-groups'>
                                            <DatePicker className={'hg_40'}
                                                style={{width: '100%', minWidth: '100%', }}
                                                placeholder='SELECCIONAR FECHA NACIMIENTO'
                                                format={'DD/MM/YYYY'}
                                                value={this.state.nacimiento == '' ? undefined: moment(this.state.nacimiento, 'DD/MM/YYYY')}
                                                onChange={(date, dateString) => {
                                                    this.setState({ nacimiento: dateString, });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="forms-groups">
                                    <div className='cols-lg-2 cols-md-2 cols-sm-2'></div>
                                    <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12'>
                                        <div className='inputs-groups'>
                                            <input type='text' readOnly
                                                className={`forms-control title_form ${this.props.buttoncolor}`} value={'Email'}
                                            />
                                        </div>
                                    </div>
                                    <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12'>
                                        <div className='inputs-groups'>
                                            <input type='text' readOnly
                                                className={`forms-control title_form ${this.props.buttoncolor}`} value={'Contacto'}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='forms-groups'>
                                    <div className='cols-lg-2 cols-md-2 cols-sm-2'></div>
                                    <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12' style={{paddingTop: 0, }}>
                                        <div className='inputs-groups'>
                                            <input type='text' placeholder='INGRESAR EMAIL...'
                                                style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                className={`forms-control ${this.state.error_email}`}
                                                value={this.state.email}
                                                onChange={ (event) => this.setState({ email: event.target.value, error_email: '' }) }
                                            />
                                            {this.state.email.toString().length == 0 ? null : 
                                                <i className='fa fa-close delete_icon'
                                                    onClick={() => this.setState({ email: '', }) }
                                                ></i> 
                                            }
                                        </div>
                                    </div>
                                    <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12' style={{paddingTop: 0, }}>
                                        <div className='inputs-groups'>
                                            <input type='text' placeholder='INGRESAR CONTACTO...'
                                                style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                className={`forms-control`}
                                                value={this.state.contacto}
                                                onChange={ (event) => this.setState({ contacto: event.target.value, }) }
                                            />
                                            {this.state.contacto.toString().length == 0 ? null : 
                                                <i className='fa fa-close delete_icon'
                                                    onClick={() => this.setState({ contacto: '', }) }
                                                ></i> 
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="forms-groups">
                                    <div className='cols-lg-2 cols-md-2 cols-sm-2'></div>
                                    <div className='cols-lg-8 cols-md-8 cols-sm-8 cols-xs-12'>
                                        <div className='inputs-groups'>
                                            <input type='text' readOnly
                                                className={`forms-control title_form ${this.props.buttoncolor}`} value={'Imagen'}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="forms-groups">
                                    <div className='cols-lg-2 cols-md-2 cols-sm-2'></div>
                                    <div className='cols-lg-8 cols-md-8 cols-sm-8 cols-xs-12' style={{paddingTop: 0, }}>
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
                                <div className="forms-groups">
                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                                        <div className='inputs-groups'>
                                            <input type='text' readOnly
                                                className={`forms-control title_form ${this.props.buttoncolor}`} value={'DATOS PARA CUENTA USUARIO'}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="forms-groups">
                                    <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12' style={{paddingTop: 0, }}>
                                        <div className='inputs-groups'>
                                            <input type='text' readOnly
                                                className={`forms-control title_form ${this.props.buttoncolor}`} value={'Usuario'}
                                            />
                                        </div>
                                    </div>
                                    <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12' style={{paddingTop: 0, }}>
                                        <div className='inputs-groups'>
                                            <input type='text' readOnly
                                                className={`forms-control title_form ${this.props.buttoncolor}`} value={'Password'}
                                            />
                                        </div>
                                    </div>
                                    <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12' style={{paddingTop: 0, }}>
                                        <div className='inputs-groups'>
                                            <input type='text' readOnly
                                                className={`forms-control title_form ${this.props.buttoncolor}`} value={'Grupo Usuario'}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='forms-groups'>
                                    <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12' style={{paddingTop: 0, }}>
                                        <div className='inputs-groups'>
                                            <input type='text' placeholder='INGRESAR USUARIO...'
                                                style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                className={`forms-control ${this.state.error_usuario}`}
                                                value={this.state.usuario}
                                                onChange={ (event) => this.setState({ usuario: event.target.value, error_usuario: '' }) }
                                            />
                                            {this.state.usuario.toString().length == 0 ? null : 
                                                <i className='fa fa-close delete_icon'
                                                    onClick={() => this.setState({ usuario: '', }) }
                                                ></i> 
                                            }
                                        </div>
                                    </div>
                                    <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12' style={{paddingTop: 0, }}>
                                        <div className='inputs-groups'>
                                            <input type='password' placeholder='INGRESAR PASSWORD...'
                                                style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                className={`forms-control ${this.state.error_password}`}
                                                value={this.state.password}
                                                onChange={ (event) => {
                                                    if (event.target.value[event.target.value.toString().length - 1] == ' ') return;
                                                    this.setState({ password: event.target.value, error_password: '', })
                                                } }
                                            />
                                            {this.state.password.toString().length == 0 ? null : 
                                                <i className='fa fa-close delete_icon'
                                                    onClick={() => this.setState({ password: '', }) }
                                                ></i> 
                                            }
                                        </div>
                                    </div>
                                    <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12' style={{paddingTop: 0, }}>
                                        <div className='inputs-groups'>
                                            <input type='text' placeholder='SELECCIONAR GRUPO USUARIO'
                                                style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, cursor: 'pointer', }}
                                                className={`forms-control ${this.state.error_rol}`}
                                                value={this.state.rol.nombre} readOnly
                                                onClick={ () => this.setState({ visible_rol: true, }) }
                                            />
                                            {this.state.rol.id == '' ? null : 
                                                <i className='fa fa-close delete_icon'
                                                    onClick={() => this.setState({ rol: {id: '', nombre: '', } }) }
                                                ></i> 
                                            }
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
                        </div>:
                    
                        <div className='forms-groups'>
                            <div className='loaders-wrappers d-flexs justifys-contents-centers aligns-items-centers'>
                                <div className='loaders'>
                                    <div className='balls-scales-multiples'>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

CreatePersonal.propTypes = {
    buttoncolor: PropTypes.string,
}

CreatePersonal.defaultProps = {
    buttoncolor: '',
}

export default withRouter(CreatePersonal);
