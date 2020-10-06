
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {BrowserRouter, Route} from 'react-router-dom';
import axios from 'axios';

import { notification, Drawer, Modal } from 'antd';
import 'antd/dist/antd.css';

import Header from './layouts/header';
import Sidebar from './layouts/sidebar';
import Footer from './layouts/footer';

import Home from './home';

import IndexRol from './administracion/rol';
import CreateRol from './administracion/rol/crear';
import EditarRol from './administracion/rol/editar';

import IndexUsuario from './administracion/usuario';
import CreateUsuario from './administracion/usuario/crear';
import EditarUsuario from './administracion/usuario/editar';
import ShowUsuario from './administracion/usuario/show';

import Asignar_Permiso from './administracion/permiso/asignar';

import IndexPromocion from './servicio/promocion';
import CreatePromocion from './servicio/promocion/crear';
import EditarPromocion from './servicio/promocion/editar';

import IndexCliente from './servicio/cliente';
import CreateCliente from './servicio/cliente/crear';
import EditarCliente from './servicio/cliente/editar';
import ShowCliente from './servicio/cliente/show';

import IndexCategoria from './servicio/categoria';
import CreateCategoria from './servicio/categoria/crear';
import EditarCategoria from './servicio/categoria/editar';

import IndexServicio from './servicio/service';
import CreateServicio from './servicio/service/crear';
import EditarServicio from './servicio/service/editar';
import ShowServicio from './servicio/service/show';

import IndexSolicitud from './servicio/solicitud';
import CreateSolicitud from './servicio/solicitud/crear';
import ShowSolicitud from './servicio/solicitud/show';

import IndexMySolicitud from './pedido';
import CreateMySolicitud from './pedido/crear';
import ShowMySolicitud from './pedido/show';

import IndexMySolicitudAsignado from './solicitudasignado';
import ShowMySolicitudAsignado from './solicitudasignado/show';

import GenerarReporte from './servicio/reporte';

import IndexPersonal from './administracion/personal';
import CreatePersonal from './administracion/personal/crear';
import EditarPersonal from './administracion/personal/editar';
import ShowPersonal from './administracion/personal/show';

import AsignarTrabajo from './administracion/asignartrabajo';

import VisualizarSeguimiento from './administracion/seguimiento';

import Reporte from './reporte';

import web from './utils/services';

import Ajuste from './ajuste';
import Perfil from './perfil';


const pagination_default = { 
    'total': 0, 'current_page': 0,
    'per_page': 0, 'last_page': 0,
    'from': 0, 'to': 0,
};

