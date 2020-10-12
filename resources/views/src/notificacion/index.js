
import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

import { notification, Card, Modal, message } from 'antd';
import 'antd/dist/antd.css';
import web from '../utils/services';

import PropTypes from 'prop-types';

class IndexNotificacion extends Component {

    constructor(props) {
        super(props);
        this.state = {
            auth: false,
            loading: false,
            
            array_notificacion: [],
            
        }
    }
    componentDidMount() {
        this.props.get_link('', false);
        this.get_data();
    }
    get_data() {
        axios.get( web.servidor + '/notificacion/index').then(
            (response) => {
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        this.props.loadingservice(false, '');
                        this.setState({
                            array_notificacion: response.data.data.data,
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
    onValidar() {
        if ( this.state.descripcion.toString().trim().length > 0) {
            this.onSesion();
        }else {
            if (this.state.descripcion.toString().trim().length == 0) {
                notification.error({
                    message: 'ERROR',
                    description: 'NOMBRE REQUERIDO.',
                });
                this.setState({ error_descripcion: 'error', });
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
        formdata.append('descripcion', this.state.descripcion);

        axios(
            {
                method: 'post',
                url: web.servidor + '/categoria/store',
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
                        description: 'CATEGORIA CREADO EXITOSAMENTE',
                    });
                    this.props.history.goBack();
                    return;
                }
                if (response.data.response == -1) {
                    notification.error({
                        description: 'LA DESCRIPCION DE LA CATEGORIA YA EXISTE. FAVOR DE INGRESAR OTRA DESCRIPCION',
                    });
                    this.setState({ error_descripcion: 'error', });
                    return;
                }
                notification.error({
                    description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE INTENTAR.',
                });
            }
        ).catch( error => {
            this.setState({ loading: false, });
            notification.error({
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
            });
        } );
    }
    formatFecha(date) {
        var array = date.split('-');
        return array[2] + '/' + array[1] + '/' + array[0];
    }
    render() {
        var colorsuccess = this.props.buttoncolor == '' ? 'primary' : this.props.buttoncolor;
        var colordanger = this.props.buttoncolor == '' ? 'danger' : 'outline-' + this.props.buttoncolor;
        var colorback = this.props.buttoncolor == '' ? 'focus' : this.props.buttoncolor;
        return (
            <div className="rows">
                <div className="cards">
                    
                    <div className='forms-groups'>
                        <Card
                            style={{ width: '100%', minWidth: '100%', }}
                            title="LISTA DE NOTIFICACIÓN"
                            headStyle={{fontSize: 14, }}
                            bodyStyle={{padding: 4, paddingTop: 0, }}
                        >
                            <div className="forms-groups">
                                <div className="tabless">
                                    <table className="tables-respons">
                                        <thead>
                                            <tr>
                                                <td style={{fontWeight: 'bold'}}>Usuario</td>
                                                <td style={{fontWeight: 'bold'}}>Mensaje</td>
                                                <td style={{fontWeight: 'bold'}}>Opción</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.array_notificacion.map(
                                                (data, key) => (
                                                    <tr key={key} style={{background: (data.estado == 'A') ? 'white' : '#e8e8e8', }}>
                                                        <td style={{fontWeight: (data.estado == 'A') ? 'bold': '500', paddingTop: 10, paddingBottom: 10,}}>
                                                            {data.nombre} {data.apellido}
                                                        </td>
                                                        <td style={{fontWeight: (data.estado == 'A') ? 'bold': '500', paddingTop: 10, paddingBottom: 10, fontSize: 10,}}>
                                                            <p>{data.mensaje}</p>
                                                            <p style={{textAlign: 'right', fontSize: 9, color: '#3f6ad8'}}>{this.formatFecha(data.fecha)}</p>
                                                        </td>
                                                        <td style={{textAlign: 'center',}}>
                                                            
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }
}

IndexNotificacion.propTypes = {
    buttoncolor: PropTypes.string,
}

IndexNotificacion.defaultProps = {
    buttoncolor: '',
}

export default withRouter(IndexNotificacion);
