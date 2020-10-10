<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Informacion;
use App\Notificacion;
use App\Solicitud;
use App\SolicitudDetalle;
use Carbon\Carbon;

class SolicitudMovilController extends Controller
{


    public function get_notificacionMovil(Request $request) {

        try {
            $nickname= $request->nickname;
            $idusuario= $request->idusuario;
            $bandera = '';

            if (file_exists( public_path() . '/notificacion/' . $nickname . '_movil' . '.txt' )) {

                $archivo = fopen(public_path() . '/notificacion/' . $nickname . '_movil' . '.txt', 'r');
                while ($linea = fgets($archivo)) {
                    $bandera .= $linea;
                }
                $bandera = preg_replace("/[\r\n|\n|\r]+/", "", $bandera);
                fclose($archivo);

            } else {
                $archivo = fopen( public_path() . '/notificacion/' . $nickname . '_movil' . '.txt', 'w+');
                if ( fwrite( $archivo, '' ) ) {
                    fclose( $archivo );
                }
            }
            $bandera = $bandera == '' ? [] : json_decode($bandera);

            $archivo = fopen( public_path() . '/notificacion/' . $nickname . '_movil' . '.txt', 'w+');
            if ( fwrite( $archivo, '' ) ) {
                fclose( $archivo );
            }

            $notificacion = [];
            if (sizeof($bandera) > 0) {
                $obj = new Notificacion();
                $notificacion = $obj->get_notificacion( $idusuario );
            }

            return response()->json([
                
                'notificacion' => $notificacion,
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



    public function miSolicitud(Request $request){
        $idcliente = $request->cliente;

        $solicitudes =  DB::table('solicitud as sol')
                ->leftJoin('users as user', 'sol.fkidusuario', '=', 'user.id')
                ->join('informacion as info', 'info.fkidsolicitud', '=', 'sol.idsolicitud')
                ->select('sol.idsolicitud as id', 'sol.montototal', 'sol.estadoproceso', 'sol.fecha', 'sol.hora', 
                    'user.nombre', 'user.apellido', 'info.direccion', 'info.latitud' , 'info.longitud', 'info.pais', 'info.ciudad', 'info.zona'
                )
                ->where('sol.fkidusuario', '=', $idcliente)
                ->where('sol.estado', '=', 'A')
                ->orderBy('sol.idsolicitud', 'desc')
                ->get();

        if(count($solicitudes) == 0){
            $solicitudes = [];
        }

        return response()->json([
            'data'   => $solicitudes
        ]);

    }

    public function verSolicitud(Request $request){
        $solicitud = $request->solicitud;
        $solicitudes =  DB::table('solicitud as sol')
                ->leftJoin('users as user', 'sol.fkidusuario', '=', 'user.id')
                ->join('informacion as info', 'info.fkidsolicitud', '=', 'sol.idsolicitud')
                ->select('sol.idsolicitud as id', 'sol.montototal', 'sol.estadoproceso', 'sol.fecha', 'sol.hora', 
                    'user.nombre', 'user.apellido', 'info.direccion', 'info.latitud' , 'info.longitud', 'info.pais', 'info.ciudad', 'info.zona'
                )
                ->where('sol.idsolicitud', '=', $solicitud)
                ->where('sol.estado', '=', 'A')
                ->orderBy('sol.idsolicitud', 'desc')
                ->first();

        /*if(count($solicitudes) == 0){
            $solicitudes = [];
        }*/

        return response()->json(
            $solicitudes
        );

    }

    public function detalleSolicitud(Request $request){
        $idsol = $request->solicitud;

        $detalles =  DB::table('solicituddetalle as soldet')
                ->join('servicio as ser', 'soldet.fkidservicio', '=', 'ser.idservicio')
                ->select('soldet.idsolicituddetalle as iddet', 'soldet.cantidad', 'soldet.precio', 'ser.nombre as nombreservicio', 
                    'soldet.nota', 'ser.imagen', 'soldet.nota as personal'
                )
                ->where('soldet.fkidsolicitud', '=', $idsol)
                ->where('soldet.estado', '=', 'A')
                ->orderBy('soldet.idsolicituddetalle', 'asc')
                ->get();
        
        if(count($detalles) == 0){
            $detalles = [];
        }else{
            
            foreach($detalles as $ser){
                if(!(is_null($ser->imagen))){
                    $pos = strpos($ser->imagen, ',');
                    $nuevo = substr($ser->imagen,$pos+1,strlen($ser->imagen)-1);
                    $ser->imagen = $nuevo;
                }

               // $iddet = $request->iddet;
                $personal = DB::table('solicituddetalle as soldet')
                    ->join('asignartrabajo as at', 'soldet.idsoolicituddetalle', '=', 'at.fkidsolicituddetalle')
                    ->join('asignardetalle as ad', 'at.idasignartrabajo', '=', 'ad.fkidasignartrabajo')
                    ->join('personal as per','per.idpersonal','=','ad.fkidpersonal')
                    ->join('users as user','user.id','=','per.fkidusuario')
                    ->select('user.nombre','user.imagen','per.ci','per.contacto')
                    ->where('soldet.idsolicituddetalle', '=', $ser->iddet)
                    ->get();
                if(count($personal) == 0){
                    $personal = [];
                }else{
                    
                    foreach($personal as $serv){
                        if(!(is_null($serv->imagen))){
                            $pos = strpos($serv->imagen, ',');
                            $nuevo = substr($serv->imagen,$pos+1,strlen($serv->imagen)-1);
                            $serv->imagen = $nuevo;
                        }
                    }
                    
                }
                $ser->personal = $personal;

            }

            
        }


        

        return response()->json([
            'data'   => $detalles
        ]);
    }

    public function personalAsignado(Request $request){
        $iddet = $request->iddet;
        $personal = DB::table('solicituddetalle as soldet')
            ->join('asignartrabajo as at', 'soldet.idsolicituddetalle', '=', 'at.fkidsolicituddetalle')
            ->join('asignardetalle as ad', 'at.idasignartrabajo', '=', 'ad.fkidasignartrabajo')
            ->join('personal as per','per.idpersonal','=','ad.fkidpersonal')
            ->join('users as user','user.id','=','per.idusuario')
            ->select('user.nombre','user.imagen','per.ci','per.contacto')
            ->where('soldet.idsolicituddetalle', '=', $iddet)
            ->get();
        if(count($personal) == 0){
            $personal = [];
        }else{
            
            foreach($personal as $ser){
                if(!(is_null($ser->imagen))){
                    $pos = strpos($ser->imagen, ',');
                    $nuevo = substr($ser->imagen,$pos+1,strlen($ser->imagen)-1);
                    $ser->imagen = $nuevo;
                }
            }
            
        }

        return response()->json([
            'data'   => $personal
        ]);
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

            $array_servicio = $request->get('array_servicio', '[]');

            $servicio = new Solicitud();
            $servicio->fkidusuario = $cliente;
            $servicio->montototal = $montototal;
            $mytime = Carbon::now('America/La_paz');
            $servicio->estadoproceso = 'P';
            $servicio->fecha = $mytime->toDateString();
            $servicio->hora = $mytime->toTimeString();
            $servicio->save();

            $informacion = new Informacion();
            $informacion->fkidsolicitud = $servicio->idsolicitud;
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
            foreach ($array_servicio as $value) {
                
                $detalle = new SolicitudDetalle();
                $detalle->fkidsolicitud = $servicio->idsolicitud;
                $detalle->fkidservicio = $value['id'];
                $detalle->cantidad = $value['cantidad'];
                $detalle->precio = $value['precio'];
                $detalle->estadoproceso = 'P';
                $detalle->descuento = 0;
                $detalle->save();
            }

            $notificacion = new Notificacion();
            $notificacion->insertarNotificacion($servicio->idsolicitud, $nombre, $apellido, $cliente);
            
            DB::commit();
            return response()->json(
                 'Insertado Correctamente'
            );

        }catch(\Exception $th) {
            DB::rollBack();
            $array_servicio = $request->get('array_servicio', '[]');
            return response()->json([
                'data' => $array_servicio,
                'error' => [
                    'file'    => $th->getFile(),
                    'line'    => $th->getLine(),
                    'message' => $th->getMessage()
                ]
            ]);
        }
    }
}
