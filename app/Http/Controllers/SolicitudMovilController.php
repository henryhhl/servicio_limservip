<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
                    'soldet.nota'
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
}
