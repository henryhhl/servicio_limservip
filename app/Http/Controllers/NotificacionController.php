<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class NotificacionController extends Controller
{
    
    public function index(Request $request) {

        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }

            $idusuario = Auth::user()->id;

            $data = DB::table('notificacion as not')
                ->leftJoin('users as user', 'not.fkidusuarioenviado', '=', 'user.id')
                ->select('not.idnotificacion as id', 'not.fkidsolicitud as idsolicitud', 'not.fkidasignartrabajo as idasignartrabajo', 
                    'not.fkidusuarioenviado as idusuarioenviado', 'not.fkidusuariorecibido as idusuariorecibido', 
                    'not.mensaje', 'not.tipo', 'not.estado', 'not.fecha', 'not.hora', 'user.nombre', 'user.apellido'
                )
                ->where('not.fkidusuariorecibido', '=', $idusuario)
                ->orderBy('not.idnotificacion', 'desc')
                ->paginate(20);


            return response()->json([
                'response'   => 1,
                'data'       => $data,
                'pagination' => [
                    'total'        => $data->total(),
                    'current_page' => $data->currentPage(),
                    'per_page'     => $data->perPage(),
                    'last_page'    => $data->lastPage(),
                    'from'         => $data->firstItem(),
                    'to'           => $data->lastItem(),
                ],
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
