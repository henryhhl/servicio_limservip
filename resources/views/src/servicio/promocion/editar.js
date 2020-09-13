
import React, { Component } from 'react';
import axios from 'axios';
import {withRouter, Redirect} from 'react-router-dom';

import { notification, Card, Modal, DatePicker, message, Tag, Button, Pagination, Popover } from 'antd';
import 'antd/dist/antd.css';
import web from '../../utils/services';

import moment from 'moment';
import PropTypes from 'prop-types';

class EditarPromocion extends Component {

    constructor(props) {
        super(props);
        this.state = {
            auth: false,
            loading: false,
            
            descripcion: '',
            fechainicio: '',
            fechafinal: '',
            descuento: 0,

            search_servicio: '',
            active_searchservicio: 'active',

            array_servicio: [],
            selected_producto: [
                {
                    id: null, codigo: null, descripcion: null, precio: null,
                    stockactual: null, tipo: null, imagen: null, costo : null,
                    descuento: null, preciodescuento: null, visible_desc: false, error: null,
                    iddetalle: null,
                },
            ],
            pagination_servicio: {
                'total': 0,
                'current_page': 0,
                'per_page': 0,
                'last_page': 0,
                'from': 0,
                'to': 0,
            },
            pagina_servicio: 1,
            visible_servicio: false,
            
            errordescripcion: '',
            error_servicio: '',
        }
    }
    dateString(date) {
        var array = date.split('-');
        return array[2] + '/' + array[1] + '/' + array[0];
    }
    componentDidMount() {
        this.props.get_link('promocion', true);
        this.get_data();
    }
    get_data() {
        axios.get( web.servidor + '/promocion/edit/' + this.props.match.params.id ).then(
            (response) => {
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        this.props.loadingservice(false, response.data.visitasitio);
                        for (let index = 0; index < response.data.detalle.length; index++) {
                            var data = response.data.detalle[index];
                            var object_servicio = {
                                id: data.idservicio, codigo: data.codigo, descripcion: data.descripcion, precio: data.precio,
                                stockactual: data.stockactual, tipo: data.tipo, imagen: data.imagen, costo : data.costo,
                                descuento: data.descuento, visible_desc: false, error: null,
                                preciodescuento: data.preciodescuento, iddetalle: data.id,
                            };
                            if (index == 0) {
                                this.state.selected_producto[0] = object_servicio;
                            }else {
                                this.state.selected_producto.push(object_servicio);
                            }
                        }
                        this.setState({
                            descripcion: response.data.promocion.descripcion,
                            fechainicio: this.dateString(response.data.promocion.fechainicio),
                            fechafinal: this.dateString(response.data.promocion.fechafinal),
                            descuento: response.data.promocion.descuento,
                            selected_producto: this.state.selected_producto,
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
    onChangeDescripcion(event) {
        this.setState({
            descripcion: event.target.value,
            errordescripcion: '',
        });
    }
    get_servicio(page = 1, search = '') {
        axios.get( web.servidor + '/servicio/search_decripcion?page=' + page + '&search=' + search + '&nropaginate=' + 20).then(
            (response) => {
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        this.setState({
                            array_servicio: response.data.data.data,
                            pagination_servicio: response.data.pagination,
                            pagina_servicio: response.data.data.data.length > 0 ? page : 0,
                            visible_servicio: true, search_servicio: '',
                        });
                    }
                }
            }
        ).catch( error => { 
            console.log(error); console.log(error.response); 
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
            });
        });
    }
    onBack() {
        this.props.history.goBack();
    }
    onValidar() {
        var cantidad = 0;
        for (let index = 0; index < this.state.selected_producto.length; index++) {
            var data = this.state.selected_producto[index];
            if (data.id == null) {
                cantidad++;
            }
        }
        if (cantidad == this.state.selected_producto.length) {
            this.setState({
                error_servicio: 'error',
            });
            notification.error({
                message: 'ERROR',
                description: 'FAVOR DE SELECCIONAR AL MENOS UN PRODUCTO O SERVICIO',
            });
            return;
        }
        if (this.state.descripcion.toString().trim().length > 0 && this.state.fechainicio != '' && 
                this.state.fechafinal != '' && this.state.descuento > 0
            ) {
            this.onSesion();
        }else {
            if (this.state.descripcion.toString().trim().length == 0) {
                this.setState({
                    errordescripcion: 'error',
                });
                notification.error({
                    message: 'ERROR',
                    description: 'CAMPO DESCRIPCION REQUERIDO.',
                });
                return;
            }
            if (this.state.fechainicio == '') {
                notification.error({
                    message: 'ERROR',
                    description: 'FECHA INICIO REQUERIDO.',
                });
                return;
            }
            if (this.state.fechafinal == '') {
                notification.error({
                    message: 'ERROR',
                    description: 'FECHA FINAL REQUERIDO.',
                });
                return;
            }
            if (this.state.descuento == 0) {
                notification.error({
                    message: 'ERROR',
                    description: 'EL DESCUENTO DEBE SER MAYOR A 0.',
                });
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
        formdata.append('descripcion', this.state.descripcion);
        formdata.append('fechainicio', fechainicio);
        formdata.append('fechafin', fechafinal);
        formdata.append('descuento', this.state.descuento);
        formdata.append('array_producto', JSON.stringify(this.state.selected_producto));
        formdata.append('id', this.props.match.params.id);

        axios(
            {
                method: 'post',
                url: web.servidor + '/promocion/update',
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
                        description: 'PROMOCION ACTUALIZADO EXITOSAMENTE',
                    });
                    this.props.history.goBack();
                }
                if (response.data.response == -1) {
                    notification.error({
                        message: 'WARNING',
                        description: 'NO SE PERMITE DESCRIPCION DE PROMOCION REPETIDO',
                    });
                    this.setState({ errordescripcion: 'error', });
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
    existe_servicio(id) {
        for (let index = 0; index < this.state.selected_producto.length; index++) {
            const data = this.state.selected_producto[index];
            if (data.id == id) {
                return true;
            }
        }
        return false;
    }
    onChangeIDServicio(data) {

        if (this.existe_servicio(data.id)) {
            notification.warning({
                message: 'WARNING',
                description: 'EL PRODUCTO O SERVICIO YA HA SIDO SELECCIONADO.',
            });
            return;
        }

        var bandera = true;

        var object_servicio = {
            id: data.id, codigo: data.codigo, descripcion: data.descripcion, precio: data.precio,
            stockactual: data.stockactual, tipo: data.tipo, imagen: data.imagen, costo : data.costo,
            descuento: this.state.descuento, visible_desc: false, error: null,
            preciodescuento: parseFloat((data.precio * 1) - (data.precio * (this.state.descuento * 1 / 100) )).toFixed(2),
            iddetalle: null,
        };

        for (let index = 0; index < this.state.selected_producto.length; index++) {
            var element = this.state.selected_producto[index];
            if (element.id == null) {
                this.state.selected_producto[index] = object_servicio;
                bandera = false;
                break;
            }
        }
        if (bandera) this.state.selected_producto.push(object_servicio);

        object_servicio = {
            id: null, codigo: null, descripcion: null, precio: null,
            stockactual: null, tipo: null, imagen: null, costo : null,
            descuento: null, preciodescuento: null, visible_desc: false, error: null,
            iddetalle: null,
        };

        this.state.selected_producto.push(object_servicio);

        this.setState({
            selected_producto: this.state.selected_producto,
            visible_servicio: false, error_servicio: '',
        }, );
    }
    onSelectedServicio(data) {
        for (let index = 0; index < this.state.selected_producto.length; index++) {
            var element = this.state.selected_producto[index];
            if (element.id == data.id) {
                return true;
            }
        }
        return false;
    }
    onModalServicio() {
        return (
            <Modal
                title={null} footer={null}
                visible={this.state.visible_servicio}
                onCancel={() => this.setState({ visible_servicio: false, search_servicio: '', })}
                bodyStyle={{padding: 0, paddingTop: 5, paddingBottom: 5,}}
                style={{ top: 50, }} width={800}
            >
                <div className="forms-groups" style={{position: 'relative',}}>
                    <div className='forms-groups' style={{display: 'flex', justifyContent: 'center', paddingBottom: 20,}}>
                        <div className={`search-wrapper ${this.state.active_searchservicio}`}>
                            <div className="input-holder">
                                <input type="text" className="search-input" placeholder="Ingresar Dato..." 
                                    value={this.state.search_servicio} onChange={(event) => this.setState({search_servicio: event.target.value,}) }
                                />
                                <button className="search-icon" onClick={ () => this.setState({active_searchservicio: 'active'}) }><span></span></button>
                            </div>
                            <button className="close" onClick={ () => this.setState({ active_searchservicio: '', search_servicio: '', }) }></button>
                        </div>
                    </div>
                    <Card title="LISTADO DE SERVICIO/PRODUCTO" 
                        bodyStyle={{ padding: 0, paddingRight: 20, paddingLeft: 5, }}
                        headStyle={{color: 'white', background: '#1890ff', fontSize: 14, fontWeight: 'bold',}}
                    >
                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{padding: 0,}}>
                            <Card.Grid hoverable={false} className='gridStyle grid_15' 
                                style={{background: '#1890ff', color: 'white', fontSize: 13, fontWeight: 'bold', paddingLeft: 40, }}
                            >
                                NRO
                            </Card.Grid>
                            <Card.Grid hoverable={false} className='gridStyle grid_60' 
                                style={{background: '#1890ff', color: 'white', fontSize: 13, fontWeight: 'bold', paddingLeft: 40, }}
                            >
                                DESCRIPCION
                            </Card.Grid>
                            <Card.Grid hoverable={false} className='gridStyle grid_25' 
                                style={{background: '#1890ff', color: 'white', fontSize: 13, fontWeight: 'bold', paddingLeft: 40, }}
                            >
                                DETALLES
                            </Card.Grid>
                        </div>
                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                            style={{ padding: 0, height: 'auto', /*width: 'calc(100% + 20px)',*/ maxHeight: 350, overflowY: 'auto', overflowX: 'none', }}
                        >
                            {this.state.array_servicio.map(
                                (data, key) => (
                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                        style={{ padding: 0, }} key={key}
                                        onClick={this.onChangeIDServicio.bind(this, data)}
                                    >
                                        <Card.Grid hoverable={true} className='gridStyle grid_15 line_hg_20 ptb-20' 
                                            style={{cursor: 'pointer', position: 'relative', 
                                                background: (this.onSelectedServicio(data)) ? '#e0f3ff' : 'white',
                                            }}
                                        >
                                             { ( (this.state.pagina_servicio - 1) * 20) + (key + 1) }
                                         </Card.Grid>
                                         <Card.Grid hoverable={true} className='gridStyle grid_60 line_hg_20 ptb-20' 
                                             style={{cursor: 'pointer', position: 'relative', 
                                                background: (this.onSelectedServicio(data)) ? '#e0f3ff' : 'white',
                                             }}
                                        >
                                            <div style={{display: 'block', fontSize: 12, }}>
                                                <div style= {{ display: 'flex', fontWeight: '500', }}>
                                                    <strong style={{ width: 90, }}>Codigo: </strong> { data.codigo == null ? 'S/Codigo' : data.codigo }
                                                </div>
                                                <div style= {{ display: 'flex', fontWeight: '500', }}>
                                                    <strong style={{ width: 90, }}>Descripcion: </strong> { data.descripcion }
                                                </div>
                                            </div>
                                            {data.tipo == 'P' ?
                                                <Tag color="green" style={{position: 'absolute', top: 7, right: 8, }}>PRODUCTO</Tag> :
                                                <Tag color="blue" style={{position: 'absolute', top: 7, right: 8, }}>SERVICIO</Tag> 
                                            }
                                        </Card.Grid>
                                        <Card.Grid hoverable={true} className='gridStyle grid_25 line_hg_20 ptb-20' 
                                            style={{cursor: 'pointer', position: 'relative', 
                                                background: (this.onSelectedServicio(data)) ? '#e0f3ff' : 'white',
                                            }}
                                        >
                                            <div style={{display: 'block', fontSize: 12, }}>
                                                <div style= {{color: '#6f42c1', fontWeight: '500', display: 'flex', }}>
                                                    <strong style={{color: '#20c997', width: 55, }}>Precio: </strong> { data.precio }
                                                </div>
                                                {data.tipo == 'S' ? null :
                                                    <div style= {{color: '#6f42c1', fontWeight: '500', display: 'flex', }}>
                                                        <strong style={{color: '#20c997', width: 55, }}>Stock: </strong> { data.stockactual }
                                                    </div>
                                                }
                                            </div>
                                        </Card.Grid>
                                    </div>
                                )
                            )}
                        </div>
                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' 
                            style={{paddingTop: 8, paddingBottom: 15, border: '1px solid #e8e8e8', display: 'flex', 
                                alignItems: 'center', justifyContent: 'center',
                            }}
                        >
                            <Pagination className='paginate_number' pageSize={20} current={this.state.pagina_servicio}
                                onChange={ (page) => this.get_servicio(page) } simple 
                                total={this.state.pagination_servicio.total} 
                                itemRender={(current, type, originalElement) => {
                                    if (type == 'prev') return <Button>Previous</Button>;
                                    if (type == 'next') return <Button>Next</Button>;
                                    return originalElement;
                                }} 
                            />
                        </div>
                    </Card>
                </div>
            </Modal>
        );
    }
    onVisibleDescuento(data) {
        data.visible_desc = !data.visible_desc;
        this.setState({ selected_producto: this.state.selected_producto, });
    }
    onChangeDescuento(data, event) {
        if (event.target.value == '') {
            data.descuento = 0;
            data.preciodescuento = data.precio;
        }
        if (!isNaN(event.target.value)) {
            if (parseInt(event.target.value) >= 0 && parseInt(event.target.value) <= 100) {
                data.preciodescuento = parseFloat((data.precio * 1) - (data.precio * (event.target.value * 1 / 100) )).toFixed(2);
                data.descuento = parseInt(event.target.value);
            }
        }
        this.setState({ selected_producto: this.state.selected_producto, }, );
    }
    onDescuentoIncrementar(data) {
        if (parseInt(data.descuento) >= 0 && parseInt(data.descuento) <= 100) {
            data.descuento = parseInt(data.descuento)  + 1;
            data.preciodescuento = parseFloat((data.precio * 1) - (data.precio * (data.descuento * 1 / 100) )).toFixed(2);
            this.setState({ selected_producto: this.state.selected_producto, }, );
        }
    }
    onDescuentoDecrementar(data) {
        if (parseInt(data.descuento) > 0) {
            data.descuento = parseInt(data.descuento)  - 1;
            data.preciodescuento = parseFloat((data.precio * 1) - (data.precio * (data.descuento * 1 / 100) )).toFixed(2);
            this.setState({ selected_producto: this.state.selected_producto, }, );
        }
    }
    ongenerarDescuento() {
        for (let index = 0; index < this.state.selected_producto.length; index++) {
            var element = this.state.selected_producto[index];
            if (element.id != null) {
                this.state.selected_producto[index].descuento = this.state.descuento;
                this.state.selected_producto[index].preciodescuento = parseFloat((element.precio * 1) - (element.precio * (this.state.descuento * 1 / 100) )).toFixed(2);
            }
        }
        this.setState({
            selected_producto: this.state.selected_producto,
        });
    }
    render() {
        var colorsuccess = this.props.buttoncolor == '' ? 'primary' : this.props.buttoncolor;
        var colordanger = this.props.buttoncolor == '' ? 'danger' : 'outline-' + this.props.buttoncolor;
        var colorback = this.props.buttoncolor == '' ? 'focus' : this.props.buttoncolor;
        return (
            <div className="rows">
                {this.onModalServicio()}
                <div className="cards">
                    {(!this.state.loading)?
                        <div className='forms-groups'>
                            <Card
                                style={{ width: '100%', minWidth: '100%', }}
                                title="EDITAR PROMOCION"
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
                                    <div className='cols-lg-3 cols-md-3'></div>
                                    <div className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12' style={{padding: 0, }}>
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
                                                    className={`forms-control ${this.state.errordescripcion}`}
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
                                <div className="forms-groups">
                                    <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12'>
                                        <div className='inputs-groups'>
                                            <input type='text' readOnly
                                                className={`forms-control title_form ${this.props.buttoncolor}`} value={'Fecha Inicio'}
                                            />
                                        </div>
                                    </div>
                                    <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12'>
                                        <div className='inputs-groups'>
                                            <input type='text' readOnly
                                                className={`forms-control title_form ${this.props.buttoncolor}`} value={'Fecha Final'}
                                            />
                                        </div>
                                    </div>
                                    <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12'>
                                        <div className='inputs-groups'>
                                            <input type='text' readOnly
                                                className={`forms-control title_form ${this.props.buttoncolor}`} value={'Descuento'}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='forms-groups'>
                                    <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12' style={{paddingTop: 0, }}>
                                        <div className='inputs-groups'>
                                            <DatePicker className={'hg_40'}
                                                style={{width: '100%', minWidth: '100%', }}
                                                placeholder='SELECCIONAR FECHA'
                                                format={'DD/MM/YYYY'}
                                                value={this.state.fechainicio == '' ? undefined: moment(this.state.fechainicio, 'DD/MM/YYYY')}
                                                onChange={(date, dateString) => {
                                                    this.setState({ fechainicio: dateString, });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12' style={{paddingTop: 0, }}>
                                        <div className='inputs-groups'>
                                            <DatePicker className={'hg_40'}
                                                style={{width: '100%', minWidth: '100%', }}
                                                placeholder='SELECCIONAR FECHA'
                                                format={'DD/MM/YYYY'}
                                                value={this.state.fechafinal == '' ? undefined: moment(this.state.fechafinal, 'DD/MM/YYYY')}
                                                onChange={(date, dateString) => {
                                                    this.setState({ fechafinal: dateString, });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12' style={{paddingTop: 0, }}>
                                        <div className='inputs-groups'>
                                            <input type='text' placeholder=''
                                                style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24,
                                                    background: 'white'
                                                }} placeholder='Ingresar descuento...'
                                                className={`forms-control`} maxLength='10'
                                                value={this.state.descuento}
                                                onChange={ (event) => {
                                                    var descuento = event.target.value == '' ? 0 : event.target.value;
                                                    if (!isNaN(descuento)) {
                                                        if (parseInt(descuento) >= 0 && parseInt(descuento) <= 100) {
                                                            this.setState({descuento: parseInt(descuento),}, () => this.ongenerarDescuento() );
                                                            return;
                                                        }
                                                        message.warning('DEBE TENER EL RANGO DE NRO ENTRE 0 - 100');
                                                        return;
                                                    }
                                                    message.warning('SOLO SE PERMITE NUMERO.');
                                                }}
                                            />
                                            {(this.state.descuento == 0 || this.state.descuento == '') ? null : 
                                                <i className='fa fa-close delete_icon' style={{right: 23, }}
                                                    onClick={() => {
                                                        this.setState({ descuento: 0, }, () => this.ongenerarDescuento())
                                                    } }
                                                ></i> 
                                            }
                                            <i className='fa fa-angle-up blue_hover' 
                                                style={{fontSize: 14, position: 'absolute', top: 3, right: 5, cursor: 'pointer',
                                                    padding: 0, paddingLeft: 2, paddingRight: 2, 
                                                }}
                                                onClick={() => {
                                                    var descuento = this.state.descuento;
                                                    if (parseInt(descuento) >= 0 && parseInt(descuento) <= 100) {
                                                        this.setState({ descuento: parseInt(descuento) + 1, }, () => this.ongenerarDescuento());
                                                    }
                                                }}
                                            ></i>
                                            <i className='fa fa-angle-down blue_hover' 
                                                style={{fontSize: 14, position: 'absolute', bottom: 3, right: 5, cursor: 'pointer',
                                                    padding: 0, paddingLeft: 2, paddingRight: 2, 
                                                }}
                                                onClick={() => {
                                                    var descuento = this.state.descuento;
                                                    if (parseInt(descuento) > 0) {
                                                        this.setState({ descuento: parseInt(descuento) - 1, }, () => this.ongenerarDescuento());
                                                    }
                                                }}
                                            ></i>
                                        </div>
                                    </div>
                                </div>
                                <div className='forms-groups'>
                                    <div className='cols-lg-2 cols-md-2 cols-sm-2'></div>
                                    <div className='cols-lg-8 cols-md-8 cols-sm-8 cols-xs-12' style={{paddingTop: 0, }}>
                                        <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12' style={{paddingTop: 0, }}>
                                            <div className='inputs-groups'>
                                                <input type='text' className={`forms-control title_form ${this.props.buttoncolor}`} 
                                                    value={'Servicio / Producto'} readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12' style={{paddingTop: 0,}}>
                                            <div className='inputs-groups'>
                                                <input type='text'
                                                    className={`forms-control ${this.state.error_servicio}`}
                                                    value={this.state.search_servicio}
                                                    placeholder='Search Producto / Servicio...'
                                                    onChange={ (event) => this.setState({
                                                        search_servicio: event.target.value, error_servicio: '',
                                                    }) }
                                                />
                                            </div>
                                        </div>
                                        <div className='cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12' style={{paddingTop: 0,}}>
                                            <button className="btn-hover-shine btn btn-light btn-lg btn-block mt-1"
                                                onClick={() => this.get_servicio(1, this.state.search_servicio)}
                                                style={{paddingLeft: 0, paddingRight: 0, display: 'flex', justifyContent: 'center', fontSize: 10, }}
                                            >
                                                BUSCAR
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className='forms-groups'>
                                    <div className="tabless" 
                                        style={{ overflowY: 'auto', overflowX: 'none', maxHeight: 400, 
                                            border: `2px solid ${this.state.error_servicio == '' ? 'transparent' : 'red'}` 
                                        }}
                                    >
                                        <table className="tables-respons">
                                            <thead>
                                                <tr>
                                                    <td className={`title_form ${this.props.buttoncolor}`}>NRO</td>
                                                    <td className={`title_form ${this.props.buttoncolor}`}>DESCRIPCION</td>
                                                    <td className={`title_form ${this.props.buttoncolor}`}>PRECIO</td>
                                                    <td className={`title_form ${this.props.buttoncolor}`}>DESC</td>
                                                    <td className={`title_form ${this.props.buttoncolor}`}>NUEVO PRECIO</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.selected_producto.map((data, key) => {
                                                    if (data.id == null) {
                                                        return (
                                                            <tr key={key}>
                                                                <td style={{height: 40, cursor: 'default', }}> </td>
                                                                <td style={{height: 40, cursor: 'default', }}> </td>
                                                                <td style={{height: 40, cursor: 'default', }}> </td>
                                                                <td style={{height: 40, cursor: 'default', }}> </td>
                                                                <td style={{height: 40, cursor: 'default', }}> </td>
                                                            </tr>
                                                        );
                                                    }
                                                    var error = data.error == null ? {} : {boxShadow: '0 0 15px 5px red inset'};
                                                    return (
                                                        <tr key={key} style={error}>
                                                            <td style={{cursor: 'default', textAlign: 'left', paddingLeft: 10, }}>
                                                                <label className='cols_show'>NRO: </label>
                                                                {key + 1}
                                                            </td>
                                                            <td style={{cursor: 'default', textAlign: 'left', paddingLeft: 10, 
                                                                fontWeight: 'bold', color: '#1890ff', 
                                                            }}>
                                                                <label className='cols_show'>DESCRIPCION: </label>
                                                                {data.descripcion}
                                                            </td>
                                                            <td style={{cursor: 'default', textAlign: 'left', paddingLeft: 10, 
                                                                fontWeight: 'bold', color: '#1890ff', 
                                                            }}>
                                                                <label className='cols_show'>PRECIO: </label>
                                                                {data.precio}
                                                            </td>
                                                            <td style={{cursor: 'default', textAlign: 'left', paddingLeft: 10, 
                                                                fontWeight: 'bold', color: '#1890ff', 
                                                            }}>
                                                                <label className='cols_show'>DESC: </label>
                                                                <Popover placement='top' trigger='click'
                                                                    visible={data.visible_desc}
                                                                    onVisibleChange={this.onVisibleDescuento.bind(this, data)}
                                                                    content={
                                                                        <div>
                                                                            <div style={{textAlign: 'center', paddingBottom: 5,}}>
                                                                                <div className='inputs-groups' style={{width: 150, }}>
                                                                                    <input type='text' placeholder=''
                                                                                        className={`forms-control`} 
                                                                                        style={{paddingRight: 25, color: '#1890ff', }}
                                                                                        value={data.descuento}
                                                                                        onChange={this.onChangeDescuento.bind(this, data)}
                                                                                    />
                                                                                    <i className='fa fa-angle-up blue_hover' 
                                                                                        style={{fontSize: 14, position: 'absolute', top: 3, right: 5, cursor: 'pointer',
                                                                                            padding: 0, paddingLeft: 2, paddingRight: 2, 
                                                                                        }}
                                                                                        onClick={this.onDescuentoIncrementar.bind(this, data)}
                                                                                    ></i>
                                                                                    <i className='fa fa-angle-down blue_hover' 
                                                                                        style={{fontSize: 14, position: 'absolute', bottom: 3, right: 5, cursor: 'pointer',
                                                                                            padding: 0, paddingLeft: 2, paddingRight: 2, 
                                                                                        }}
                                                                                        onClick={this.onDescuentoDecrementar.bind(this, data)}
                                                                                    ></i>
                                                                                </div>
                                                                            </div>
                                                                            <div style={{textAlign: 'center', }}>
                                                                                <Button size='small'
                                                                                    onClick={this.onVisibleDescuento.bind(this, data)}
                                                                                >
                                                                                    ACEPTAR
                                                                                </Button> &nbsp;
                                                                            </div>
                                                                        </div>
                                                                    } 
                                                                    title='DESCUENTO'
                                                                >
                                                                    <a style={{color: 'blue', fontSize: 12, paddingLeft: 4, paddingRight: 4, border: '1px dashed blue' ,}}>
                                                                        {data.descuento + '%'}
                                                                    </a>
                                                                </Popover>
                                                            </td>
                                                            <td style={{cursor: 'default', textAlign: 'left', paddingLeft: 10, 
                                                                fontWeight: 'bold', color: '#1890ff', 
                                                            }}>
                                                                <label className='cols_show'>NUEVO PRECIO: </label>
                                                                {data.preciodescuento}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
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

EditarPromocion.propTypes = {
    buttoncolor: PropTypes.string,
}

EditarPromocion.defaultProps = {
    buttoncolor: '',
}

export default withRouter(EditarPromocion);
