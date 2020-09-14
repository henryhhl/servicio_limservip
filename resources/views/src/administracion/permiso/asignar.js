
import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

import { notification, Card, Transfer, Switch, Button, Modal } from 'antd';
import 'antd/dist/antd.css';
import web from '../../utils/services';
import PropTypes from 'prop-types';

class Asignar_Permiso extends Component {
    constructor(props) {
        super (props);
        this.state = {
            loading: false,

            visible_rol: false,
            new_create: false,
            loading_create: false,

            nombre_rol: '',
            descripcion_rol: '',
            error_nombrerol: '',

            rol_usuario: {id: '', nombre: '', },
            erroridrol: '',

            array_rol: [],
            array_data: [],
            selected_data: [],
            target_data: [],
            disabled: false,
        };
    }
    componentDidMount() {
        this.props.get_link('asignar_permiso', true);
        this.get_data();
    }
    get_data() {
        axios.get( web.servidor +  '/permiso/create').then(
            (response) => {
                // console.log(response);
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        for (let index = 0; index < response.data.permiso.length; index++) {
                            var data = response.data.permiso[index];
                            this.state.array_data.push({
                                key: data.id.toString(),
                                title: data.nombre.toUpperCase(),
                            });
                        }
                        this.props.loadingservice(false, '');
                        this.setState({ 
                            array_data: this.state.array_data,
                            array_rol: response.data.rol, 
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
    onChangeData(nextTarget, direction, moveKeys) {
        // console.log('next: ', nextTarget)
        // console.log('direccion: ', direction)
        // console.log('move: ', moveKeys)
        this.setState({ target_data: nextTarget, });
    };
    onChangeSelectedData(sourceSelectedKeys, targetSelectedKeys) {
        // console.log('source: ', sourceSelectedKeys)
        // console.log('target: ', targetSelectedKeys);
        this.setState({ selected_data: [...sourceSelectedKeys, ...targetSelectedKeys] });
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
    onSelectRol(data) {
        axios( {
            method: 'get',
            url: web.servidor + '/permiso/select_rol',
            params: {idrol: data.id,},
            responseType: 'json',
        } ).then(
            response => {
                if (response.status == 200) {

                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }

                    if (response.data.response == 1) {
                        // console.log(response.data)

                        this.state.array_data = [];
                        this.state.target_data = [];

                        for (let index = 0; index < response.data.array_permiso.length; index++) {
                            var element = response.data.array_permiso[index];
                            this.state.array_data.push({
                                key: element.id.toString(),
                                title: element.nombre.toUpperCase(),
                            });
                        }

                        for (let index = 0; index < response.data.permiso_activo.length; index++) {
                            var element = response.data.permiso_activo[index];
                            this.state.target_data.push(element.id.toString());
                        }

                        this.setState({
                            rol_usuario: data, visible_rol: false,
                            array_data: this.state.array_data,
                            target_data: this.state.target_data,
                            disabled: true, selected_data: [],
                        });
                    }
                }
            }
        ).catch( error => {
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
            });
            if (error.response.status == 401) {
                this.setState({  auth: true, });
            }
        } );
    }
    onModalRol() {
        var rol = this.state.rol_usuario;
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
                                            onClick={ this.onSelectRol.bind(this, data) }
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
    onSubmitRol() {
        this.setState({ loading_create: true, });
        var formdata = new FormData();
        formdata.append('nombre', this.state.nombre_rol);
        formdata.append('descripcion', this.state.descripcion_rol);
        axios( {
            method: 'post',
            url: web.servidor +  '/rol/store',
            data: formdata,
            headers: {
                'Content-Type': 'multipart/form-data',
                'enctype' : 'multipart/form-data',
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            }
        } ).then(
            response => {
                if (response.status == 200) {
                    if (response.data.response == 1) {
                        notification.success({
                            message: 'SUCCESS',
                            description: 'ROL REGISTRADO EXITOSAMENTE.',
                        });
                        this.state.array_data = [];
                        this.state.target_data = [];

                        for (let index = 0; index < response.data.array_permiso.length; index++) {
                            var element = response.data.array_permiso[index];
                            this.state.array_data.push({
                                key: element.id.toString(),
                                title: element.nombre.toUpperCase(),
                            });
                        }
                        this.setState({
                            visible_rol: false, new_create: false,
                            loading_create: false, nombre_rol: '',
                            descripcion_rol: '', rol_usuario: response.data.data, 
                            array_rol: response.data.rol, selected_data: [],
                            array_data: this.state.array_data,
                            target_data: this.state.target_data, disabled: true,
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
    onCloseRol() {
        this.setState({ 
            rol_usuario: {id: '', nombre: ''}, target_data: [], 
            disabled: false, selected_data: [],
        });
    }
    onAsignarPermiso() {

        this.setState({ loading: true, });
        var formdata = new FormData();
        formdata.append('array_permiso', JSON.stringify(this.state.target_data));
        formdata.append('idrol', this.state.rol_usuario.id);

        axios(
            {
                method: 'post',
                url: web.servidor + '/permiso/asignar',
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
                            description: 'PERMISO ASIGNADO EXITOSAMENTE',
                        });
                        this.setState({ 
                            rol_usuario: {id: '', nombre: ''}, target_data: [], 
                            disabled: false, selected_data: [],
                        });
                    }
                }
            }
        ).catch( error => {
            console.log(error)
            this.setState({ loading: false, });
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
            });
        } );
    }
    onSesion(bandera = 1) {
        if (bandera == 1) this.setState({ loading: true, });
        axios.get( web.servidor + '/home/sesion')
        .then( response => {
            if (response.data.response == 1) {
                if (response.data.sesion) {
                    this.props.logout();
                    return;
                }
                if (bandera == 1) this.onAsignarPermiso();
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
    render() {
        var colorsuccess = this.props.buttoncolor == '' ? 'primary' : this.props.buttoncolor;
        var colordanger = this.props.buttoncolor == '' ? 'danger' : 'outline-' + this.props.buttoncolor;
        return (
            <div className='rows'>
                {this.onModalRol()}
                <div className="cards">
                    {(!this.state.loading)?
                        <div className='forms-groups'>
                            <Card
                                style={{ width: '100%', minWidth: '100%', }}
                                title="ASIGNAR PERMISO"
                                headStyle={{fontSize: 14, }}
                                bodyStyle={{padding: 4, paddingTop: 0, }}
                            >
                                <div className='forms-groups'>
                                    <div className='cols-lg-2 cols-md-2'></div>
                                    <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12' style={{paddingTop: 0,}}>
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{ padding: 0, }}>
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
                                                        className={`forms-control ${this.state.erroridrol}`}
                                                        value={this.state.rol_usuario.nombre} readOnly
                                                        onClick={ () => this.setState({ visible_rol: true, }) }
                                                    />
                                                    {this.state.rol_usuario.id.toString().length == 0 ? null : 
                                                        <i className='fa fa-close delete_icon'
                                                            onClick={ this.onCloseRol.bind(this) }
                                                        ></i> 
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Transfer 
                                    dataSource={this.state.array_data}
                                    render={ (item) => item.title }
                                    listStyle={ {width: '45%', height: 400, } }
                                    style={{width: '90%', margin: 'auto', paddingTop: 10, paddingBottom: 10, }}
                                    selectedKeys={this.state.selected_data}
                                    targetKeys={this.state.target_data}
                                    onChange={this.onChangeData.bind(this)}
                                    onSelectChange={this.onChangeSelectedData.bind(this)}
                                    oneWay={true} showSearch disabled={!this.state.disabled} 
                                    locale={ {searchPlaceholder: 'SEARCH PERMISO', /*itemUnit: 'data', itemsUnit: 'data',*/ } }
                                    // onScroll={ (direction, e) => {
                                    //     console.log(direction)
                                    //     console.log(e.target)
                                    // } }
                                    filterOption={ (inputValue, item) => item.title.toUpperCase().indexOf(inputValue.toUpperCase()) != -1  }
                                />
                                <div style={{width: '90%', margin: 'auto', paddingTop: 10, paddingBottom: 10, }}>
                                    <Switch style={{ height: 30, lineHeight: 'normal', paddingRight: 5, }}
                                        unCheckedChildren={'DESHABILITADO'}
                                        checkedChildren={'HABILITADO'}
                                        checked={this.state.disabled} disabled
                                        // onChange={ (checked) => this.setState({ disabled: checked, }) }
                                    />
                                </div>
                                <div style={{width: '90%', margin: 'auto', paddingBottom: 10, textAlign: 'center', }}>
                                    {(!this.state.disabled) ?
                                        <Button onClick={this.onSesion.bind(this, 1)} disabled={!this.state.disabled}>
                                            ASIGNAR
                                        </Button> : 
                                        <button className={"mb-2 mr-2 btn-hover-shine btn btn-" + colorsuccess}
                                            onClick={this.onSesion.bind(this, 1)}
                                        >
                                            ASIGNAR
                                        </button>
                                    }
                                    &nbsp;
                                    {(!this.state.disabled) ?
                                        <Button type='danger' disabled={!this.state.disabled} onClick={ this.onCloseRol.bind(this) }>
                                            CANCELAR
                                        </Button> :
                                        <button className={"mb-2 mr-2 btn-hover-shine btn btn-" + colordanger}
                                            onClick={ this.onCloseRol.bind(this) }
                                        >
                                            CANCELAR
                                        </button> 
                                    }
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
                </div>
            </div>
        );
    }
}

Asignar_Permiso.propTypes = {
    buttoncolor: PropTypes.string,
}

Asignar_Permiso.defaultProps = {
    buttoncolor: '',
}

export default withRouter(Asignar_Permiso);
