
import React, { Component } from 'react';
import axios from 'axios';
import {withRouter, Redirect} from 'react-router-dom';

import { notification, Card, Transfer, Switch, Modal } from 'antd';
import 'antd/dist/antd.css';
import web from '../../utils/services';
import PropTypes from 'prop-types';

const ReachableContext = React.createContext();
const UnreachableContext = React.createContext();

const config = {
    title: 'Use Hook!',
    content: (
      <>
        <ReachableContext.Consumer>{name => `Reachable: ${name}!`}</ReachableContext.Consumer>
        <br />
        <UnreachableContext.Consumer>{name => `Unreachable: ${name}!`}</UnreachableContext.Consumer>
      </>
    ),
  };

class CreateRol extends Component {

    constructor(props) {
        super(props);
        this.state = {
            auth: false,
            loading: false,

            permiso: [],
            data: [],
            array_usuario: [],
            target_usuario: [],
            
            nombre: '',
            descripcion: '',
            errorname: '',
        }
    }
    componentDidMount() {
        this.props.get_link('rol', true);
        this.get_data();
    }
    get_data() {
        axios.get( web.servidor + '/rol/create').then(
            (response) => {
                console.log(response)
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) { 
                        for (let index = 0; index < response.data.array_usuario.length; index++) {
                            var data = response.data.array_usuario[index];
                            var usuario = data.apellido == null ? data.nombre : data.nombre + ' ' + data.apellido
                            this.state.array_usuario.push({
                                key: data.id.toString(),
                                title: data.usuario,
                                usuario: usuario.toUpperCase(),
                            });
                        }
                        this.props.loadingservice(false, response.data.visitasitio);
                        this.setState({
                            // permiso: response.data.data,
                            array_usuario: this.state.array_usuario,
                        });
                        return;
                    }
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
    onChangeNombre(event) {
        this.setState({
            nombre: event.target.value.toUpperCase(),
            errorname: '',
        });
    }
    onChangeDescripcion(event) {
        this.setState({
            descripcion: event.target.value,
        });
    }
    onBack() {
        this.props.history.goBack();
    }
    onValidar() {
        console.log(this.state.target_usuario)
        if (this.state.nombre.toString().trim().length > 0) {
            this.onSesion();
        }else {
            this.setState({ errorname: 'error', });
            notification.error({
                message: 'ERROR',
                description: 'FAVOR DE LLENAR LOS CAMPOS REQUERIDOS.',
            });
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

        formdata.append('array_usuario', JSON.stringify(this.state.target_usuario));

        axios( {
            method: 'post',
            url: web.servidor + '/rol/store',
            data: formdata,
            headers: {
                'Content-Type': 'multipart/form-data',
                'enctype' : 'multipart/form-data',
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            },
        } ).then(
            response => {
                this.setState({ loading: false, });
                if (response.status == 200) {
                    if (response.data.response == 1) {
                        notification.success({
                            message: 'SUCCESS',
                            description: 'ROL CREADO EXITOSAMENTE',
                        });
                        this.props.history.push('/taller_mecanico/rol');
                    }
                    if (response.data.response == -1) {
                        this.setState({ errorname: 'error', });
                        notification.warning({
                            message: 'ADVERTENCIA',
                            description: 'NO SE PERMITE ROL REPETIDO.',
                        });
                    }
                }
                if (response.status == 401) {
                    this.setState({ auth: true, });
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
    onChecked(data, index) {
        if (typeof this.state.data[index] == 'undefined') {
            var objeto = {
                id: data.id,
                checked: false,
                estado: '0',
            };
            this.state.data[index] = objeto;
        }
        return this.state.data[index].checked;
    }
    onChangePermiso(pos) {
        this.state.data[pos].checked = !this.state.data[pos].checked;
        this.state.data[pos].estado = this.state.data[pos].checked?'1':'0';
        this.setState({
            data: this.state.data,
        });
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
                                title="NUEVO ROL"
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
                                    <div className='cols-lg-2 cols-md-2'></div>
                                    <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12' style={{paddingTop: 0,}}>
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{ padding: 0, }}>
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
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{ padding: 0, }}>
                                            <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text' readOnly
                                                        className={`forms-control title_form ${this.props.buttoncolor}`} value={'Descripcion'}
                                                    />
                                                </div>
                                            </div>
                                            <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text' placeholder='INGRESAR DESCRIPCION'
                                                        style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                        className={`forms-control`}
                                                        value={this.state.descripcion}
                                                        onChange={this.onChangeDescripcion.bind(this)}
                                                    />
                                                    {this.state.descripcion.toString().length == 0 ? null : 
                                                        <i className='fa fa-close delete_icon'
                                                            onClick={() => this.setState({ descripcion: '', }) }
                                                        ></i> 
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-header-tab card-header" style={{border: '1px solid transparent'}}>
                                    <div className="card-header-title font-size-sm text-capitalize font-weight-normal">
                                        <i className="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
                                            ASIGNAR USUARIO
                                    </div>
                                </div>
                                <div className='forms-groups'>
                                    <Transfer 
                                        dataSource={this.state.array_usuario}
                                        style={{width: '90%', margin: 'auto', paddingTop: 10, paddingBottom: 10, }}
                                        listStyle={ {width: '45%', height: 300, } }
                                        render={ (item) => (<span style={{position: 'relative'}}> {item.title} &nbsp;
                                                <a onClick={(event) => event.preventDefault()} href='#'> - </a> &nbsp;
                                                    {item.usuario}
                                            </span>) 
                                        }
                                        oneWay={true} showSearch={true}
                                        filterOption={ (inputValue, item) => 
                                            item.title.toUpperCase().indexOf(inputValue.toUpperCase()) != -1 || 
                                            item.usuario.toUpperCase().indexOf(inputValue.toUpperCase()) != -1
                                        } 
                                        locale={ {searchPlaceholder: 'SEARCH USUARIO', /*itemUnit: 'data', itemsUnit: 'data',*/ } }
                                        targetKeys={ this.state.target_usuario }
                                        onChange={ (targetKeys, direction, moveKeys) => this.setState({ target_usuario: targetKeys, }) }
                                    />
                                </div>
                                <div style={{width: '90%', margin: 'auto', paddingTop: 10, paddingBottom: 10, }}>
                                    <Switch style={{ height: 30, lineHeight: 'normal', paddingRight: 5, }}
                                        checkedChildren={'HABILITADO'} checked disabled
                                    />
                                </div>
                                {/* <div className="forms-groups">
                                    {this.state.permiso.map(
                                        (data, key) => (
                                            <div className='cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12' 
                                                key={key} style={{padding: 2, position: 'relative'}}>
                                                <label className="customcheckbox">
                                                    <input type="checkbox"
                                                        checked={this.onChecked(data, key)}
                                                        onChange={this.onChangePermiso.bind(this, key)}
                                                    />
                                                    <span className={`checkmark`}> </span>
                                                </label>
                                                <label style={{
                                                        fontFamily: 'Roboto', position: 'absolute', left: 45, cursor: 'pointer',
                                                    }}
                                                    onClick={this.onChangePermiso.bind(this, key)}
                                                >
                                                    {data.nombre}
                                                </label>  
                                            </div>
                                        )
                                    )}
                                </div> */}
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

CreateRol.propTypes = {
    buttoncolor: PropTypes.string,
}

CreateRol.defaultProps = {
    buttoncolor: '',
}

export default withRouter(CreateRol);
