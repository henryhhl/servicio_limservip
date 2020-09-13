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

$local = '/taller_mecanico';  // local
// $local = '';                     // servidor



Route::get('/', function () {
    return redirect('/login');
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');

Route::post( $servidor . '/logout', 'HomeController@logout');
Route::get( $servidor . '/home/get_information', 'HomeController@get_information');
Route::get( $servidor . '/usuario/inicio', 'UsuarioController@inicio');

Route::get( $servidor . '/usuario/get_information', 'UsuarioController@get_information');

Route::get( $servidor . '/home/sesion', 'HomeController@sesion');


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
Route::post( $servidor . '/cliente/update', 'ClienteController@update');
Route::post( $servidor . '/cliente/delete', 'ClienteController@destroy');



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

