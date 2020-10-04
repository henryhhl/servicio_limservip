<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Informacion;
use App\Solicitud;
use App\SolicitudDetalle;
use Carbon\Carbon;

class SolicitudMovilController extends Controller
{
    public function miSolicitud(Request $request){
        $idcliente = $request->cliente;

        $solicitudes =  DB::table('solicitud as sol')
                ->leftJoin('users as user', 'sol.idusuario', '=', 'user.id')
                ->join('informacion as info', 'info.idsolicitud', '=', 'sol.id')
                ->select('sol.id', 'sol.montototal', 'sol.estadoproceso', 'sol.fecha', 'sol.hora', 
                    'user.nombre', 'user.apellido', 'info.direccion', 'info.latitud' , 'info.longitud', 'info.pais', 'info.ciudad', 'info.zona'
                )
                ->where('sol.idusuario', '=', $idcliente)
                ->where('sol.estado', '=', 'A')
                ->orderBy('sol.id', 'desc')
                ->get();

        if(count($solicitudes) == 0){
            $solicitudes = [];
        }

        return response()->json([
            'data'   => $solicitudes
        ]);

    }

    public function detalleSolicitud(Request $request){
        $idsol = $request->solicitud;

        $detalles =  DB::table('solicituddetalle as soldet')
                ->join('servicio as ser', 'soldet.idservicio', '=', 'ser.id')
                ->select('soldet.id as iddet', 'soldet.cantidad', 'soldet.precio', 'ser.nombre as nombreservicio', 
                    'soldet.nota', 'ser.imagen'
                )
                ->where('soldet.idsolicitud', '=', $idsol)
                ->where('soldet.estado', '=', 'A')
                ->orderBy('soldet.id', 'asc')
                ->get();
        
        if(count($detalles) == 0){
            $detalles = [];
        }

        return response()->json([
            'data'   => $detalles
        ]);
    }

    public function personalAsignado(){

    }

    public function store(Request $request){
        
        try {

            DB::beginTransaction();

            $nombre = $request->input('nombre');
            $apellido = $request->input('apellido');
            $email = $request->input('email');
            $telefono = $request->input('telefono');
            $direccion = $request->input('direccion');
            $ciudad = $request->input('ciudad');
            $zona = $request->input('zona');
            $pais = $request->input('pais');
            $cliente = $request->input('cliente');
            
            $direccioncompleto = $request->input('direccioncompleto');
            $montototal = $request->input('montototal');

            $latitud = $request->input('latitud');
            $longitud = $request->input('longitud');

            $array_servicio = $request->input('array_servicio', '[]');

            $servicio = new Solicitud();
            $servicio->idusuario = $cliente;
            $servicio->montototal = $montototal;
            $mytime = Carbon::now('America/La_paz');
            $servicio->estadoproceso = 'P';
            $servicio->fecha = $mytime->toDateString();
            $servicio->hora = $mytime->toTimeString();
            $servicio->save();

            $informacion = new Informacion();
            $informacion->idsolicitud = $servicio->id;
            $informacion->nombre = $nombre;
            $informacion->apellido = $apellido;
            $informacion->pais = $pais;
            $informacion->ciudad = $ciudad;
            $informacion->direccion = $direccion;
            $informacion->telefono = $telefono;
            $informacion->email = $email;
            $informacion->zona = $zona;

            $informacion->direccioncompleto = $direccioncompleto;

            $informacion->latitud = $latitud;
            $informacion->longitud = $longitud;

            $informacion->save();

            foreach ($array_servicio as $data) {
                $detalle = new SolicitudDetalle();
                $detalle->idsolicitud = $servicio->id;
                $detalle->idservicio = $data->id;
                $detalle->cantidad = $data->cantidad;
                $detalle->precio = $data->precio;
                $detalle->estadoproceso = 'P';
                $detalle->descuento = 0;
                $detalle->save();
            }

            DB::commit();
            /*$ultimoU=DB::table('solicitud')
            ->select('id', 'idcliente', 'montototal', 'estadoproceso', 'fecha', 'hora', 'estado' )
            ->orderBy('id','desc')->first();*/

            return response()->json([
                'data' => 'Insertado Correctamente',
            ]);

        }catch(\Exception $th) {
            DB::rollBack();
            return response()->json([
                'data' => [],
            ]);
        }
    }
}
