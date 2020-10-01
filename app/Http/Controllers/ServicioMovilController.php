<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ServicioMovilController extends Controller
{
    public function listar(Request $request){
        $servicio = DB::table('servicio as ser')
                    ->leftJoin('categoria as cat', 'ser.idcategoria', '=', 'cat.id')
                    ->select('ser.id', 'ser.nombre', 'ser.descripcion', 'ser.precio','ser.imagen', 'cat.descripcion as nombrecategoria',
                     'ser.estado'
                    )
                    ->where('ser.estado', '=', 'A')
                    ->get();
        if(count($servicio) == 0){
            $servicio = [];
        }else{
            foreach($servicio as $ser){
                if(!(is_null($ser->imagen))){
                    $pos = strpos($ser->imagen, ',');
                    $nuevo = substr($ser->imagen,$pos+1,strlen($ser->imagen)-1);
                    $ser->imagen = $nuevo;
                }
            }
        }
        return response()->json([
            'data'   => $servicio
        ]);
    }
}
