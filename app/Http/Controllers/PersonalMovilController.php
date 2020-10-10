<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\User;
use App\Notificacion;

class PersonalMovilController extends Controller
{
    public function loguear (Request $request){
        $usuario = $request->usuario;
        $password = $request->password;
        $user = DB::table('personal as per')
                ->leftJoin('users as user', 'per.fkidusuario', '=', 'user.id')
                ->select('user.id', 'user.nombre', 'user.apellido', 'user.nacimiento','user.usuario' ,'per.ci', 'per.contacto', 
                    'user.imagen', 'user.email', 'user.password','per.estado', 'user.tipo', 'user.genero', 'user.nombre as noti'
                )
                ->where('per.estado', '=', 'A')
                ->where( 'user.usuario', '=', $usuario )
                ->get();
        if(count($user) == 0){
            $user = [];   
        }else{
            if (!(Hash::check($password, $user[0]->password))){
                $user = [];
            }else{
                foreach($user as $ser){
                    if(!(is_null($ser->imagen))){
                        $pos = strpos($ser->imagen, ',');
                        $nuevo = substr($ser->imagen,$pos+1,strlen($ser->imagen)-1);
                        $ser->imagen = $nuevo;
                    }

                    $obj = new Notificacion();
                    $notificacion = $obj->get_notificacion($ser->id);

                    $ser->noti = $notificacion;
                    
                }
                
            }
        }
               
        return response()->json([
            'data'   => $user
        ]);
    }

    public function solicitudAsignada(Request $request){
        $personal = $request->personal;
        
        $solicitudes = DB::table('solicitud as sol')
                    ->leftJoin('users as user', 'sol.fkidusuario', '=', 'user.id')
                    ->leftJoin('informacion as info', 'sol.idsolicitud', '=', 'info.fkidsolicitud')
                    ->leftJoin('solicituddetalle as soldet', 'sol.idsolicitud', '=', 'soldet.idsolicitud')
                    ->leftJoin('asignartrabajo as asignar', 'soldet.idsolicituddetalle', '=', 'asignar.fkidsolicituddetalle')
                    ->leftJoin('asignardetalle as asignardet', 'asignar.idasignartrabajo', '=', 'asignardet.fkidasignartrabajo')
                    ->leftJoin('personal as pers', 'asignardet.fkidpersonal', '=', 'pers.idpersonal')
                   /* ->select( 'sol.id', 'sol.montototal', 'sol.estadoproceso', 'sol.fecha', 'sol.hora', 'sol.nota',
                        'user.nombre as usuario', 'user.apellido as apellidouser',
                        'info.nombre', 'info.apellido', 'info.pais', 'info.ciudad', 'info.direccion', 'info.direccioncompleto',
                        'info.telefono', 'info.email'
                    )*/

                    ->select('sol.idsolicitud as id', 'sol.montototal', 'sol.estadoproceso', 'sol.fecha', 'sol.hora', 
                    'user.nombre', 'user.apellido', 'info.direccion', 'info.latitud' , 'info.longitud', 'info.pais', 'info.ciudad', 'info.zona'
                    )

                    ->where('sol.estado', '=', 'A')
                    ->where('pers.fkidusuario', '=', $personal)
                    
                    ->orderBy('sol.idsolicitud', 'desc')
                    ->get();

        if(count($solicitudes) == 0){
            $solicitudes = [];
        }

        return response()->json([
            'data'   => $solicitudes
        ]);

    }
}
