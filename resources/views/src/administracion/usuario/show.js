
import React, { Component } from 'react';
import axios from 'axios';
import {withRouter, Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';

import { notification, Card, Select, DatePicker, Modal } from 'antd';
import 'antd/dist/antd.css';

import moment from 'moment';
import web from '../../utils/services';

class ShowUsuario extends Component {

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

            array_rol: [],
            
            nombre: '',
            apellido: '',
            genero: 'N',
            nacimiento: '',

            imagen: '',
            foto: '',
            deleteimg: false,

            usuario: '',
            password: '',
            rol: {id: '', nombre: '', },

            errorname: '',
            errorusuario: '',
            errorpassword: '',
        }
    }
    componentDidMount() {
        this.props.get_link('usuario', true);
        this.get_data();
    }
    get_data() {
        axios.get( web.servidor + '/usuario/edit/' + this.props.match.params.id).then(
            (response) => {
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        var objeto = {id: '', nombre: '',};
                        if (response.data.rol != null) {
                            objeto = response.data.rol;
                        }
                        this.props.loadingservice(false, response.data.visitasitio);
                        var data = response.data.data;
                        this.setState({
                            array_rol: response.data.array_rol, rol: objeto,
                            nombre: data.nombre, genero: data.genero,
                            apellido: data.apellido == null ? '' : data.apellido,
                            nacimiento: data.nacimiento == null ? '' : this.dateString(data.nacimiento),
                            usuario: data.usuario,
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
    dateString(date) {
        var array = date.split('-');
        return array[2] + '/' + array[1] + '/' + array[0];
    }
    onChangeNombre(event) {
        this.setState({
            nombre: event.target.value,
            errorname: '',
        });
    }
    onChangeApellido(event) {
        this.setState({
            apellido: event.target.value,
        });
    }
    onChangeGenero(value) {
        this.setState({
            genero: value,
        });
    }
    onChangeNacimiento(event) {
        this.setState({
            nacimiento: event.target.value,
        });
    }
    onChangeUsuario(event) {
        this.setState({
            usuario: event.target.value,
            errorusuario: '',
        });
    }
    onChangePassword(event) {
        this.setState({
            password: event.target.value,
            errorpassword: '',
        });
    }
    onBack() {
        this.props.history.goBack();
    }
    onValidar() {
        if ((this.state.nombre.toString().trim().length > 0) && 
            (this.state.usuario.toString().trim().length > 0) && 
            (this.state.password.toString().trim().length > 0)
        ) {
            this.onSesion(1);
        }else {
            if (this.state.nombre.toString().trim().length == 0) {
                this.setState({ errorname: 'error', });
            }
            if (this.state.usuario.toString().trim().length == 0) {
                this.setState({ errorusuario: 'error', });
            }
            if (this.state.password.toString().trim().length == 0) {
                this.setState({ errorpassword: 'error', });
            }
            notification.error({
                message: 'ERROR',
                description: 'FAVOR DE LLENAR LOS CAMPOS REQUERIDOS.',
            });
        }
    }
    onSesion(bandera) {
        if (bandera == 1) this.setState({ loading: true, });
        axios.get( web.servidor + '/home/sesion')
        .then( response => {
            if (response.data.response == 1) {
                if (response.data.sesion) {
                    this.props.logout();
                    return;
                }
                if (bandera == 1) this.onSubmit();
                if (bandera == 2) this.onSubmitRol();
                return;
            }
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO. INTENTAR NUEVAMENTE.',
            });
            if (bandera == 1) this.setState({ loading: false, });
            if (bandera == 2) this.setState({ loading_create: false, });
        } ).catch( error => {
            if (bandera == 1) this.setState({ loading: false, });
            if (bandera == 2) this.setState({ loading_create: false, });
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
            });
        });
    }
    onSubmit() {
        this.setState({ loading: true, });
        var formdata = new FormData();
        
        var nacimiento = '';
        if (this.state.nacimiento != '') {
            var array = this.state.nacimiento.split('/');
            nacimiento = array[2] + '-' + array[1] + '-' + array[0];
        }
        
        formdata.append('nombre', this.state.nombre);
        formdata.append('apellido', this.state.apellido);
        formdata.append('genero', this.state.genero);
        formdata.append('nacimiento', nacimiento);
        formdata.append('imagen', this.state.imagen);
        formdata.append('foto', this.state.foto);
        formdata.append('usuario', this.state.usuario);
        formdata.append('password', this.state.password);
        formdata.append('idrol', this.state.rol.id);
        formdata.append('id', this.props.match.params.id);

        axios(
            {
                method: 'post',
                url: web.servidor + '/usuario/update',
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
                if (response.status == 200) {
                    if (response.data.response == 1) {
                        notification.success({
                            message: 'SUCCESS',
                            description: 'USUARIO ACTUALIZADO EXITOSAMENTE',
                        });
                        this.props.history.goBack();
                    }
                    if (response.data.response == -1) {
                        this.setState({ errorusuario: 'error', });
                        notification.error({
                            message: 'WARNING',
                            description: 'NO SE PERMITE USUARIO REPETIDO',
                        });
                    }
                }
            }
        ).catch( error => {
            this.setState({ loading: false, });
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
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
        this.onSesion(2);
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
            this.setState({ loading_create: false, });ç
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
            });
            if (error.response.status == 401) {
                this.setState({ auth: true, });
            }
        } );
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
                                title="DETALLE USUARIO"
                                headStyle={{fontSize: 14, }}
                                bodyStyle={{padding: 4, paddingTop: 0, }}
                                extra={ 
                                    <button className={"btn-wide btn-outline-2x mr-md-2 btn-sm btn btn-outline-" + colorback}
                                        onClick={this.onBack.bind(this)}
                                    >
                                        Atras
                                    </button> 
                                }
                            >
                                <div className="forms-groups">
                                    <div className='cols-lg-1 cols-md-1'></div>
                                    <div className='cols-lg-10 cols-md-10 cols-sm-12 cols-xs-12' style={{paddingTop: 0,}}>
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{padding: 0,}}>
                                            <div className='cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12' style={{padding: 0,}}>
                                                <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' readOnly
                                                            className={`forms-control title_form ${this.props.buttoncolor}`} value={'Nombre'}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' placeholder='INGRESAR NOMBRE'
                                                            style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                            className={`forms-control ${this.state.errorname}`}
                                                            value={this.state.nombre}
                                                            onChange={this.onChangeNombre.bind(this)}
                                                        />
                                                        {this.state.nombre.toString().length == 0 ? null : 
                                                            <i className='fa fa-close delete_icon'
                                                                onClick={() => this.setState({ nombre: '', }) }
                                                            ></i> 
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12' style={{padding: 0,}}>
                                                <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' readOnly
                                                            className={`forms-control title_form ${this.props.buttoncolor}`} value={'Apellido'}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' placeholder='INGRESAR APELLIDO'
                                                            style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                            className={`forms-control`}
                                                            value={this.state.apellido}
                                                            onChange={this.onChangeApellido.bind(this)}
                                                        />
                                                        {this.state.apellido.toString().length == 0 ? null : 
                                                            <i className='fa fa-close delete_icon'
                                                                onClick={() => this.setState({ apellido: '', }) }
                                                            ></i> 
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{padding: 0,}}>
                                            <div className='cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12' style={{padding: 0,}}>
                                                <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' readOnly
                                                            className={`forms-control title_form ${this.props.buttoncolor}`} value={'Genero'}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <Select
                                                            style={{ width: '100%', minWidth: '100%', }}
                                                            value={this.state.genero} className={'hg_40'}
                                                            onChange={this.onChangeGenero.bind(this)}
                                                        >
                                                            <Select.Option value='N'>Ninguno</Select.Option>
                                                            <Select.Option value='F'>Femenino</Select.Option>
                                                            <Select.Option value='M'>Masculino</Select.Option>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12' style={{padding: 0,}}>
                                                <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' readOnly
                                                            className={`forms-control title_form ${this.props.buttoncolor}`} value={'Nacimiento'}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <DatePicker className={'hg_40'}
                                                            style={{width: '100%', minWidth: '100%', }}
                                                            format={'DD/MM/YYYY'}
                                                            placeholder='SELECCIONAR FECHA'
                                                            value={this.state.nacimiento == '' ? undefined: moment(this.state.nacimiento, 'DD/MM/YYYY')}
                                                            onChange={(date, dateString) => {
                                                                this.setState({ nacimiento: dateString, });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{padding: 0,}}>
                                            <div className='cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12' style={{padding: 0,}}>
                                                <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' readOnly
                                                            className={`forms-control title_form ${this.props.buttoncolor}`} value={'Rol'}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' placeholder='SELECCIONAR ROL'
                                                            style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, cursor: 'pointer', }}
                                                            className={`forms-control`}
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
                                            <div className='cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12' style={{padding: 0,}}>
                                                <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' readOnly
                                                            className={`forms-control title_form ${this.props.buttoncolor}`} value={'Imagen'}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
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
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{padding: 0,}}>
                                            <div className='cols-lg-4 cols-md-4'></div>
                                            <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text' readOnly
                                                        className={`forms-control title_form ${this.props.buttoncolor}`} value={'AUTENTIFICACION'}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{padding: 0,}}>
                                            <div className='cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12' style={{padding: 0,}}>
                                                <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' readOnly
                                                            className={`forms-control title_form ${this.props.buttoncolor}`} value={'Usuario'}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' placeholder='INGRESAR USUARIO'
                                                            style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, background: '#eee' }}
                                                            className={`forms-control ${this.state.errorusuario}`}
                                                            value={this.state.usuario} readOnly
                                                            onChange={this.onChangeUsuario.bind(this)}
                                                        />
                                                        {/* {this.state.usuario.toString().length == 0 ? null : 
                                                            <i className='fa fa-close delete_icon'
                                                                onClick={() => this.setState({ usuario: '', }) }
                                                            ></i> 
                                                        } */}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12' style={{padding: 0,}}>
                                                <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' readOnly
                                                            className={`forms-control title_form ${this.props.buttoncolor}`} value={'Password'}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='password' placeholder='INGRESAR PASSWORD'
                                                            style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                            className={`forms-control ${this.state.errorpassword}`}
                                                            value={this.state.password}
                                                            onChange={this.onChangePassword.bind(this)}
                                                        />
                                                        {this.state.password.toString().length == 0 ? null : 
                                                            <i className='fa fa-close delete_icon'
                                                                onClick={() => this.setState({ password: '', }) }
                                                            ></i> 
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>

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

                    {/* <div className='loaders-wrappers d-flexs justifys-contents-centers aligns-items-centers'>
                        <div className='loaders'>
                            <div className='balls-scales-ripples-multiples'>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        );
    }
}

ShowUsuario.propTypes = {
    buttoncolor: PropTypes.string,
}

ShowUsuario.defaultProps = {
    buttoncolor: '',
}

export default withRouter(ShowUsuario);
