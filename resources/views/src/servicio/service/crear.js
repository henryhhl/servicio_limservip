
import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

import { notification, Card, Modal, message } from 'antd';
import 'antd/dist/antd.css';
import web from '../../utils/services';

import PropTypes from 'prop-types';

class CreateServicio extends Component {

    constructor(props) {
        super(props);
        this.state = {
            auth: false,
            loading: false,
            
            nombre: '',
            apellido: '',
            precio: '',
            descripcion: '',
            imagen: '',
            foto: '',
            deleteimg: false,
            
            error_nombre: '',
            error_precio: '',
        }
    }
    componentDidMount() {
        this.props.get_link('servicio', true);
        this.get_data();
    }
    get_data() {
        axios.get( web.servidor + '/servicio/create').then(
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
        if ( this.state.nombre.toString().trim().length > 0 && this.state.precio.toString().length > 0 ) {
            if (this.state.precio == 0) {
                this.setState({ error_precio: 'error', });
                notification.error({
                    message: 'ERROR',
                    description: 'EL PRECIO DEBE SER MAYOR A 0.',
                });
                return;
            }
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
            if (this.state.precio.toString().trim().length == 0) {
                notification.error({
                    message: 'ERROR',
                    description: 'PRECIO REQUERIDO.',
                });
                this.setState({ error_precio: 'error', });
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
        formdata.append('descripcion', this.state.descripcion);
        formdata.append('precio', this.state.precio);
        formdata.append('imagen', this.state.imagen);
        formdata.append('foto', this.state.foto);

        axios(
            {
                method: 'post',
                url: web.servidor + '/servicio/store',
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
                        description: 'SERVICIO CREADO EXITOSAMENTE',
                    });
                    this.props.history.goBack();
                    return;
                }
                if (response.data.response == -1) {
                    notification.error({
                        message: 'ERROR',
                        description: 'EL NOMBRE DEL SERVICIO YA EXISTE. FAVOR DE INGRESAR OTRO NOMBRE',
                    });
                    this.setState({ error_nombre: 'error', });
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
    render() {
        var colorsuccess = this.props.buttoncolor == '' ? 'primary' : this.props.buttoncolor;
        var colordanger = this.props.buttoncolor == '' ? 'danger' : 'outline-' + this.props.buttoncolor;
        var colorback = this.props.buttoncolor == '' ? 'focus' : this.props.buttoncolor;
        return (
            <div className="rows">
                <div className="cards">
                    {(!this.state.loading)?
                        <div className='forms-groups'>
                            <Card
                                style={{ width: '100%', minWidth: '100%', }}
                                title="NUEVO SERVICIO"
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
                                                className={`forms-control title_form ${this.props.buttoncolor}`} value={'Categoria'}
                                            />
                                        </div>
                                    </div>
                                    <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12'>
                                        <div className='inputs-groups'>
                                            <input type='text' readOnly
                                                className={`forms-control title_form ${this.props.buttoncolor}`} value={'Precio'}
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
                                                className={`forms-control`}
                                                value={this.state.apellido}
                                                onChange={ (event) => this.setState({apellido: event.target.value,}) }
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
                                            <input type='text' placeholder='INGRESAR PRECIO...'
                                                style={{ textAlign: 'left', paddingLeft: 30, paddingRight: 50, }}
                                                className={`forms-control ${this.state.error_precio}`}
                                                value={this.state.precio}
                                                onChange={ (event) => {
                                                    var precio = event.target.value == '' ? 0 : event.target.value;
                                                    if (!isNaN(precio)) {
                                                        if (precio * 1 >= 0) {
                                                            var lista = precio.toString().split('.');
                                                            if (lista.length > 1) {
                                                                if (lista[1].length < 3) {
                                                                    this.setState({precio: precio, });
                                                                }else {
                                                                    message.warning('SOLO SE PERMITE DOS DECIMALES.');
                                                                }
                                                            }else {
                                                                this.setState({precio: precio, });
                                                            }
                                                        }
                                                    }else {
                                                        message.warning('SOLO SE PERMITE NUMERO.');
                                                    }
                                                } }
                                            />
                                            {this.state.precio.toString().length == 0 ? null : 
                                                <i className='fa fa-close delete_icon' style={{right: 30,}}
                                                    onClick={() => this.setState({ precio: '', }) }
                                                ></i> 
                                            }
                                            <i className='fa fa-plus blue_hover' 
                                                style={{fontSize: 14, position: 'absolute', top: 10, bottom: 10, right: 5, cursor: 'pointer',
                                                    padding: 0, paddingLeft: 4, paddingRight: 3, display: 'flex', justifyContent: 'center', alignItems: 'center'
                                                }}
                                                onClick={ () => {
                                                    var precio = this.state.precio == '' ? 0 : this.state.precio;
                                                    var array = precio.toString().split('.');
                                                    precio = parseInt(array[0]) * 1 + 1;
                                                    precio = array.length > 1 ? precio + '.' + array[1] : precio;
                                                    this.setState({ precio: precio, });
                                                }}
                                            ></i>
                                            <i className='fa fa-minus blue_hover' 
                                                style={{fontSize: 14, position: 'absolute', top: 10, bottom: 10, left: 5, cursor: 'pointer',
                                                    padding: 0, paddingLeft: 4, paddingRight: 3, display: 'flex', justifyContent: 'center', alignItems: 'center'
                                                }}
                                                onClick={ () => {
                                                    var precio = this.state.precio == '' ? 0 : this.state.precio;
                                                    if (parseFloat(precio * 1) >= 1) {
                                                        var array = precio.toString().split('.');
                                                        precio = parseInt(array[0]) * 1 - 1;
                                                        precio = array.length > 1 ? precio + '.' + array[1] : precio;
                                                        this.setState({ precio: precio, });
                                                    }
                                                }}
                                            ></i>
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
                                                className={`forms-control title_form ${this.props.buttoncolor}`} value={'Descripcion'}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="forms-groups">
                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{paddingTop: 0, }}>
                                        <div className='inputs-groups'>
                                            <textarea type='text' placeholder='INGRESAR DESCRIPCION...'
                                                style={{ textAlign: 'left', paddingLeft: 10, paddingTop: 10,
                                                    paddingRight: 35, height: 150, maxHeight: 150, 
                                                }}
                                                className={`forms-control`}
                                                value={this.state.descripcion}
                                                onChange={ (event) => this.setState({descripcion: event.target.value,}) }
                                            />
                                            {this.state.descripcion.toString().length == 0 ? null : 
                                                <i className='fa fa-close delete_icon'
                                                    onClick={() => this.setState({ descripcion: '', }) }
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

CreateServicio.propTypes = {
    buttoncolor: PropTypes.string,
}

CreateServicio.defaultProps = {
    buttoncolor: '',
}

export default withRouter(CreateServicio);
