<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class EstadisticaController extends Controller
{
    
    public function get_year(Request $request) {
        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }

            $fechainicio = $request->input('fechainicio');
            $fechafin = $request->input('fechafin');


            $solicitud = DB::table('solicitud as soli')
                ->select( 
                    DB::raw("MONTH(soli.fecha) as mes"), DB::raw("COUNT(*) as cantidad")
                )
                ->where('soli.estado', '=', 'A')
                ->where([ ['soli.fecha', '>=', $fechainicio], ['soli.fecha', '<=', $fechafin] ])
                ->whereNull('soli.deleted_at')
                ->groupBy('mes')
                ->orderBy('soli.fecha')
                ->get();
            
            return response()->json([
                'response' => 1,
                'solicitud' => $solicitud,
            ]);

        } catch(\Exception $th) {
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

    public function get_mes(Request $request) {
        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }

            $fechainicio = $request->input('fechainicio');
            $fechafin = $request->input('fechafin');


            $solicitud = DB::table('solicitud as soli')
                ->select( 
                    DB::raw("DAY(soli.fecha) as dia"), DB::raw("COUNT(*) as cantidad")
                )
                ->where('soli.estado', '=', 'A')
                ->where([ ['soli.fecha', '>=', $fechainicio], ['soli.fecha', '<=', $fechafin] ])
                ->whereNull('soli.deleted_at')
                ->groupBy('dia')
                ->orderBy('soli.fecha')
                ->get();
            
            return response()->json([
                'response' => 1,
                'solicitud' => $solicitud,
            ]);

        } catch(\Exception $th) {
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
