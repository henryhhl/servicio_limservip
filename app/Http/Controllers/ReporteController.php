<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ReporteController extends Controller
{
    

    public function create()
    {
        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }

            return response()->json([
                'response'  => 1,
            ]);

        }catch(\Exception $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Error al procesar la solicitud',
                'error' => [
                    'file'    => $th->getFile(),
                    'line'    => $th->getLine(),
                    'message' => $th->getMessage()
                ]
            ]);
        }
    }

    public function generar(Request $request)
    {
        try {

            $fechainicio = $request->input('fechainicio');
            $fechafinal = $request->input('fechafinal');
            $montoinicio = $request->input('montoinicio');
            $opcion = $request->input('opcion');
            $montofinal = $request->input('montofinal');
            $cliente = $request->input('cliente');
            $nrosolicitud = $request->input('nrosolicitud');
            $tiposolicitud = $request->input('tiposolicitud');

            $consulta = [];

            if (!is_null($fechainicio)) {
                if (is_null($fechafinal)) {
                    array_push($consulta, [ 'sol.fecha', '>=', $fechainicio ]);
                }else {
                    array_push($consulta, [ 'sol.fecha', '>=', $fechainicio ]);
                    array_push($consulta, [ 'sol.fecha', '<=', $fechafinal ]);
                }
            }

            if ($opcion != '!') {
                if (!is_null($montoinicio)) {
                    array_push($consulta, [ 'sol.montototal', $opcion, $montoinicio ]);
                }
            }else {
                if (!is_null($montoinicio) && is_null($montofinal)) {
                    array_push($consulta, [ 'sol.montototal', '<=', $montoinicio ]);
                }else {
                    if (!is_null($montoinicio) && !is_null($montofinal)) {
                        array_push($consulta, [ 'sol.montototal', '>=', $montoinicio ]);
                        array_push($consulta, [ 'sol.montototal', '<=', $montofinal ]);
                    }
                }
            }

            if (!is_null($nrosolicitud)) {
                array_push($consulta, ['sol.id', '=', $nrosolicitud]);
            }

            if (!is_null($cliente)) {
                array_push($consulta, [ DB::raw("CONCAT(user.nombre, ' ',user.apellido)") , 'LIKE', '%'.$cliente.'%' ]);
            }

            array_push($consulta, ['sol.estado', '=', 'A']);

            $data = DB::table('solicitud as sol')
                ->leftJoin('users as user', 'sol.idusuario', '=', 'user.id')
                ->leftJoin('informacion as info', 'sol.id', '=', 'info.idsolicitud')
                ->select( 'sol.id', 'sol.montototal', 'sol.estadoproceso', 'sol.fecha', 'sol.hora', 'sol.nota',
                    'user.nombre as usuario', 'user.apellido as apellidouser',
                    'info.nombre', 'info.apellido', 'info.pais', 'info.ciudad', 'info.direccion', 'info.direccioncompleto',
                    'info.telefono', 'info.email'
                )
                ->where( $consulta )
                ->whereNull('sol.deleted_at')
                ->orderBy('sol.id', 'desc')
                ->get();

            foreach ($data as $obj) {

                if ($tiposolicitud == '1') {
                    $obj->servicios = DB::table('solicituddetalle as det')
                        ->leftJoin('servicio as serv', 'det.idservicio', '=', 'serv.id')
                        ->leftJoin('categoria as cat', 'serv.idcategoria', '=', 'cat.id')
                        ->select('serv.id', 'serv.nombre as servicio', 'serv.descripcion', 'serv.imagen', 'cat.descripcion as categoria', 
                            'det.cantidad', 'det.precio', 'det.nota', 'det.estadoproceso', 'det.id as iddetalle'
                        )
                        ->where('det.idsolicitud', '=', $obj->id)
                        ->orderBy('det.id', 'asc')
                        ->get();
                }else {
                    $obj->servicios = [];
                }

            }

            return response()->json([
                'response'  => 1,
                'data' => $data,
            ]);

        }catch(\Exception $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Error al procesar la solicitud',
                'error' => [
                    'file'    => $th->getFile(),
                    'line'    => $th->getLine(),
                    'message' => $th->getMessage()
                ]
            ]);
        }
    }
    
}
