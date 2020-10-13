<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;


// $servidor = '/servidor/api';     //servidor
$servidor = '';               //local

$local = '/limservip';  // local
// $local = '';                     // servidor



Route::get('/', function () {
   // return redirect('/login');
   return view('welcome2');
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');

Route::post( $servidor . '/logout', 'HomeController@logout');
Route::get( $servidor . '/home/get_information', 'HomeController@get_information');
Route::get( $servidor . '/usuario/inicio', 'UsuarioController@inicio');

Route::get( $servidor . '/usuario/get_information', 'UsuarioController@get_information');

Route::get( $servidor . '/usuario/get_notificacion/{usuario}', 'UsuarioController@get_notificacion');
Route::get( $servidor . '/usuario/update_notificacion/{id}', 'UsuarioController@update_notificacion');

Route::get( $servidor . '/home/sesion', 'HomeController@sesion');



Route::get( $servidor . '/estadistica/get_year', 'EstadisticaController@get_year');
Route::get( $servidor . '/estadistica/get_mes', 'EstadisticaController@get_mes');



Route::get( $local . '/notificacion', 'HomeController@index');



Route::get( $servidor . '/notificacion/index', 'NotificacionController@index');



Route::get( $servidor . '/seguimiento/iniciar_seguimiento', 'SeguimientoController@iniciar_seguimiento');



Route::get( $local . '/usuario', 'HomeController@index');
Route::get( $local . '/usuario/create', 'HomeController@index');
Route::get( $local . '/usuario/edit/{id}', 'HomeController@index');
Route::get( $local . '/usuario/show/{id}', 'HomeController@index');

Route::get( $servidor . '/usuario/index', 'UsuarioController@index');
Route::get( $servidor . '/usuario/create', 'UsuarioController@create');
Route::post( $servidor . '/usuario/store', 'UsuarioController@store');
Route::get( $servidor . '/usuario/edit/{id}', 'UsuarioController@edit');
Route::post( $servidor . '/usuario/update', 'UsuarioController@update');
Route::post( $servidor . '/usuario/delete', 'UsuarioController@destroy');


Route::get( $local . '/rol', 'HomeController@index');
Route::get( $local . '/rol/create', 'HomeController@index');
Route::get( $local . '/rol/edit/{id}', 'HomeController@index');

Route::get( $servidor . '/rol/index', 'RolController@index');
Route::get( $servidor . '/rol/create', 'RolController@create');
Route::post($servidor . '/rol/store', 'RolController@store');
Route::get( $servidor . '/rol/edit/{id}', 'RolController@edit');
Route::post( $servidor . '/rol/update', 'RolController@update');
Route::post($servidor . '/rol/delete', 'RolController@destroy');

Route::get( $local . '/asignar_permiso', 'HomeController@index');

Route::get( $servidor . '/permiso/create', 'PermisoController@create');
Route::get( $servidor . '/permiso/select_rol', 'PermisoController@select_rol');
Route::post( $servidor . '/permiso/asignar', 'PermisoController@asignar');


Route::get( $local . '/cliente', 'HomeController@index');
Route::get( $local . '/cliente/create', 'HomeController@index');
Route::get( $local . '/cliente/editar/{id}', 'HomeController@index');
Route::get( $local . '/cliente/show/{id}', 'HomeController@index');

Route::get( $servidor . '/cliente/index', 'ClienteController@index');
Route::get( $servidor . '/cliente/create', 'ClienteController@create');
Route::post( $servidor . '/cliente/store', 'ClienteController@store');
Route::get( $servidor . '/cliente/edit/{id}', 'ClienteController@edit');
Route::get( $servidor . '/cliente/show/{id}', 'ClienteController@show');
Route::post( $servidor . '/cliente/update', 'ClienteController@update');
Route::post( $servidor . '/cliente/delete', 'ClienteController@destroy');



Route::get( $local . '/categoria', 'HomeController@index');
Route::get( $local . '/categoria/create', 'HomeController@index');
Route::get( $local . '/categoria/editar/{id}', 'HomeController@index');
Route::get( $local . '/categoria/show/{id}', 'HomeController@index');

Route::get( $servidor . '/categoria/index', 'CategoriaController@index');
Route::get( $servidor . '/categoria/create', 'CategoriaController@create');
Route::post( $servidor . '/categoria/store', 'CategoriaController@store');
Route::get( $servidor . '/categoria/edit/{id}', 'CategoriaController@edit');
Route::get( $servidor . '/categoria/show/{id}', 'CategoriaController@show');
Route::post( $servidor . '/categoria/update', 'CategoriaController@update');
Route::post( $servidor . '/categoria/delete', 'CategoriaController@destroy');


Route::get( $local . '/servicio', 'HomeController@index');
Route::get( $local . '/servicio/create', 'HomeController@index');
Route::get( $local . '/servicio/editar/{id}', 'HomeController@index');
Route::get( $local . '/servicio/show/{id}', 'HomeController@index');

Route::get( $servidor . '/servicio/index', 'ServicioController@index');
Route::get( $servidor . '/servicio/create', 'ServicioController@create');
Route::post( $servidor . '/servicio/store', 'ServicioController@store');
Route::get( $servidor . '/servicio/edit/{id}', 'ServicioController@edit');
Route::get( $servidor . '/servicio/show/{id}', 'ServicioController@show');
Route::post( $servidor . '/servicio/update', 'ServicioController@update');
Route::post( $servidor . '/servicio/delete', 'ServicioController@destroy');

Route::get( $servidor . '/servicio/search_servicio', 'ServicioController@search_servicio');


Route::get( $local . '/solicitud_pedido', 'HomeController@index');
Route::get( $local . '/solicitud_pedido/create', 'HomeController@index');
Route::get( $local . '/solicitud_pedido/editar/{id}', 'HomeController@index');
Route::get( $local . '/solicitud_pedido/show/{id}', 'HomeController@index');

Route::get( $servidor . '/solicitud/index', 'SolicitudController@index');
Route::get( $servidor . '/solicitud/create', 'SolicitudController@create');
Route::post( $servidor . '/solicitud/store', 'SolicitudController@store');
Route::get( $servidor . '/solicitud/edit/{id}', 'SolicitudController@edit');
Route::get( $servidor . '/solicitud/show/{id}', 'SolicitudController@show');
Route::post( $servidor . '/solicitud/update', 'SolicitudController@update');
Route::post( $servidor . '/solicitud/delete', 'SolicitudController@destroy');

Route::post( $servidor . '/solicitud/update_estado', 'SolicitudController@update_estado');

Route::get( $servidor . '/solicitud/get_solicitudpendiente', 'SolicitudController@get_solicitudpendiente');

Route::get( $local . '/mysolicitud_pedido', 'HomeController@index');
Route::get( $local . '/mysolicitud_pedido/create', 'HomeController@index');
Route::get( $local . '/mysolicitud_pedido/show/{id}', 'HomeController@index');

Route::get( $servidor . '/mysolicitud_pedido/index', 'MySolicitudPedidoController@index');
Route::get( $servidor . '/mysolicitud_pedido/create', 'MySolicitudPedidoController@create');
Route::post( $servidor . '/mysolicitud_pedido/store', 'MySolicitudPedidoController@store');
Route::get( $servidor . '/mysolicitud_pedido/show/{id}', 'MySolicitudPedidoController@show');


Route::get( $local . '/mysolicitud_asignado', 'HomeController@index');
Route::get( $local . '/mysolicitud_asignado/show/{id}', 'HomeController@index');


Route::get( $servidor . '/mysolicitud_asignado/index', 'MySolicitudAsignadoController@index');
Route::get( $servidor . '/mysolicitud_asignado/show/{id}', 'MySolicitudAsignadoController@show');


Route::get( $local . '/personal', 'HomeController@index');
Route::get( $local . '/personal/create', 'HomeController@index');
Route::get( $local . '/personal/editar/{id}', 'HomeController@index');
Route::get( $local . '/personal/show/{id}', 'HomeController@index');

Route::get( $servidor . '/personal/index', 'PersonalController@index');
Route::get( $servidor . '/personal/create', 'PersonalController@create');
Route::post( $servidor . '/personal/store', 'PersonalController@store');
Route::get( $servidor . '/personal/edit/{id}', 'PersonalController@edit');
Route::get( $servidor . '/personal/show/{id}', 'PersonalController@show');
Route::post( $servidor . '/personal/update', 'PersonalController@update');
Route::post( $servidor . '/personal/delete', 'PersonalController@destroy');


Route::get( $local . '/asignar_trabajo', 'HomeController@index');

Route::get( $servidor . '/asignar_trabajo/index', 'AsignarTrabajoController@index');
Route::get( $servidor . '/asignar_trabajo/get_personal', 'AsignarTrabajoController@get_personal');
Route::post( $servidor . '/asignar_trabajo/asignar', 'AsignarTrabajoController@asignar');


Route::get( $local . '/visualizar_seguimiento', 'HomeController@index');

Route::get( $servidor . '/visualizar_seguimiento/create', 'SeguimientoController@create');



Route::get( $local . '/generar_reporte', 'HomeController@index');

Route::get( $servidor . '/generar_reporte/create', 'ReporteController@create');
Route::post( $servidor . '/generar_reporte/generar', 'ReporteController@generar');




Route::get( $local . '/promocion', 'HomeController@index');
Route::get( $local . '/promocion/create', 'HomeController@index');
Route::get( $local . '/promocion/editar/{id}', 'HomeController@index');

Route::get( $servidor . '/promocion/index', 'PromocionController@index');
Route::get( $servidor . '/promocion/create', 'PromocionController@create');
Route::post( $servidor . '/promocion/store', 'PromocionController@store');
Route::get( $servidor . '/promocion/edit/{id}', 'PromocionController@edit');
Route::post( $servidor . '/promocion/update', 'PromocionController@update');
Route::post( $servidor . '/promocion/delete', 'PromocionController@destroy');


Route::get( $local . '/ajuste', 'HomeController@index');
Route::get( $servidor . '/ajuste/get_data', 'AjusteController@index');
Route::post( $servidor . '/ajuste/store', 'AjusteController@store');


Route::get( $local . '/perfil', 'HomeController@index');
Route::get( $servidor . '/perfil', 'UsuarioController@perfil');
Route::post( $servidor . '/update_perfil', 'UsuarioController@update_perfil');


Route::get( $local . '/reporte_general', 'HomeController@index');

Route::post( $servidor . '/venta/reporte', 'VentaController@reporte');
Route::post( $servidor . '/ajuste/search_general', 'AjusteController@search_general');