export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading_page: false,

            layoutoption: {sidebarcolor: '', headercolor: '', footercolor: '',
                plantillacolor: '', buttoncolor: '', sizetext: '',
            },

            permisos_habilitados: [],

            visitasitio: '',
            namedelete: '',
            iddelete: null,

            visible: false,
            visible_drawer: false,
            loading: false,

            sesion: false,

            token: '',
            auth: false,
            
            usuario: {
                id: '', nombre: '',
                apellido: '', nacimiento: '',
                usuario: '', imagen: '', genero: 'N',
                email: '', rol: '', descripcion: '',
            },

            paginate: {
                usuario: 1, rol: 1, promocion: 1, cliente: 1,
                servicio: 1, categoria: 1, solicitud: 1, personal: 1,
            },

            pagination: {
                usuario: pagination_default,
                rol: pagination_default,
                promocion: pagination_default,
                cliente: pagination_default,
                servicio: pagination_default,
                categoria: pagination_default,
                solicitud: pagination_default,
                personal: pagination_default,
            },

            array_rol: [],
            array_usuario: [],
            array_promocion: [],
            array_cliente: [],
            array_servicio: [],
            array_categoria: [],
            array_personal: [],
            array_solicitud: [],
            
            menu: {
                dashboards: '',
                seguridad: '',
                servicio: '',
                administracion: '',
            },
            link: {
                home: '',
                perfil: '',
                ajuste: '',
                reporte: '',

                usuario: '',
                rol: '',
                asignar_permiso: '',

                promocion: '',
                cliente: '',
                categoria: '',
                servicio: '',
                solicitud: '',
                generar_reporte: '',
                mysolicitud_pedido: '',
                mysolicitud_asignado: '',

                personal: '',
                asignar_trabajo: '',
                visualizar_seguimiento: '',
            },

            array_notificacion: [],

            cargando: this.get_notificacion(),

        }
    }
    componentDidMount() {
        this.get_data();
    }
    get_data() {
        axios.get( web.servidor + '/usuario/get_information').then(
            (response) => {
                console.log(response.data)
                if (response.data.response == -3) {
                    this.onLogout();
                    return;
                }
                if (response.data.response == 1) {
                    if (response.data.ajuste != null) {
                        this.state.layoutoption.headercolor = response.data.ajuste.colorheader == null ? '' : response.data.ajuste.colorheader;
                        this.state.layoutoption.sidebarcolor = response.data.ajuste.colorsidebar == null ? '' : response.data.ajuste.colorsidebar;
                        this.state.layoutoption.footercolor = response.data.ajuste.colorfooter == null ? '' : response.data.ajuste.colorfooter;
                        this.state.layoutoption.buttoncolor = response.data.ajuste.colorgeneral == null ? '' : response.data.ajuste.colorgeneral;
                        this.state.layoutoption.sizetext = response.data.ajuste.sizetext == null ? '' : response.data.ajuste.sizetext;
                    }
                    this.setState({
                        token: response.data.token,
                        usuario: response.data.usuario,
                        layoutoption: this.state.layoutoption,
                        sesion: true,
                        permisos_habilitados: response.data.permiso,
                        loading_page: true,
                        array_notificacion: response.data.notificacion,
                    });
                }
            }
        ).catch( error => {
            console.log(error)
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
        } );
    }
    get_notificacion() {
        setInterval(() => {
            if (this.state.loading_page) {
                axios.get( web.servidor + '/usuario/get_notificacion/' + this.state.usuario.usuario ).then(
                    (response) => {
                        if (response.data.response == -3) {
                            this.onLogout();
                            return;
                        } 
                        if (response.data.response == 1) {
                            if (response.data.notificacion.length > 0) {
                                this.setState({
                                    array_notificacion: response.data.notificacion,
                                });
                            }
                        }
                    }
                ).catch( error => {
                    notification.error({
                        description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
                        zIndex: 1200,
                    });
                } );
            }
        }, 4000);
    }
    updatePerfil(data) {
        this.setState({
            usuario: data,
        });
    }
    init() {
        
    }
    getusuario(data, pagination, page, visitasitio = '') {
        this.state.pagination.usuario = pagination;
        this.state.paginate.usuario = page;
        this.setState({
            array_usuario: data,
            pagination: this.state.pagination,
            paginate: this.state.paginate,
            visible_drawer: false,
            visitasitio: visitasitio,
        });
    }
    getrol(data, pagination, page, visitasitio = '') {
        this.state.pagination.rol = pagination;
        this.state.paginate.rol = page;
        this.setState({
            array_rol: data,
            pagination: this.state.pagination,
            paginate: this.state.paginate,
            visible_drawer: false,
            visitasitio: visitasitio,
        });
    }
    getpromocion(data, pagination, page, visitasitio = '') {
        this.state.pagination.promocion = pagination;
        this.state.paginate.promocion = page;
        this.setState({
            array_promocion: data,
            pagination: this.state.pagination,
            paginate: this.state.paginate,
            visible_drawer: false,
            visitasitio: visitasitio,
        });
    }
    getcliente(data, pagination, page, visitasitio = '') {
        this.state.pagination.cliente = pagination;
        this.state.paginate.cliente = page;
        this.setState({
            array_cliente: data,
            pagination: this.state.pagination,
            paginate: this.state.paginate,
            visible_drawer: false,
            visitasitio: visitasitio,
        });
    }
    getservicio(data, pagination, page, visitasitio = '') {
        this.state.pagination.servicio = pagination;
        this.state.paginate.servicio = page;
        this.setState({
            array_servicio: data,
            pagination: this.state.pagination,
            paginate: this.state.paginate,
            visible_drawer: false,
            visitasitio: visitasitio,
        });
    }
    getcategoria(data, pagination, page, visitasitio = '') {
        this.state.pagination.categoria = pagination;
        this.state.paginate.categoria = page;
        this.setState({
            array_categoria: data,
            pagination: this.state.pagination,
            paginate: this.state.paginate,
            visible_drawer: false,
            visitasitio: visitasitio,
        });
    }
    getsolicitud(data, pagination, page, visitasitio = '') {
        this.state.pagination.solicitud = pagination;
        this.state.paginate.solicitud = page;
        this.setState({
            array_solicitud: data,
            pagination: this.state.pagination,
            paginate: this.state.paginate,
            visible_drawer: false,
            visitasitio: visitasitio,
        });
    }
    getpersonal(data, pagination, page, visitasitio = '') {
        this.state.pagination.personal = pagination;
        this.state.paginate.personal = page;
        this.setState({
            array_personal: data,
            pagination: this.state.pagination,
            paginate: this.state.paginate,
            visible_drawer: false,
            visitasitio: visitasitio,
        });
    }
    onModalActive(data, namedelete) {
        this.setState({
            visible: true,
            iddelete: data.id,
            namedelete: namedelete,
        });
    }
    onEliminar() {
        this.setState({
            loading: true,
        });
        if (this.state.namedelete == 'grupousuario') {
            this.deleterol();
        }
        if (this.state.namedelete == 'usuario') {
            this.deleteusuario();
        }
        if (this.state.namedelete == 'promocion') {
            this.deletepromocion();
        }
        if (this.state.namedelete == 'cliente') {
            this.deletecliente();
        }
        if (this.state.namedelete == 'categoria') {
            this.deletecategoria();
        }
        if (this.state.namedelete == 'servicio') {
            this.deleteservicio();
        }
        if (this.state.namedelete == 'personal') {
            this.deletepersonal();
        }
    }
    deleterol(page = 1) {
        var formdata = new FormData();
        formdata.append('idrol', this.state.iddelete);
        axios(
            {
                method: 'post',
                url: web.servidor + '/rol/delete?page=' + page,
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
                        description: 'EXITO EN ELIMINAR GRUPO USUARIO.',
                    });
                    this.state.pagination.rol = response.data.pagination;
                    this.state.paginate.rol = page;
                    this.setState({
                        array_rol: response.data.data.data,
                        pagination: this.state.pagination,
                        paginate: this.state.paginate,
                    });
                }
                if (response.data.response == -1) {
                    notification.warning({
                        message: 'WARNING',
                        description: 'NO SE PUDO ELIMINAR. YA QUE EXISTE EN UN USUARIO ASIGNADO.',
                    });
                }
                this.onCloseModal();
            }
        ).catch(
            error => {
                notification.error({
                    message: 'ERROR',
                    description: 'HUBO PROBLEMA AL REALIZAR LA SOLICITUD.',
                });
                this.onCloseModal();
            }
        );
    }
    deleteusuario() {
        var formdata = new FormData();
        formdata.append('idusuario', this.state.iddelete);
        axios(
            {
                method: 'post',
                url: web.servidor + '/usuario/delete',
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
                    this.setState({
                        array_usuario: response.data.data,
                    });
                }
                if (response.data.response == -1) {
                }
                this.onCloseModal();
            }
        ).catch(
            error => {
                console.log(error)
            }
        );
    }
    deletepromocion(page = 1) {
        var formdata = new FormData();
        formdata.append('idpromocion', this.state.iddelete);
        axios(
            {
                method: 'post',
                url: web.servidor + '/promocion/delete?page=' + page,
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
                        description: 'EXITO EN ELIMINAR PROMOCION.',
                    });
                    this.state.pagination.promocion = response.data.pagination;
                    this.state.paginate.promocion = page;
                    this.setState({
                        array_promocion: response.data.data.data,
                        pagination: this.state.pagination,
                        paginate: this.state.paginate,
                    });
                }
                if (response.data.response == -1) {
                    notification.warning({
                        message: 'WARNING',
                        description: 'NO SE PUDO ELIMINAR YA QUE EXISTE UNA TRANSACCION REALIZADA.',
                    });
                }
                this.onCloseModal();
            }
        ).catch(
            error => {
                notification.error({
                    message: 'ERROR',
                    description: 'HUBO PROBLEMA AL REALIZAR LA SOLICITUD.',
                });
                this.onCloseModal();
            }
        );
    }
    deletecategoria(page = 1) {
        var formdata = new FormData();
        formdata.append('idcategoria', this.state.iddelete);
        axios(
            {
                method: 'post',
                url: web.servidor + '/categoria/delete?page=' + page,
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
                        description: 'EXITO EN ELIMINAR CATEGORIA.',
                    });
                    this.state.pagination.categoria = response.data.pagination;
                    this.state.paginate.categoria = page;
                    this.setState({
                        array_categoria: response.data.data.data,
                        pagination: this.state.pagination,
                        paginate: this.state.paginate,
                    });
                }
                if (response.data.response == -1) {
                    notification.warning({
                        message: 'WARNING',
                        description: 'NO SE PUDO ELIMINAR. YA QUE ESTA REGISTRADO EN UN SERVICIO.',
                    });
                }
                this.onCloseModal();
            }
        ).catch(
            error => {
                notification.error({
                    message: 'ERROR',
                    description: 'HUBO PROBLEMA AL REALIZAR LA SOLICITUD.',
                });
                this.onCloseModal();
            }
        );
    }
    deleteservicio(page = 1) {
        var formdata = new FormData();
        formdata.append('idservicio', this.state.iddelete);
        axios(
            {
                method: 'post',
                url: web.servidor + '/servicio/delete?page=' + page,
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
                        description: 'EXITO EN ELIMINAR SERVICIO.',
                    });
                    this.state.pagination.servicio = response.data.pagination;
                    this.state.paginate.servicio = page;
                    this.setState({
                        array_servicio: response.data.data.data,
                        pagination: this.state.pagination,
                        paginate: this.state.paginate,
                    });
                }
                if (response.data.response == -1) {
                    notification.warning({
                        message: 'WARNING',
                        description: 'NO SE PUDO ELIMINAR. YA QUE EXISTE EN UNA SOLICITUD REALIZADA.',
                    });
                }
                this.onCloseModal();
            }
        ).catch(
            error => {
                notification.error({
                    message: 'ERROR',
                    description: 'HUBO PROBLEMA AL REALIZAR LA SOLICITUD.',
                });
                this.onCloseModal();
            }
        );
    }
    deletecliente(page = 1) {
        var formdata = new FormData();
        formdata.append('idcliente', this.state.iddelete);
        axios(
            {
                method: 'post',
                url: web.servidor + '/cliente/delete?page=' + page,
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
                        description: 'EXITO EN ELIMINAR CLIENTE.',
                    });
                    this.state.pagination.cliente = response.data.pagination;
                    this.state.paginate.cliente = page;
                    this.setState({
                        array_cliente: response.data.data.data,
                        pagination: this.state.pagination,
                        paginate: this.state.paginate,
                    });
                }
                if (response.data.response == -1) {
                    notification.warning({
                        message: 'WARNING',
                        description: 'NO SE PUDO ELIMINAR. YA QUE EXISTE EN UNA SOLICITUD REALIZADA.',
                    });
                }
                this.onCloseModal();
            }
        ).catch(
            error => {
                notification.error({
                    message: 'ERROR',
                    description: 'HUBO PROBLEMA AL REALIZAR LA SOLICITUD.',
                });
                this.onCloseModal();
            }
        );
    }
    deletepersonal(page = 1) {
        var formdata = new FormData();
        formdata.append('idpersonal', this.state.iddelete);
        axios(
            {
                method: 'post',
                url: web.servidor + '/personal/delete?page=' + page,
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
                        description: 'EXITO EN ELIMINAR PERSONAL.',
                    });
                    this.state.pagination.personal = response.data.pagination;
                    this.state.paginate.personal = page;
                    this.setState({
                        array_personal: response.data.data.data,
                        pagination: this.state.pagination,
                        paginate: this.state.paginate,
                    });
                }
                if (response.data.response == -1) {
                    notification.warning({
                        message: 'WARNING',
                        description: 'NO SE PUDO ELIMINAR. YA QUE EXISTE EN UNA SOLICITUD REALIZADA.',
                    });
                }
                this.onCloseModal();
            }
        ).catch(
            error => {
                notification.error({
                    message: 'ERROR',
                    description: 'HUBO PROBLEMA AL REALIZAR LA SOLICITUD.',
                });
                this.onCloseModal();
            }
        );
    }
    onCloseModal() {
        this.setState({
            visible: false,
            loading: false,
            namedelete: '',
            iddelete: null,
        });
    }
    get_link(link = '', bandera = false) {

        this.state.menu.dashboards = '';
        this.state.menu.seguridad = '';
        this.state.menu.servicio = '';
        this.state.menu.administracion = '';

        this.state.link.home = '';
        this.state.link.perfil = '';
        this.state.link.ajuste = '';
        this.state.link.usuario = '';
        this.state.link.rol = '';
        this.state.link.promocion = '';
        this.state.link.cliente = '';
        this.state.link.personal = '';
        this.state.link.categoria = '';
        this.state.link.servicio = '';
        this.state.link.solicitud = '';
        this.state.link.asignar_permiso = '';
        this.state.link.asignar_trabajo = '';
        this.state.link.generar_reporte = '';
        this.state.link.mysolicitud_asignado = '';
        this.state.link.mysolicitud_pedido = '';

        if (link == 'home') {
            this.state.menu.dashboards = 'mm-active';
            this.state.link.home = 'mm-active';
        }
        if (link == 'perfil') {
            this.state.menu.dashboards = 'mm-active';
            this.state.link.perfil = 'mm-active';
        }
        if (link == 'ajuste') {
            this.state.menu.dashboards = 'mm-active';
            this.state.link.ajuste = 'mm-active';
        }
        if (link == 'reporte') {
            this.state.menu.dashboards = 'mm-active';
            this.state.link.reporte = 'mm-active';
        }
        if (link == 'usuario') {
            this.state.menu.seguridad = 'mm-active';
            this.state.link.usuario = 'mm-active';
        }
        if (link == 'rol') {
            this.state.menu.seguridad = 'mm-active';
            this.state.link.rol = 'mm-active';
        }
        if (link == 'asignar_permiso') {
            this.state.menu.seguridad = 'mm-active';
            this.state.link.asignar_permiso = 'mm-active';
        }
        if (link == 'promocion') {
            this.state.menu.servicio = 'mm-active';
            this.state.link.promocion = 'mm-active';
        }
        if (link == 'cliente') {
            this.state.menu.servicio = 'mm-active';
            this.state.link.cliente = 'mm-active';
        }
        if (link == 'categoria') {
            this.state.menu.servicio = 'mm-active';
            this.state.link.categoria = 'mm-active';
        }
        if (link == 'servicio') {
            this.state.menu.servicio = 'mm-active';
            this.state.link.servicio = 'mm-active';
        }
        if (link == 'solicitud') {
            this.state.menu.servicio = 'mm-active';
            this.state.link.solicitud = 'mm-active';
        }
        if (link == 'generar_reporte') {
            this.state.menu.servicio = 'mm-active';
            this.state.link.generar_reporte = 'mm-active';
        }
        if (link == 'personal') {
            this.state.menu.administracion = 'mm-active';
            this.state.link.personal = 'mm-active';
        }
        if (link == 'asignar_trabajo') {
            this.state.menu.administracion = 'mm-active';
            this.state.link.asignar_trabajo = 'mm-active';
        }
        if (link == 'visualizar_seguimiento') {
            this.state.menu.administracion = 'mm-active';
            this.state.link.visualizar_seguimiento = 'mm-active';
        }
        if (link == 'mysolicitud_pedido') {
            this.state.link.mysolicitud_pedido = 'mm-active';
        }
        if (link == 'mysolicitud_asignado') {
            this.state.link.mysolicitud_asignado = 'mm-active';
        }
        this.setState({
            menu: this.state.menu,
            link: this.state.link,
            visible_drawer: bandera,
        });
    }
    loadingservice(bandera = false, visitasitio = '') {
        if (bandera) {
            return;
        }
        this.setState({
            visible_drawer: false,
            visitasitio: visitasitio,
        });
    }
    onLogout() {
        this.setState({ sesion: false, });
        notification.warning({
            message: 'SESION',
            description: 'TIEMPO DE SESION EXPIRADO. REDIRECCIONANDO A LOGIN.',
        });
        setTimeout(() => {
            document.getElementById('redirect_login').click();
        }, 3000);
    }

    onSelectColorHeader(data) {
        this.state.layoutoption.headercolor = data;
        this.setState({ layoutoption: this.state.layoutoption });
    }
    onSelectColorSidebar(data) {
        this.state.layoutoption.sidebarcolor = data;
        this.setState({ layoutoption: this.state.layoutoption });
    }
    onSelectColorFooter(data) {
        this.state.layoutoption.footercolor = data;
        this.setState({ layoutoption: this.state.layoutoption });
    }
    onSelectColorButton(data) {
        this.state.layoutoption.buttoncolor = data;
        this.setState({ layoutoption: this.state.layoutoption });
    }
    onSelectSizeLetra(data) {
        this.state.layoutoption.sizetext = data;
        this.setState({ layoutoption: this.state.layoutoption });
    }
    desactivarnotificacion(data) {
        this.setState({
            array_notificacion: data,
        });
    }
    render() {
        if (!this.state.sesion) {
            return (
                <div className='app-container app-theme-white body-tabs-shadow fixed-header fixed-sidebar' 
                    style={{display: 'flex', justifyContent: 'center', alignItems: 'center',}}
                >
                    <a href={ web.home + "/login"} id='redirect_login' style={{display: 'none',}}> </a>
                    <div className='loaders-wrappers d-flexs justifys-contents-centers aligns-items-centers'>
                        <div className='loaders'>
                            <div className='balls-scales-ripples-multiples'>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            
            <BrowserRouter>
                <div className="app-container app-theme-white body-tabs-shadow fixed-header fixed-sidebar fixed-footer">
                    
                    <Header 
                        usuario={this.state.usuario} token={this.state.token}
                        headercolor={this.state.layoutoption.headercolor} 
                        notificacion={this.state.array_notificacion}
                        desactivarnotificacion={this.desactivarnotificacion.bind(this)}
                    />

                    <div className="app-main">

                        <Sidebar 
                            menu_active={this.state.menu}
                            link_active={this.state.link}
                            init={this.init.bind(this)}
                            sidebarcolor={this.state.layoutoption.sidebarcolor}
                            sizetext={this.state.layoutoption.sizetext}
                            permisos_habilitados={this.state.permisos_habilitados}
                        />

                        <div className="app-main__outer">
                            <div className="app-main__inner">
                                <div className="app-page-title">

                                    <Route exact path={ web.home + '/home'} 
                                        render={props => 
                                            <Home get_link={this.get_link.bind(this)} 
                                                logout={this.onLogout.bind(this)}
                                                permisos_habilitados={this.state.permisos_habilitados}
                                                { ...props} 
                                            />
                                        } 
                                    />

                                    <Route exact path={ web.serv_link + '/ajuste' } 
                                        render={ props => 
                                            <Ajuste { ...props} logout={this.onLogout.bind(this)}  
                                                onSelectColorHeader={this.onSelectColorHeader.bind(this)}  
                                                onSelectColorSidebar={this.onSelectColorSidebar.bind(this)}
                                                onSelectColorFooter={this.onSelectColorFooter.bind(this)}
                                                onSelectColorButton={this.onSelectColorButton.bind(this)}
                                                onSelectSizeLetra={this.onSelectSizeLetra.bind(this)}
                                                loadingservice={this.loadingservice.bind(this)}
                                                get_link={this.get_link.bind(this)}
                                                buttoncolor={this.state.layoutoption.buttoncolor}
                                                sizetext={this.state.layoutoption.sizetext}
                                            /> 
                                        }
                                    />
                                    <Route exact path={ web.serv_link + '/perfil'} 
                                        render={props => 
                                            <Perfil 
                                                get_link={this.get_link.bind(this)} 
                                                logout={this.onLogout.bind(this)}
                                                loadingservice={this.loadingservice.bind(this)}
                                                buttoncolor={this.state.layoutoption.buttoncolor}
                                                updatePerfil={this.updatePerfil.bind(this)}
                                                { ...props} 
                                            />
                                        } 
                                    />

                                    <Route exact path={ web.serv_link + '/reporte_general'} 
                                        render={props => 
                                            <Reporte 
                                                get_link={this.get_link.bind(this)} 
                                                logout={this.onLogout.bind(this)}
                                                loadingservice={this.loadingservice.bind(this)}
                                                buttoncolor={this.state.layoutoption.buttoncolor}
                                                updatePerfil={this.updatePerfil.bind(this)}
                                                loading_page={this.state.loading_page}
                                                { ...props} 
                                            />
                                        } 
                                    />

                                    <Route exact path={ web.serv_link + '/usuario'} render={props => 
                                        <IndexUsuario { ...props} 
                                            getusuario={this.getusuario.bind(this)}
                                            usuario={this.state.array_usuario}
                                            pagination= {this.state.pagination}
                                            paginate= {this.state.paginate}
                                            onModalActive={this.onModalActive.bind(this)}

                                            get_link={this.get_link.bind(this)}
                                            logout={this.onLogout.bind(this)}

                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                            permisos_habilitados={this.state.permisos_habilitados}

                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/usuario/edit/:id' }
                                        render={props => 
                                            <EditarUsuario get_link={this.get_link.bind(this)} { ...props} 
                                                logout={this.onLogout.bind(this)}
                                                loadingservice={this.loadingservice.bind(this)}
                                                buttoncolor={this.state.layoutoption.buttoncolor}
                                            />} 
                                    />    
                                    <Route exact path={ web.serv_link + '/usuario/show/:id' }
                                        render={props => 
                                            <ShowUsuario get_link={this.get_link.bind(this)} { ...props} 
                                                logout={this.onLogout.bind(this)}
                                                loadingservice={this.loadingservice.bind(this)}
                                                buttoncolor={this.state.layoutoption.buttoncolor}
                                            />} 
                                    />                                    
                                    <Route exact path={ web.serv_link + '/usuario/create' }
                                        render={props => 
                                            <CreateUsuario get_link={this.get_link.bind(this)} { ...props} 
                                                loadingservice={this.loadingservice.bind(this)}
                                                logout={this.onLogout.bind(this)}
                                                buttoncolor={this.state.layoutoption.buttoncolor}
                                            />} 
                                    />


                                    <Route exact path={ web.serv_link + '/rol'} render={props => 
                                        <IndexRol { ...props} 
                                            getrol={this.getrol.bind(this)}
                                            rol={this.state.array_rol}
                                            pagination= {this.state.pagination}
                                            paginate= {this.state.paginate}
                                            onModalActive={this.onModalActive.bind(this)}

                                            get_link={this.get_link.bind(this)}
                                            logout={this.onLogout.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                            permisos_habilitados={this.state.permisos_habilitados}

                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/rol/create'}
                                        render={props => 
                                            <CreateRol get_link={this.get_link.bind(this)} { ...props} 
                                                logout={this.onLogout.bind(this)}
                                                loadingservice={this.loadingservice.bind(this)}
                                                buttoncolor={this.state.layoutoption.buttoncolor}
                                            />} 
                                    />
                                    <Route exact path={ web.serv_link + '/rol/edit/:id'} 
                                        render={props => 
                                            <EditarRol get_link={this.get_link.bind(this)} { ...props} 
                                                logout={this.onLogout.bind(this)}
                                                loadingservice={this.loadingservice.bind(this)}
                                                buttoncolor={this.state.layoutoption.buttoncolor}
                                            />} 
                                    />


                                    <Route exact path={ web.serv_link + '/asignar_permiso' }
                                        render={props => <Asignar_Permiso 
                                            get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />


                                    <Route exact path={ web.serv_link + '/cliente'} render={props => 
                                        <IndexCliente { ...props} 
                                            getcliente={this.getcliente.bind(this)}
                                            cliente={this.state.array_cliente}
                                            onModalActive={this.onModalActive.bind(this)} { ...props}
                                            pagination= {this.state.pagination}
                                            paginate= {this.state.paginate}

                                            get_link={this.get_link.bind(this)}
                                            logout={this.onLogout.bind(this)}

                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                            permisos_habilitados={this.state.permisos_habilitados}

                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/cliente/create'} 
                                        render={props => 
                                        <CreateCliente get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/cliente/editar/:id'} 
                                        render={props => 
                                        <EditarCliente get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/cliente/show/:id'} 
                                        render={props => 
                                        <ShowCliente get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />



                                    <Route exact path={ web.serv_link + '/categoria'} render={props => 
                                        <IndexCategoria { ...props} 
                                            getcategoria={this.getcategoria.bind(this)}
                                            categoria={this.state.array_categoria}
                                            onModalActive={this.onModalActive.bind(this)} { ...props}
                                            pagination= {this.state.pagination}
                                            paginate= {this.state.paginate}

                                            get_link={this.get_link.bind(this)}
                                            logout={this.onLogout.bind(this)}

                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                            permisos_habilitados={this.state.permisos_habilitados}

                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/categoria/create'} 
                                        render={props => 
                                        <CreateCategoria get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/categoria/editar/:id'} 
                                        render={props => 
                                        <EditarCategoria get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />



                                    <Route exact path={ web.serv_link + '/servicio'} render={props => 
                                        <IndexServicio { ...props} 
                                            getservicio={this.getservicio.bind(this)}
                                            servicio={this.state.array_servicio}
                                            getcategoria={this.getcategoria.bind(this)}
                                            categoria={this.state.array_categoria}
                                            onModalActive={this.onModalActive.bind(this)} { ...props}
                                            pagination= {this.state.pagination}
                                            paginate= {this.state.paginate}

                                            get_link={this.get_link.bind(this)}
                                            logout={this.onLogout.bind(this)}

                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                            permisos_habilitados={this.state.permisos_habilitados}

                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/servicio/create'} 
                                        render={props => 
                                        <CreateServicio get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/servicio/editar/:id'} 
                                        render={props => 
                                        <EditarServicio get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/servicio/show/:id'} 
                                        render={props => 
                                        <ShowServicio get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />



                                    <Route exact path={ web.serv_link + '/solicitud_pedido'} render={props => 
                                        <IndexSolicitud { ...props} 
                                            getsolicitud={this.getsolicitud.bind(this)}
                                            solicitud={this.state.array_solicitud}
                                            onModalActive={this.onModalActive.bind(this)} { ...props}
                                            pagination= {this.state.pagination}
                                            paginate= {this.state.paginate}

                                            get_link={this.get_link.bind(this)}
                                            logout={this.onLogout.bind(this)}

                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                            permisos_habilitados={this.state.permisos_habilitados}

                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/solicitud_pedido/create'} 
                                        render={props => 
                                        <CreateSolicitud get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/solicitud_pedido/show/:id'} 
                                        render={props => 
                                        <ShowSolicitud get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />


                                    <Route exact path={ web.serv_link + '/mysolicitud_pedido'} render={props => 
                                        <IndexMySolicitud { ...props} 
                                            getsolicitud={this.getsolicitud.bind(this)}
                                            solicitud={this.state.array_solicitud}
                                            onModalActive={this.onModalActive.bind(this)} { ...props}
                                            pagination= {this.state.pagination}
                                            paginate= {this.state.paginate}

                                            get_link={this.get_link.bind(this)}
                                            logout={this.onLogout.bind(this)}

                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                            permisos_habilitados={this.state.permisos_habilitados}

                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/mysolicitud_pedido/create'} 
                                        render={props => 
                                        <CreateMySolicitud get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/mysolicitud_pedido/show/:id'} 
                                        render={props => 
                                        <ShowMySolicitud get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />



                                    <Route exact path={ web.serv_link + '/mysolicitud_asignado'} render={props => 
                                        <IndexMySolicitudAsignado { ...props} 
                                            getsolicitud={this.getsolicitud.bind(this)}
                                            solicitud={this.state.array_solicitud}
                                            onModalActive={this.onModalActive.bind(this)} { ...props}
                                            pagination= {this.state.pagination}
                                            paginate= {this.state.paginate}

                                            get_link={this.get_link.bind(this)}
                                            logout={this.onLogout.bind(this)}

                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                            permisos_habilitados={this.state.permisos_habilitados}

                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/mysolicitud_asignado/show/:id'} 
                                        render={props => 
                                        <ShowMySolicitudAsignado get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />


                                    <Route exact path={ web.serv_link + '/generar_reporte'} 
                                        render={props => 
                                        <GenerarReporte get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />



                                    <Route exact path={ web.serv_link + '/personal'} render={props => 
                                        <IndexPersonal { ...props} 
                                            getpersonal={this.getpersonal.bind(this)}
                                            personal={this.state.array_personal}
                                            onModalActive={this.onModalActive.bind(this)} { ...props}
                                            pagination= {this.state.pagination}
                                            paginate= {this.state.paginate}

                                            get_link={this.get_link.bind(this)}
                                            logout={this.onLogout.bind(this)}

                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                            permisos_habilitados={this.state.permisos_habilitados}

                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/personal/create'} 
                                        render={props => 
                                        <CreatePersonal get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/personal/editar/:id'} 
                                        render={props => 
                                        <EditarPersonal get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/personal/show/:id'} 
                                        render={props => 
                                        <ShowPersonal get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />



                                    <Route exact path={ web.serv_link + '/asignar_trabajo'} render={props => 
                                        <AsignarTrabajo { ...props} 
                                            get_link={this.get_link.bind(this)}
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}

                                        />} 
                                    />


                                    <Route exact path={ web.serv_link + '/visualizar_seguimiento'} render={props => 
                                        <VisualizarSeguimiento { ...props} 
                                            get_link={this.get_link.bind(this)}
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}

                                        />} 
                                    />


                                    <Route exact path={ web.serv_link + '/promocion'} render={props => 
                                        <IndexPromocion { ...props} 
                                            getpromocion={this.getpromocion.bind(this)}
                                            promocion={this.state.array_promocion}
                                            onModalActive={this.onModalActive.bind(this)} { ...props}
                                            pagination= {this.state.pagination}
                                            paginate= {this.state.paginate}

                                            get_link={this.get_link.bind(this)}
                                            logout={this.onLogout.bind(this)}

                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                            permisos_habilitados={this.state.permisos_habilitados}

                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/promocion/create'} 
                                        render={props => 
                                        <CreatePromocion get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/promocion/editar/:id'} 
                                        render={props => 
                                        <EditarPromocion get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />

                                </div>
                            </div>

                            <Footer footercolor={this.state.layoutoption.footercolor}
                            />
                            
                        </div>
                    </div>
                    
                    <div className="modal fade bd-example-modal-lg show" 
                        style={{display: (this.state.visible)?'block':'none', paddingRight: 17}}
                    >
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLongTitle">Eliminar Registro</h5>
                                    {(this.state.loading)?null:
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                                            onClick={this.onCloseModal.bind(this)}
                                        >
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    }
                                </div>
                                <div className="modal-body">
                                    {(this.state.loading)?
                                        <div className='loaders-wrappers d-flexs justifys-contents-centers aligns-items-centers'>
                                            <div className='loaders'>
                                                <div className='balls-scales-multiples'>
                                                    <div></div>
                                                    <div></div>
                                                    <div></div>
                                                </div>
                                            </div>
                                        </div>
                                    :
                                        <p>Estas seguro de eliminar {this.state.namedelete}?</p>
                                    }
                                </div>
                                {(this.state.loading)?null:
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal"
                                            onClick={this.onCloseModal.bind(this)}
                                        >
                                            Cerrar
                                        </button>
                                        <button type="button" className="btn btn-primary"
                                            onClick={this.onEliminar.bind(this)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show" 
                        style={{display: (this.state.visible)?'block':'none'}}
                    ></div>

                    <Drawer
                        title={null} placement={'top'}
                        visible={this.state.visible_drawer} closable={false}
                        height={'100vh'} key={'top'}
                        bodyStyle={{ backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)', 
                            display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative',
                            border: '4px solid #eee',
                        }}
                    >
                        <div className='card-body' 
                            style={{ position: 'absolute', top: 80, left: 0, width: '100%', textAlign: 'center', }}
                        >
                            <h5 className="card-title font-size-lg">LIMSERVIP</h5>
                        </div>
                        <div className="avatar-icon-wrapper avatar-icon-xl btn-hover-shine">
                            <div className="avatar-icon rounded logo_img">
                                <img src={ web.img_servidor + '/img/limservip.PNG'} alt="Avatar 5" />
                            </div>
                        </div>
                    </Drawer>

                </div>   
            </BrowserRouter>
        );
    }
}

if (document.getElementById('raiz-index')) {
    ReactDOM.render(<Index />, document.getElementById('raiz-index'));
}

