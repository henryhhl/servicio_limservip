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
Route::get('usuario/registrar', 'UsuarioMovilController@registrar');
Route::get('servicio/listar', 'ServicioMovilController@listar');
Route::get('solicitud/listar', 'SolicitudMovilController@misolicitud');
Route::get('solicitud/detalle', 'SolicitudMovilController@detalleSolicitud');
