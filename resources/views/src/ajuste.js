

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { notification, Card, Modal } from 'antd';
import 'antd/dist/antd.css';
import web from './utils/services';

//font-size-xlg  font-size-lg  font-size-md  fsize-1 - 4
// font-weight-light font-weight-lighter font-weight-normal font-weight-bold
// text-uppercase text-lowercase 

export default class Ajuste extends Component {

    constructor (props) {
        super (props);
        this.state = {
            visible_loading: false,
            selectedTema: [],
            selectedSidebar: [],
            selectedHeader: [],
            selectedFooter: [],
            selectedButton: [],
            selectedSize: [false, false, false, false],
            header: '',
            sidebar: '',
            footer: '',
            button: '',
            sizetext: '',
        };
    };

    componentDidMount() {
        this.props.get_link('ajuste', true);
        this.get_data();
    }

    get_data() {
        axios.get( web.servidor + '/ajuste/get_data').then(
            (response) => {
                if (response.data.response == -3) {
                    this.props.logout();
                    return;
                }
                if (response.data.response == 1) {
                    this.props.loadingservice(false, '');
                    console.log(response.data)
                    if (response.data.data != null) {
                        this.setState({
                            header: response.data.data.colorheader == null ? '' : response.data.data.colorheader,
                            sidebar: response.data.data.colorsidebar == null ? '' : response.data.data.colorsidebar,
                            footer: response.data.data.colorfooter == null ? '' : response.data.data.colorfooter,
                            button: response.data.data.colorgeneral == null ? '' : response.data.data.colorgeneral,
                            sizetext: response.data.data.sizetext == null ? '' : response.data.data.sizetext,
                        });
                    }
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

    onSelectColorTema(pos, event) {
        var button = event.target.getAttribute('data-button');
        var header = event.target.getAttribute('data-header');
        var sidebar =event.target.getAttribute('data-sidebar');
        for (let index = 0; index < this.state.selectedTema.length; index++) {
            if (index != pos) this.state.selectedTema[index] = '';
        }
        this.state.selectedTema[pos] = (this.state.selectedTema[pos].length > 0) ? '' : ' active';
        button = (this.state.selectedTema[pos].length > 0) ? button : '';
        header = (this.state.selectedTema[pos].length > 0) ? header : '';
        sidebar = (this.state.selectedTema[pos].length > 0) ? sidebar : '';

        for (let index = 0; index < this.state.selectedHeader.length; index++) {
            this.state.selectedHeader[index] = '';
        }
        for (let index = 0; index < this.state.selectedSidebar.length; index++) {
            this.state.selectedSidebar[index] = '';
        }
        for (let index = 0; index < this.state.selectedFooter.length; index++) {
            this.state.selectedFooter[index] = '';
        }
        for (let index = 0; index < this.state.selectedButton.length; index++) {
            this.state.selectedButton[index] = '';
        }
        this.setState({
            selectedTema: this.state.selectedTema,
            selectedHeader: this.state.selectedHeader,
            header: header,
            selectedSidebar: this.state.selectedSidebar,
            sidebar: sidebar,
            selectedFooter: this.state.selectedFooter,
            footer: sidebar,
            selectedButton: this.state.selectedButton,
            button: button,
        });
        this.props.onSelectColorHeader(header);
        this.props.onSelectColorSidebar(sidebar);
        this.props.onSelectColorFooter(sidebar);
        this.props.onSelectColorButton(button);
    }

    onSelectColorHeader(pos, event) {
        var header =event.target.getAttribute('data-header');
        for (let index = 0; index < this.state.selectedHeader.length; index++) {
            if (index != pos) this.state.selectedHeader[index] = '';
        }
        this.state.selectedHeader[pos] = (this.state.selectedHeader[pos].length > 0) ? '' : ' active';
        header = (this.state.selectedHeader[pos].length > 0) ? header : '';
        this.setState({
            selectedHeader: this.state.selectedHeader,
            header: header,
        });
        this.props.onSelectColorHeader(header);
    }

    onSelectColorSidebar(pos, event) {
        var sidebar =event.target.getAttribute('data-sidebar');
        for (let index = 0; index < this.state.selectedSidebar.length; index++) {
            if (index != pos) this.state.selectedSidebar[index] = '';
        }
        this.state.selectedSidebar[pos] = (this.state.selectedSidebar[pos].length > 0) ? '' : ' active';
        sidebar = (this.state.selectedSidebar[pos].length > 0) ? sidebar : '';
        this.setState({
            selectedSidebar: this.state.selectedSidebar,
            sidebar: sidebar,
        });
        this.props.onSelectColorSidebar(sidebar);
    }

    onSelectColorFooter(pos, event) {
        var footer = event.target.getAttribute('data-footer');
        for (let index = 0; index < this.state.selectedFooter.length; index++) {
            if (index != pos) this.state.selectedFooter[index] = '';
        }
        this.state.selectedFooter[pos] = (this.state.selectedFooter[pos].length > 0) ? '' : ' active';
        footer = (this.state.selectedFooter[pos].length > 0) ? footer : '';
        this.setState({
            selectedFooter: this.state.selectedFooter,
            footer: footer,
        });
        this.props.onSelectColorFooter(footer);
    }

    onSelectColorButton(pos, event) {
        var button =event.target.getAttribute('data-button');
        for (let index = 0; index < this.state.selectedButton.length; index++) {
            if (index != pos) this.state.selectedButton[index] = '';
        }
        this.state.selectedButton[pos] = (this.state.selectedButton[pos].length > 0) ? '' : ' active';
        button = (this.state.selectedButton[pos].length > 0) ? button : '';
        this.setState({
            selectedButton: this.state.selectedButton,
            button: button,
        });
        this.props.onSelectColorButton(button);
    }

    resetColorTema() {
        for (let index = 0; index < this.state.selectedHeader.length; index++) {
            this.state.selectedHeader[index] = '';
        }
        for (let index = 0; index < this.state.selectedSidebar.length; index++) {
            this.state.selectedSidebar[index] = '';
        }
        for (let index = 0; index < this.state.selectedFooter.length; index++) {
            this.state.selectedFooter[index] = '';
        }
        for (let index = 0; index < this.state.selectedButton.length; index++) {
            this.state.selectedButton[index] = '';
        }
        this.setState({
            selectedHeader: this.state.selectedHeader,
            header: '',
            selectedSidebar: this.state.selectedSidebar,
            sidebar: '',
            selectedFooter: this.state.selectedFooter,
            footer: '',
            selectedButton: this.state.selectedButton,
            button: '',
        });
        this.props.onSelectColorHeader('');
        this.props.onSelectColorSidebar('');
        this.props.onSelectColorFooter('');
        this.props.onSelectColorButton('');
    }

    resetColorHeader() {
        for (let index = 0; index < this.state.selectedHeader.length; index++) {
            this.state.selectedHeader[index] = '';
        }
        this.setState({
            selectedHeader: this.state.selectedHeader,
            header: '',
        });
        this.props.onSelectColorHeader('');
    }

    resetColorSidebar() {
        for (let index = 0; index < this.state.selectedSidebar.length; index++) {
            this.state.selectedSidebar[index] = '';
        }
        this.setState({
            selectedSidebar: this.state.selectedSidebar,
            sidebar: '',
        });
        this.props.onSelectColorSidebar('');
    }

    resetColorFooter() {
        for (let index = 0; index < this.state.selectedFooter.length; index++) {
            this.state.selectedFooter[index] = '';
        }
        this.setState({
            selectedFooter: this.state.selectedFooter,
            footer: '',
        });
        this.props.onSelectColorFooter('');
    }

    resetColorButton() {
        for (let index = 0; index < this.state.selectedButton.length; index++) {
            this.state.selectedButton[index] = '';
        }
        this.setState({
            selectedButton: this.state.selectedButton,
            button: '',
        });
        this.props.onSelectColorButton('');
    }

    resetSizeLetra() {
        this.state.selectedSize[0] = false;
        this.state.selectedSize[1] = false;
        this.state.selectedSize[2] = false;
        this.state.selectedSize[3] = false;
        this.setState({
            selectedSize: this.state.selectedSize,
            sizetext: '',
        });
        this.props.onSelectSizeLetra('');
    }

    onActiveTema(pos) {
        if (typeof this.state.selectedTema[pos] == 'undefined') {
            this.state.selectedTema[pos] = '';
        }
        return this.state.selectedTema[pos];
    }

    onActiveHeader(pos) {
        if (typeof this.state.selectedHeader[pos] == 'undefined') {
            this.state.selectedHeader[pos] = '';
        }
        return this.state.selectedHeader[pos];
    }

    onActiveSidebar(pos) {
        if (typeof this.state.selectedSidebar[pos] == 'undefined') {
            this.state.selectedSidebar[pos] = '';
        }
        return this.state.selectedSidebar[pos];
    }

    onActiveFooter(pos) {
        if (typeof this.state.selectedFooter[pos] == 'undefined') {
            this.state.selectedFooter[pos] = '';
        }
        return this.state.selectedFooter[pos];
    }

    onActiveButton(pos) {
        if (typeof this.state.selectedButton[pos] == 'undefined') {
            this.state.selectedButton[pos] = '';
        }
        return this.state.selectedButton[pos];
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

    onValidar(event) {
        event.preventDefault();
        this.setState({ visible_loading: true, });
        this.onSesion();
    }
    onSubmit() {
        var formdata = new FormData();
        formdata.append('header', this.state.header);
        formdata.append('sidebar', this.state.sidebar);
        formdata.append('button', this.state.button);
        formdata.append('footer', this.state.footer);
        formdata.append('sizetext', this.state.sizetext);
        axios(
            {
                method: 'post',
                url: web.servidor + '/ajuste/store',
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
                console.log(this.state.header)
                console.log(this.state.sidebar)
                console.log(this.state.button)
                console.log(this.state.footer)
                console.log(this.state.sizetext)
                if (response.data.response == 1) {
                    notification.success({
                        message: 'SUCCESS',
                        description: 'AJUSTE ACTUALIZADO EXITOSAMENTE.',
                    });
                    this.setState({ visible_loading: false, });
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

    render () {
        var color = this.props.buttoncolor == '' ? 'primary' : this.props.buttoncolor;
        return (
            <div className='row'>
                <div className="theme-settings__inner">
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
                    <div className="scrollbar-container">
                        <div className="theme-settings__options-wrapper">
                            <h3 className={"themeoptions-heading" + ' ' + this.props.sizetext}>  { /* font-size-xlg  font-size-lg  font-size-md */ }
                                <div>
                                    AJUSTES
                                </div>
                            </h3>
                            <div className="col-lg-12">
                                <div id="accordion" className="accordion-wrapper mb-3">
                                    <div className="card">
                                        <div id="headingThree" className="card-header">
                                            <button type="button" data-toggle="collapse" data-target="#collapseOne6" aria-expanded="true" 
                                                aria-controls="collapseThree" className="text-left m-0 p-0 btn btn-link btn-block collapsed"
                                            >
                                                <h5 className={"m-0 p-0" + ' ' + this.props.sizetext}>
                                                    TEMAS
                                                </h5>
                                            </button>
                                        </div>
                                        <div data-parent="#accordion" id="collapseOne6" className="collapse show">
                                            <div className="card-body">
                                                <div className="p-3">
                                                    <ul className="list-group">
                                                        <li className="list-group-item">
                                                            <h5 className="pb-2">
                                                                SELECCIONAR COLOR
                                                                <button type="button" className="btn-pill btn-shadow btn-wide ml-auto btn btn-focus btn-sm pull-right" 
                                                                    data-tema="" onClick={ this.resetColorTema.bind(this) }>
                                                                    RESTAURAR
                                                                </button>
                                                            </h5>
                                                            <div className="theme-settings-swatches">
                                                                <div onClick={ this.onSelectColorTema.bind(this, 0) } className={"swatch-holder bg-primary" + this.onActiveTema(0) } 
                                                                    data-button="primary" data-header="bg-primary header-text-light" data-sidebar="bg-primary sidebar-text-light"  >
                                                                </div>
                                                                <div onClick={ this.onSelectColorTema.bind(this, 1) } className={"swatch-holder bg-secondary" + this.onActiveTema(1) } 
                                                                    data-button="secondary" data-header="bg-secondary header-text-light" data-sidebar="bg-secondary sidebar-text-light"  >
                                                                </div>
                                                                <div onClick={ this.onSelectColorTema.bind(this, 2) } className={"swatch-holder bg-success" + this.onActiveTema(2) } 
                                                                    data-button="success" data-header="bg-success header-text-light" data-sidebar="bg-success sidebar-text-dark"  >
                                                                </div>
                                                                <div onClick={ this.onSelectColorTema.bind(this, 3) } className={"swatch-holder bg-info" + this.onActiveTema(3) } 
                                                                    data-button="info" data-header="bg-info header-text-light" data-sidebar="bg-info sidebar-text-dark"   >
                                                                </div>
                                                                <div onClick={ this.onSelectColorTema.bind(this, 4) } className={"swatch-holder bg-warning" + this.onActiveTema(4) } 
                                                                    data-button="warning" data-header="bg-warning header-text-dark" data-sidebar="bg-warning sidebar-text-dark"   >
                                                                </div>
                                                                <div onClick={ this.onSelectColorTema.bind(this, 5) } className={"swatch-holder bg-danger" + this.onActiveTema(5) } 
                                                                    data-button="danger" data-header="bg-danger header-text-light" data-sidebar="bg-danger sidebar-text-light"  >
                                                                </div>
                                                                <div onClick={ this.onSelectColorTema.bind(this, 6) } className={"swatch-holder bg-light" + this.onActiveTema(6) } 
                                                                    data-button="light" data-header="bg-light header-text-dark" data-sidebar="bg-light sidebar-text-dark"    >
                                                                </div>
                                                                <div onClick={ this.onSelectColorTema.bind(this, 7) } className={"swatch-holder bg-dark" + this.onActiveTema(7) } 
                                                                    data-button="dark" data-header="bg-dark header-text-light" data-sidebar="bg-dark sidebar-text-light"    >
                                                                </div>
                                                                <div onClick={ this.onSelectColorTema.bind(this, 8) } className={"swatch-holder bg-focus" + this.onActiveTema(8) } 
                                                                    data-button="focus" data-header="bg-focus header-text-light" data-sidebar="bg-focus sidebar-text-light"   >
                                                                </div>
                                                                <div onClick={ this.onSelectColorTema.bind(this, 9) } className={"swatch-holder bg-alternate" + this.onActiveTema(9) } 
                                                                    data-button="alternate" data-header="bg-alternate header-text-light" data-sidebar="bg-alternate sidebar-text-light"   >
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div id="headingOne" className="card-header">
                                            <button type="button" data-toggle="collapse" data-target="#collapseOne1" aria-expanded="false" 
                                                aria-controls="collapseOne" className="text-left m-0 p-0 btn btn-link btn-block"
                                            >
                                                <h5 className={"m-0 p-0" + ' ' + this.props.sizetext}>
                                                    HEADER COLOR
                                                </h5>
                                            </button>
                                        </div>
                                        <div data-parent="#accordion" id="collapseOne1" aria-labelledby="headingOne" className="collapse">
                                            <div className="card-body">
                                                <div className="p-3">
                                                    <ul className="list-group">
                                                        <li className="list-group-item">
                                                            <h5 className="pb-2">
                                                                SELECCIONAR COLOR
                                                                <button type="button" className="btn-pill btn-shadow btn-wide ml-auto btn btn-focus btn-sm switch-header-cs-class pull-right" 
                                                                    data-header="" onClick={ this.resetColorHeader.bind(this) }>
                                                                    Restaurar
                                                                </button>
                                                            </h5>
                                                            <div className="theme-settings-swatches">
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 0) } className={"swatch-holder bg-primary switch-header-cs-class" + this.onActiveHeader(0) } 
                                                                    data-header="bg-primary header-text-light" data-sidebar="bg-primary sidebar-text-light">
                                                                </div>
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 1) } className={"swatch-holder bg-secondary switch-header-cs-class" + this.onActiveHeader(1) } 
                                                                    data-header="bg-secondary header-text-light" data-sidebar="bg-secondary sidebar-text-light">
                                                                </div>
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 2) } className={"swatch-holder bg-success switch-header-cs-class" + this.onActiveHeader(2) } 
                                                                    data-header="bg-success header-text-light" data-sidebar="bg-success sidebar-text-dark">
                                                                </div>
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 3) } className={"swatch-holder bg-info switch-header-cs-class" + this.onActiveHeader(3) } 
                                                                    data-header="bg-info header-text-light" data-sidebar="bg-info sidebar-text-dark">
                                                                </div>
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 4) } className={"swatch-holder bg-warning switch-header-cs-class" + this.onActiveHeader(4) } 
                                                                    data-header="bg-warning header-text-dark" data-sidebar="bg-warning sidebar-text-dark">
                                                                </div>
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 5) } className={"swatch-holder bg-danger switch-header-cs-class" + this.onActiveHeader(5) } 
                                                                    data-header="bg-danger header-text-light" data-sidebar="bg-danger sidebar-text-light">
                                                                </div>
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 6) } className={"swatch-holder bg-light switch-header-cs-class" + this.onActiveHeader(6) } 
                                                                    data-header="bg-light header-text-dark" data-sidebar="bg-light sidebar-text-dark">
                                                                </div>
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 7) } className={"swatch-holder bg-dark switch-header-cs-class" + this.onActiveHeader(7) } 
                                                                    data-header="bg-dark header-text-light" data-sidebar="bg-dark sidebar-text-light">
                                                                </div>
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 8) } className={"swatch-holder bg-focus switch-header-cs-class" + this.onActiveHeader(8) } 
                                                                    data-header="bg-focus header-text-light" data-sidebar="bg-focus sidebar-text-light">
                                                                </div>
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 9) } className={"swatch-holder bg-alternate switch-header-cs-class" + this.onActiveHeader(9) } 
                                                                    data-header="bg-alternate header-text-light" data-sidebar="bg-alternate sidebar-text-light">
                                                                </div>
                                                                <div className="divider">
                                                                </div>
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 10) } className={"swatch-holder bg-vicious-stance switch-header-cs-class" + this.onActiveHeader(10) } 
                                                                    data-header="bg-vicious-stance header-text-light" data-sidebar="bg-vicious-stance sidebar-text-light">
                                                                </div>
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 11) } className={"swatch-holder bg-midnight-bloom switch-header-cs-class" + this.onActiveHeader(11) } 
                                                                    data-header="bg-midnight-bloom header-text-light" data-sidebar="bg-midnight-bloom sidebar-text-light">
                                                                </div>
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 12) } className={"swatch-holder bg-night-sky switch-header-cs-class" + this.onActiveHeader(12) } 
                                                                    data-header="bg-night-sky header-text-light" data-sidebar="bg-night-sky sidebar-text-light">
                                                                </div>
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 13) } className={"swatch-holder bg-slick-carbon switch-header-cs-class" + this.onActiveHeader(13) } 
                                                                    data-header="bg-slick-carbon header-text-light" data-sidebar="bg-slick-carbon sidebar-text-light">
                                                                </div>
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 14) } className={"swatch-holder bg-asteroid switch-header-cs-class" + this.onActiveHeader(14) } 
                                                                    data-header="bg-asteroid header-text-light" data-sidebar="bg-asteroid sidebar-text-light">
                                                                </div>
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 15) } className={"swatch-holder bg-royal switch-header-cs-class" + this.onActiveHeader(15) } 
                                                                    data-header="bg-royal header-text-light" data-sidebar="bg-royal sidebar-text-light">
                                                                </div>
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 16) } className={"swatch-holder bg-warm-flame switch-header-cs-class" + this.onActiveHeader(16) } 
                                                                    data-header="bg-warm-flame header-text-dark" data-sidebar="bg-warm-flame sidebar-text-dark">
                                                                </div>
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 17) } className={"swatch-holder bg-night-fade switch-header-cs-class" + this.onActiveHeader(17) } 
                                                                    data-header="bg-night-fade header-text-dark" data-sidebar="bg-night-fade sidebar-text-dark">
                                                                </div>
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 18) } className={"swatch-holder bg-sunny-morning switch-header-cs-class" + this.onActiveHeader(18) } 
                                                                    data-header="bg-sunny-morning header-text-dark" data-sidebar="bg-sunny-morning sidebar-text-dark">
                                                                </div>
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 19) } className={"swatch-holder bg-tempting-azure switch-header-cs-class" + this.onActiveHeader(19) } 
                                                                    data-header="bg-tempting-azure header-text-dark" data-sidebar="bg-tempting-azure sidebar-text-dark">
                                                                </div>
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 20) } className={"swatch-holder bg-amy-crisp switch-header-cs-class" + this.onActiveHeader(20) } 
                                                                    data-header="bg-amy-crisp header-text-dark" data-sidebar="bg-amy-crisp sidebar-text-dark">
                                                                </div>
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 21) } className={"swatch-holder bg-heavy-rain switch-header-cs-class" + this.onActiveHeader(21) } 
                                                                    data-header="bg-heavy-rain header-text-dark" data-sidebar="bg-heavy-rain sidebar-text-dark">
                                                                </div>
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 22) } className={"swatch-holder bg-mean-fruit switch-header-cs-class" + this.onActiveHeader(22) } 
                                                                    data-header="bg-mean-fruit header-text-dark" data-sidebar="bg-mean-fruit sidebar-text-dark">
                                                                </div>
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 23) } className={"swatch-holder bg-malibu-beach switch-header-cs-class" + this.onActiveHeader(23) } 
                                                                    data-header="bg-malibu-beach header-text-light" data-sidebar="bg-malibu-beach sidebar-text-light">
                                                                </div>
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 24) } className={"swatch-holder bg-deep-blue switch-header-cs-class" + this.onActiveHeader(24) } 
                                                                    data-header="bg-deep-blue header-text-dark" data-sidebar="bg-deep-blue sidebar-text-dark">
                                                                </div>
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 25) } className={"swatch-holder bg-ripe-malin switch-header-cs-class" + this.onActiveHeader(25) } 
                                                                    data-header="bg-ripe-malin header-text-light" data-sidebar="bg-ripe-malin sidebar-text-light">
                                                                </div>
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 26) } className={"swatch-holder bg-arielle-smile switch-header-cs-class" + this.onActiveHeader(26) } 
                                                                    data-header="bg-arielle-smile header-text-light" data-sidebar="bg-arielle-smile sidebar-text-light">
                                                                </div>
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 27) } className={"swatch-holder bg-plum-plate switch-header-cs-class" + this.onActiveHeader(27) } 
                                                                    data-header="bg-plum-plate header-text-light" data-sidebar="bg-plum-plate sidebar-text-light">
                                                                </div>
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 28) } className={"swatch-holder bg-happy-fisher switch-header-cs-class" + this.onActiveHeader(28) } 
                                                                    data-header="bg-happy-fisher header-text-dark" data-sidebar="bg-happy-fisher sidebar-text-dark">
                                                                </div>
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 29) } className={"swatch-holder bg-happy-itmeo switch-header-cs-class" + this.onActiveHeader(29) } 
                                                                    data-header="bg-happy-itmeo header-text-light" data-sidebar="bg-happy-itmeo sidebar-text-light">
                                                                </div>
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 30) } className={"swatch-holder bg-mixed-hopes switch-header-cs-class" + this.onActiveHeader(30) } 
                                                                    data-header="bg-mixed-hopes header-text-light" data-sidebar="bg-mixed-hopes sidebar-text-light">
                                                                </div>
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 31) } className={"swatch-holder bg-strong-bliss switch-header-cs-class" + this.onActiveHeader(31) } 
                                                                    data-header="bg-strong-bliss header-text-light" data-sidebar="bg-strong-bliss sidebar-text-light">
                                                                </div>
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 32) } className={"swatch-holder bg-grow-early switch-header-cs-class" + this.onActiveHeader(32) } 
                                                                    data-header="bg-grow-early header-text-light" data-sidebar="bg-grow-early sidebar-text-light">
                                                                </div>
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 33) } className={"swatch-holder bg-love-kiss switch-header-cs-class" + this.onActiveHeader(33) } 
                                                                    data-header="bg-love-kiss header-text-light" data-sidebar="bg-love-kiss sidebar-text-light">
                                                                </div>
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 34) } className={"swatch-holder bg-premium-dark switch-header-cs-class" + this.onActiveHeader(34) } 
                                                                    data-header="bg-premium-dark header-text-light" data-sidebar="bg-premium-dark sidebar-text-light">
                                                                </div>
                                                                <div onClick={ this.onSelectColorHeader.bind(this, 35) } className={"swatch-holder bg-happy-green switch-header-cs-class" + this.onActiveHeader(35) } 
                                                                    data-header="bg-happy-green header-text-light" data-sidebar="bg-happy-green sidebar-text-light">
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div id="headingTwo" className="b-radius-0 card-header">
                                            <button type="button" data-toggle="collapse" data-target="#collapseOne2" aria-expanded="false" 
                                                aria-controls="collapseTwo" className="text-left m-0 p-0 btn btn-link btn-block collapsed"
                                            >
                                                <h5 className={"m-0 p-0" + ' ' + this.props.sizetext}>
                                                    SIDEBAR COLOR
                                                </h5>
                                            </button>
                                        </div>
                                        <div data-parent="#accordion" id="collapseOne2" className="collapse">
                                            <div className="card-body">
                                                <div className="p-3">
                                                    <ul className="list-group">
                                                        <li className="list-group-item">
                                                            <h5 className="pb-2">
                                                                SELECCIONAR COLOR
                                                                <button type="button" className="btn-pill btn-shadow btn-wide ml-auto btn btn-focus btn-sm switch-sidebar-cs-class pull-right" 
                                                                    data-sidebar="" onClick={ this.resetColorSidebar.bind(this) }>
                                                                    Restaurar
                                                                </button>
                                                            </h5>
                                                            <div className="theme-settings-swatches">
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 0) } className={"swatch-holder bg-primary switch-sidebar-cs-class" + this.onActiveSidebar(0) } 
                                                                    data-sidebar="bg-primary sidebar-text-light"  >
                                                                </div>
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 1) } className={"swatch-holder bg-secondary switch-sidebar-cs-class" + this.onActiveSidebar(1) } 
                                                                    data-sidebar="bg-secondary sidebar-text-light"  >
                                                                </div>
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 2) } className={"swatch-holder bg-success switch-sidebar-cs-class" + this.onActiveSidebar(2) } 
                                                                    data-sidebar="bg-success sidebar-text-dark"  >
                                                                </div>
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 3) } className={"swatch-holder bg-info switch-sidebar-cs-class" + this.onActiveSidebar(3) } 
                                                                    data-sidebar="bg-info sidebar-text-dark"   >
                                                                </div>
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 4) } className={"swatch-holder bg-warning switch-sidebar-cs-class" + this.onActiveSidebar(4) } 
                                                                    data-sidebar="bg-warning sidebar-text-dark"   >
                                                                </div>
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 5) } className={"swatch-holder bg-danger switch-sidebar-cs-class" + this.onActiveSidebar(5) } 
                                                                    data-sidebar="bg-danger sidebar-text-light"   >
                                                                </div>
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 6) } className={"swatch-holder bg-light switch-sidebar-cs-class" + this.onActiveSidebar(6) } 
                                                                    data-sidebar="bg-light sidebar-text-dark"     >
                                                                </div>
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 7) } className={"swatch-holder bg-dark switch-sidebar-cs-class" + this.onActiveSidebar(7) } 
                                                                    data-sidebar="bg-dark sidebar-text-light"     >
                                                                </div>
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 8) } className={"swatch-holder bg-focus switch-sidebar-cs-class" + this.onActiveSidebar(8) } 
                                                                    data-sidebar="bg-focus sidebar-text-light"    >
                                                                </div>
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 9) } className={"swatch-holder bg-alternate switch-sidebar-cs-class" + this.onActiveSidebar(9) } 
                                                                    data-sidebar="bg-alternate sidebar-text-light"    >
                                                                </div>
                                                                <div className="divider">
                                                                </div>
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 10) } className={"swatch-holder bg-vicious-stance switch-sidebar-cs-class" + this.onActiveSidebar(10) } 
                                                                    data-sidebar="bg-vicious-stance sidebar-text-light"   >
                                                                </div>
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 11) } className={"swatch-holder bg-midnight-bloom switch-sidebar-cs-class" + this.onActiveSidebar(11) } 
                                                                    data-sidebar="bg-midnight-bloom sidebar-text-light"   >
                                                                </div>
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 12) } className={"swatch-holder bg-night-sky switch-sidebar-cs-class" + this.onActiveSidebar(12) } 
                                                                    data-sidebar="bg-night-sky sidebar-text-light"             >
                                                                </div>
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 13) } className={"swatch-holder bg-slick-carbon switch-sidebar-cs-class" + this.onActiveSidebar(13) } 
                                                                    data-sidebar="bg-slick-carbon sidebar-text-light"       >
                                                                </div>
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 14) } className={"swatch-holder bg-asteroid switch-sidebar-cs-class" + this.onActiveSidebar(14) } 
                                                                    data-sidebar="bg-asteroid sidebar-text-light"            >
                                                                </div>
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 15) } className={"swatch-holder bg-royal switch-sidebar-cs-class" + this.onActiveSidebar(15) } 
                                                                    data-sidebar="bg-royal sidebar-text-light"     >
                                                                </div>
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 16) } className={"swatch-holder bg-warm-flame switch-sidebar-cs-class" + this.onActiveSidebar(16) } 
                                                                    data-sidebar="bg-warm-flame sidebar-text-dark"         >
                                                                </div>
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 17) } className={"swatch-holder bg-night-fade switch-sidebar-cs-class" + this.onActiveSidebar(17) } 
                                                                    data-sidebar="bg-night-fade sidebar-text-dark"       >
                                                                </div>
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 18) } className={"swatch-holder bg-sunny-morning switch-sidebar-cs-class" + this.onActiveSidebar(18) } 
                                                                    data-sidebar="bg-sunny-morning sidebar-text-dark"   >
                                                                </div>
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 19) } className={"swatch-holder bg-tempting-azure switch-sidebar-cs-class" + this.onActiveSidebar(19) } 
                                                                    data-sidebar="bg-tempting-azure sidebar-text-dark"   >
                                                                </div>
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 20) } className={"swatch-holder bg-amy-crisp switch-sidebar-cs-class" + this.onActiveSidebar(20) } 
                                                                    data-sidebar="bg-amy-crisp sidebar-text-dark"    >
                                                                </div>
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 21) } className={"swatch-holder bg-heavy-rain switch-sidebar-cs-class" + this.onActiveSidebar(21) } 
                                                                    data-sidebar="bg-heavy-rain sidebar-text-dark"       >
                                                                </div>
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 22) } className={"swatch-holder bg-mean-fruit switch-sidebar-cs-class" + this.onActiveSidebar(22) } 
                                                                    data-sidebar="bg-mean-fruit sidebar-text-dark"    >
                                                                </div>
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 23) } className={"swatch-holder bg-malibu-beach switch-sidebar-cs-class" + this.onActiveSidebar(23) } 
                                                                    data-sidebar="bg-malibu-beach sidebar-text-light"   >
                                                                </div>
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 24) } className={"swatch-holder bg-deep-blue switch-sidebar-cs-class" + this.onActiveSidebar(24) } 
                                                                    data-sidebar="bg-deep-blue sidebar-text-dark"      >
                                                                </div>
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 25) } className={"swatch-holder bg-ripe-malin switch-sidebar-cs-class" + this.onActiveSidebar(25) } 
                                                                    data-sidebar="bg-ripe-malin sidebar-text-light"   >
                                                                </div>
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 26) } className={"swatch-holder bg-arielle-smile switch-sidebar-cs-class" + this.onActiveSidebar(26) } 
                                                                    data-sidebar="bg-arielle-smile sidebar-text-light"   >
                                                                </div>
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 27) } className={"swatch-holder bg-plum-plate switch-sidebar-cs-class" + this.onActiveSidebar(27) } 
                                                                    data-sidebar="bg-plum-plate sidebar-text-light"     >
                                                                </div>
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 28) } className={"swatch-holder bg-happy-fisher switch-sidebar-cs-class" + this.onActiveSidebar(28) } 
                                                                    data-sidebar="bg-happy-fisher sidebar-text-dark"    >
                                                                </div>
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 29) } className={"swatch-holder bg-happy-itmeo switch-sidebar-cs-class" + this.onActiveSidebar(29) } 
                                                                    data-sidebar="bg-happy-itmeo sidebar-text-light"   >
                                                                </div>
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 30) } className={"swatch-holder bg-mixed-hopes switch-sidebar-cs-class" + this.onActiveSidebar(30) } 
                                                                    data-sidebar="bg-mixed-hopes sidebar-text-light"    >
                                                                </div>
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 31) } className={"swatch-holder bg-strong-bliss switch-sidebar-cs-class" + this.onActiveSidebar(31) } 
                                                                    data-sidebar="bg-strong-bliss sidebar-text-light"   >
                                                                </div>
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 32) } className={"swatch-holder bg-grow-early switch-sidebar-cs-class" + this.onActiveSidebar(32) } 
                                                                    data-sidebar="bg-grow-early sidebar-text-light"   >
                                                                </div>
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 33) } className={"swatch-holder bg-love-kiss switch-sidebar-cs-class" + this.onActiveSidebar(33) } 
                                                                    data-sidebar="bg-love-kiss sidebar-text-light"  >
                                                                </div>
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 34) } className={"swatch-holder bg-premium-dark switch-sidebar-cs-class" + this.onActiveSidebar(34) } 
                                                                    data-sidebar="bg-premium-dark sidebar-text-light"   >
                                                                </div>
                                                                <div onClick={ this.onSelectColorSidebar.bind(this, 35) } className={"swatch-holder bg-happy-green switch-sidebar-cs-class" + this.onActiveSidebar(35) } 
                                                                    data-sidebar="bg-happy-green sidebar-text-light">
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div id="headingTwo" className="b-radius-0 card-header">
                                            <button type="button" data-toggle="collapse" data-target="#collapseOne3" aria-expanded="false" 
                                                aria-controls="collapseTwo" className="text-left m-0 p-0 btn btn-link btn-block collapsed"
                                            >
                                                <h5 className={"m-0 p-0" + ' ' + this.props.sizetext}>
                                                    FOOTER COLOR
                                                </h5>
                                            </button>
                                        </div>
                                        <div data-parent="#accordion" id="collapseOne3" className="collapse">
                                            <div className="card-body">
                                                <div className="p-3">
                                                    <ul className="list-group">
                                                        <li className="list-group-item">
                                                            <h5 className="pb-2">
                                                                SELECCIONAR COLOR
                                                                <button type="button" className="btn-pill btn-shadow btn-wide ml-auto btn btn-focus btn-sm pull-right" 
                                                                    data-footer="" onClick={ this.resetColorFooter.bind(this) }>
                                                                    Restaurar
                                                                </button>
                                                            </h5>
                                                            <div className="theme-settings-swatches">
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 0) } className={"swatch-holder bg-primary" + this.onActiveFooter(0) } 
                                                                    data-footer="bg-primary sidebar-text-light"  >
                                                                </div>
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 1) } className={"swatch-holder bg-secondary" + this.onActiveFooter(1) } 
                                                                    data-footer="bg-secondary sidebar-text-light"  >
                                                                </div>
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 2) } className={"swatch-holder bg-success" + this.onActiveFooter(2) } 
                                                                    data-footer="bg-success sidebar-text-dark"  >
                                                                </div>
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 3) } className={"swatch-holder bg-info" + this.onActiveFooter(3) } 
                                                                    data-footer="bg-info sidebar-text-dark"   >
                                                                </div>
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 4) } className={"swatch-holder bg-warning" + this.onActiveFooter(4) } 
                                                                    data-footer="bg-warning sidebar-text-dark"   >
                                                                </div>
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 5) } className={"swatch-holder bg-danger" + this.onActiveFooter(5) } 
                                                                    data-footer="bg-danger sidebar-text-light"   >
                                                                </div>
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 6) } className={"swatch-holder bg-light" + this.onActiveFooter(6) } 
                                                                    data-footer="bg-light sidebar-text-dark"     >
                                                                </div>
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 7) } className={"swatch-holder bg-dark" + this.onActiveFooter(7) } 
                                                                    data-footer="bg-dark sidebar-text-light"     >
                                                                </div>
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 8) } className={"swatch-holder bg-focus" + this.onActiveFooter(8) } 
                                                                    data-footer="bg-focus sidebar-text-light"    >
                                                                </div>
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 9) } className={"swatch-holder bg-alternate" + this.onActiveFooter(9) } 
                                                                    data-footer="bg-alternate sidebar-text-light"    >
                                                                </div>
                                                                <div className="divider">
                                                                </div>
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 10) } className={"swatch-holder bg-vicious-stance" + this.onActiveFooter(10) } 
                                                                    data-footer="bg-vicious-stance sidebar-text-light"   >
                                                                </div>
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 11) } className={"swatch-holder bg-midnight-bloom" + this.onActiveFooter(11) } 
                                                                    data-footer="bg-midnight-bloom sidebar-text-light"   >
                                                                </div>
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 12) } className={"swatch-holder bg-night-sky" + this.onActiveFooter(12) } 
                                                                    data-footer="bg-night-sky sidebar-text-light"             >
                                                                </div>
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 13) } className={"swatch-holder bg-slick-carbon" + this.onActiveFooter(13) } 
                                                                    data-footer="bg-slick-carbon sidebar-text-light"       >
                                                                </div>
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 14) } className={"swatch-holder bg-asteroid" + this.onActiveFooter(14) } 
                                                                    data-footer="bg-asteroid sidebar-text-light"            >
                                                                </div>
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 15) } className={"swatch-holder bg-royal" + this.onActiveFooter(15) } 
                                                                    data-footer="bg-royal sidebar-text-light"     >
                                                                </div>
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 16) } className={"swatch-holder bg-warm-flame" + this.onActiveFooter(16) } 
                                                                    data-footer="bg-warm-flame sidebar-text-dark"         >
                                                                </div>
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 17) } className={"swatch-holder bg-night-fade" + this.onActiveFooter(17) } 
                                                                    data-footer="bg-night-fade sidebar-text-dark"       >
                                                                </div>
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 18) } className={"swatch-holder bg-sunny-morning" + this.onActiveFooter(18) } 
                                                                    data-footer="bg-sunny-morning sidebar-text-dark"   >
                                                                </div>
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 19) } className={"swatch-holder bg-tempting-azure" + this.onActiveFooter(19) } 
                                                                    data-footer="bg-tempting-azure sidebar-text-dark"   >
                                                                </div>
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 20) } className={"swatch-holder bg-amy-crisp" + this.onActiveFooter(20) } 
                                                                    data-footer="bg-amy-crisp sidebar-text-dark"    >
                                                                </div>
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 21) } className={"swatch-holder bg-heavy-rain" + this.onActiveFooter(21) } 
                                                                    data-footer="bg-heavy-rain sidebar-text-dark"       >
                                                                </div>
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 22) } className={"swatch-holder bg-mean-fruit" + this.onActiveFooter(22) } 
                                                                    data-footer="bg-mean-fruit sidebar-text-dark"    >
                                                                </div>
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 23) } className={"swatch-holder bg-malibu-beach" + this.onActiveFooter(23) } 
                                                                    data-footer="bg-malibu-beach sidebar-text-light"   >
                                                                </div>
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 24) } className={"swatch-holder bg-deep-blue" + this.onActiveFooter(24) } 
                                                                    data-footer="bg-deep-blue sidebar-text-dark"      >
                                                                </div>
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 25) } className={"swatch-holder bg-ripe-malin" + this.onActiveFooter(25) } 
                                                                    data-footer="bg-ripe-malin sidebar-text-light"   >
                                                                </div>
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 26) } className={"swatch-holder bg-arielle-smile" + this.onActiveFooter(26) } 
                                                                    data-footer="bg-arielle-smile sidebar-text-light"   >
                                                                </div>
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 27) } className={"swatch-holder bg-plum-plate" + this.onActiveFooter(27) } 
                                                                    data-footer="bg-plum-plate sidebar-text-light"     >
                                                                </div>
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 28) } className={"swatch-holder bg-happy-fisher" + this.onActiveFooter(28) } 
                                                                    data-footer="bg-happy-fisher sidebar-text-dark"    >
                                                                </div>
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 29) } className={"swatch-holder bg-happy-itmeo" + this.onActiveFooter(29) } 
                                                                    data-footer="bg-happy-itmeo sidebar-text-light"   >
                                                                </div>
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 30) } className={"swatch-holder bg-mixed-hopes" + this.onActiveFooter(30) } 
                                                                    data-footer="bg-mixed-hopes sidebar-text-light"    >
                                                                </div>
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 31) } className={"swatch-holder bg-strong-bliss" + this.onActiveFooter(31) } 
                                                                    data-footer="bg-strong-bliss sidebar-text-light"   >
                                                                </div>
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 32) } className={"swatch-holder bg-grow-early" + this.onActiveFooter(32) } 
                                                                    data-footer="bg-grow-early sidebar-text-light"   >
                                                                </div>
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 33) } className={"swatch-holder bg-love-kiss" + this.onActiveFooter(33) } 
                                                                    data-footer="bg-love-kiss sidebar-text-light"  >
                                                                </div>
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 34) } className={"swatch-holder bg-premium-dark" + this.onActiveFooter(34) } 
                                                                    data-footer="bg-premium-dark sidebar-text-light"   >
                                                                </div>
                                                                <div onClick={ this.onSelectColorFooter.bind(this, 35) } className={"swatch-holder bg-happy-green" + this.onActiveFooter(35) } 
                                                                    data-footer="bg-happy-green sidebar-text-light">
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div id="headingThree" className="card-header">
                                            <button type="button" data-toggle="collapse" data-target="#collapseOne4" aria-expanded="false" 
                                                aria-controls="collapseThree" className="text-left m-0 p-0 btn btn-link btn-block collapsed"
                                            >
                                                <h5 className={"m-0 p-0" + ' ' + this.props.sizetext}>
                                                    BUTTON COLOR
                                                </h5>
                                            </button>
                                        </div>
                                        <div data-parent="#accordion" id="collapseOne4" className="collapse">
                                            <div className="card-body">
                                                <div className="p-3">
                                                    <ul className="list-group">
                                                        <li className="list-group-item">
                                                            <h5 className="pb-2">
                                                                SELECCIONAR COLOR
                                                                <button type="button" className="btn-pill btn-shadow btn-wide ml-auto btn btn-focus btn-sm pull-right" 
                                                                    data-button="" onClick={ this.resetColorButton.bind(this) }>
                                                                    Restaurar
                                                                </button>
                                                            </h5>
                                                            <div className="theme-settings-swatches">
                                                                <div onClick={ this.onSelectColorButton.bind(this, 0) } className={"swatch-holder bg-primary" + this.onActiveButton(0) } 
                                                                    data-button="primary"  >
                                                                </div>
                                                                <div onClick={ this.onSelectColorButton.bind(this, 1) } className={"swatch-holder bg-secondary" + this.onActiveButton(1) } 
                                                                    data-button="secondary"  >
                                                                </div>
                                                                <div onClick={ this.onSelectColorButton.bind(this, 2) } className={"swatch-holder bg-success" + this.onActiveButton(2) } 
                                                                    data-button="success"  >
                                                                </div>
                                                                <div onClick={ this.onSelectColorButton.bind(this, 3) } className={"swatch-holder bg-info" + this.onActiveButton(3) } 
                                                                    data-button="info"   >
                                                                </div>
                                                                <div onClick={ this.onSelectColorButton.bind(this, 4) } className={"swatch-holder bg-warning" + this.onActiveButton(4) } 
                                                                    data-button="warning"   >
                                                                </div>
                                                                <div onClick={ this.onSelectColorButton.bind(this, 5) } className={"swatch-holder bg-danger" + this.onActiveButton(5) } 
                                                                    data-button="danger"   >
                                                                </div>
                                                                <div onClick={ this.onSelectColorButton.bind(this, 6) } className={"swatch-holder bg-light" + this.onActiveButton(6) } 
                                                                    data-button="light"     >
                                                                </div>
                                                                <div onClick={ this.onSelectColorButton.bind(this, 7) } className={"swatch-holder bg-dark" + this.onActiveButton(7) } 
                                                                    data-button="dark"     >
                                                                </div>
                                                                <div onClick={ this.onSelectColorButton.bind(this, 8) } className={"swatch-holder bg-focus" + this.onActiveButton(8) } 
                                                                    data-button="focus"    >
                                                                </div>
                                                                <div onClick={ this.onSelectColorButton.bind(this, 9) } className={"swatch-holder bg-alternate" + this.onActiveButton(9) } 
                                                                    data-button="alternate"    >
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div id="headingThree" className="card-header">
                                            <button type="button" data-toggle="collapse" data-target="#collapseOne5" aria-expanded="false" 
                                                aria-controls="collapseThree" className="text-left m-0 p-0 btn btn-link btn-block collapsed"
                                            >
                                                <h5 className={"m-0 p-0" + ' ' + this.props.sizetext}>
                                                    TAMAÑO DE LETRA
                                                </h5>
                                            </button>
                                        </div>
                                        <div data-parent="#accordion" id="collapseOne5" className="collapse">
                                            <div className="card-body">
                                                <div className="p-3">
                                                    <ul className="list-group">
                                                        <li className="list-group-item">
                                                            <h5 className="pb-2">
                                                                SELECCIONAR TAMAÑO
                                                                <button type="button" className="btn-pill btn-shadow btn-wide ml-auto btn btn-focus btn-sm pull-right" 
                                                                    onClick={ this.resetSizeLetra.bind(this) }>
                                                                    Restaurar
                                                                </button>
                                                            </h5>
                                                            <div className="theme-settings-swatches">
                                                                {/* <div className="position-relative form-check">
                                                                    <label className="form-check-label">
                                                                        <input type="radio" className="form-check-input" 
                                                                            checked={this.state.selectedSize[3]}
                                                                            onChange={ () => {
                                                                                this.state.selectedSize[0] = false;
                                                                                this.state.selectedSize[1] = false;
                                                                                this.state.selectedSize[2] = false;
                                                                                this.state.selectedSize[3] = true;
                                                                                var sizetext = 'fsize-3';
                                                                                this.setState({
                                                                                    selectedSize: this.state.selectedSize,
                                                                                    sizetext: sizetext,
                                                                                });
                                                                                this.props.onSelectSizeLetra(sizetext);
                                                                            } }
                                                                        /> 
                                                                        EXTRA GRANDE
                                                                    </label>
                                                                </div> */}
                                                                <div className="position-relative form-check">
                                                                    <label className="form-check-label">
                                                                        <input type="radio" className="form-check-input" 
                                                                            checked={this.state.selectedSize[0]}
                                                                            onChange={ () => {
                                                                                this.state.selectedSize[0] = true;
                                                                                this.state.selectedSize[1] = false;
                                                                                this.state.selectedSize[2] = false;
                                                                                this.state.selectedSize[3] = false;
                                                                                var sizetext = 'font-size-xlg';
                                                                                this.setState({
                                                                                    selectedSize: this.state.selectedSize,
                                                                                    sizetext: sizetext,
                                                                                });
                                                                                this.props.onSelectSizeLetra(sizetext);
                                                                            } }
                                                                        /> 
                                                                        GRANDE
                                                                    </label>
                                                                </div>
                                                                <div className="position-relative form-check">
                                                                    <label className="form-check-label">
                                                                        <input type="radio" className="form-check-input" 
                                                                            checked={this.state.selectedSize[1]}
                                                                            onChange={ () => {
                                                                                this.state.selectedSize[1] = true;
                                                                                this.state.selectedSize[0] = false;
                                                                                this.state.selectedSize[2] = false;
                                                                                this.state.selectedSize[3] = false;
                                                                                var sizetext = 'font-size-lg';
                                                                                this.setState({
                                                                                    selectedSize: this.state.selectedSize,
                                                                                    sizetext: sizetext,
                                                                                });
                                                                                this.props.onSelectSizeLetra(sizetext);
                                                                            } }
                                                                        /> 
                                                                        MEDIANO
                                                                    </label>
                                                                </div>
                                                                <div className="position-relative form-check">
                                                                    <label className="form-check-label">
                                                                        <input type="radio" className="form-check-input" 
                                                                            checked={this.state.selectedSize[2]}
                                                                            onChange={ () => {
                                                                                this.state.selectedSize[2] = true;
                                                                                this.state.selectedSize[1] = false;
                                                                                this.state.selectedSize[0] = false;
                                                                                this.state.selectedSize[3] = false;
                                                                                var sizetext = 'font-size-md';
                                                                                this.setState({
                                                                                    selectedSize: this.state.selectedSize,
                                                                                    sizetext: sizetext,
                                                                                });
                                                                                this.props.onSelectSizeLetra(sizetext);
                                                                            } }
                                                                        /> 
                                                                        PEQUEÑO
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='forms-groups txts-center mt-4'>
                                <button className={"mb-2 mr-2 btn-hover-shine btn btn-" + color}
                                    onClick={this.onValidar.bind(this)}
                                >
                                    Aceptar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

Ajuste.propTypes = {
    buttoncolor: PropTypes.string,
    sizetext: PropTypes.string,
}

Ajuste.defaultProps = {
    buttoncolor: '',
    sizetext: '',
}


