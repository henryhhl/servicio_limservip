<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
Route::get('loguear', 'UsuarioMovilController@loguear');
Route::post('usuario/registrar', 'UsuarioMovilController@registrar');

Route::get('servicio/listar', 'ServicioMovilController@listar');

Route::get('solicitud/listar', 'SolicitudMovilController@misolicitud');
Route::get('solicitud/detalle', 'SolicitudMovilController@detalleSolicitud');
Route::get('solicitud/personal', 'SolicitudMovilController@personalAsignado');
Route::post('solicitud/registrar', 'SolicitudMovilController@store');
Route::get('solicitud/notificacion', 'SolicitudMovilController@get_notificacionMovil');
Route::get('solicitud/versolicitud', 'SolicitudMovilController@verSolicitud');

Route::get('solicitud/actualizarNoti', 'SolicitudMovilController@update_notificacion');
Route::get('solicitud/cancelar', 'SolicitudMovilController@Cancelar');

Route::get('personal/loguear', 'PersonalMovilController@loguear');
Route::get('personal/solicitud', 'PersonalMovilController@solicitudAsignada');
<<<<<<< HEAD
Route::get('personal/finalizar', 'PersonalMovilController@Finalizar');
=======

Route::get('seguimiento/iniciar_seguimiento', 'SeguimientoController@iniciar_seguimiento');
>>>>>>> 1eac75d3b2c60a09a1a49be6f3f6ec47b62dc0fb
