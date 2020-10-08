<?php

namespace App;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class Notificacion extends Model
{
    
    use SoftDeletes;

    protected $table = 'notificacion';

    protected $primaryKey = 'id';

    protected $fillable = [
        
    ];
    
    public function get_notificacion($idusuario) {

        $notificacion = DB::table('notificacion')
            ->select('id', 'idsolicitud', 'idasignartrabajo', 'idusuarioenviado', 'idusuariorecibido', 
                'mensaje', 'tipo', 'estado', 'fecha', 'hora'
            )
            ->where('estado', '=', 'A')   //tipo  P= pedido and A=Asignacion
            ->where('idusuariorecibido', '=', $idusuario)
            ->orderBy('id', 'desc')
            ->get();

        return $notificacion;
        
    }

    public function insertarNotificacion($idsolicitud, $nombre, $apellido, $idusuario) {

        $mytime = Carbon::now('America/La_paz');
        
        $usuario = DB::table('users as user')
            ->leftJoin('detalle_rol as det', 'user.id', '=', 'det.idusuario')
            ->select('user.id', 'user.nombre', 'user.apellido', 'user.imagen', 'user.usuario')
            ->where(function ($query) {
                return $query
                    ->orWhere('det.idrol', '=', '1')
                    ->orWhere('det.idrol', '=', '2');
            })
            ->get();

        foreach ($usuario as $user) {

            $notificacion = new Notificacion();
            $notificacion->idsolicitud = $idsolicitud;
            $notificacion->idusuarioenviado = $idusuario;
            $notificacion->idusuariorecibido = $user->id;
            $notificacion->idasignartrabajo = null;
            $notificacion->mensaje = 'NUEVA SOLICITUD DE PEDIDO DEL CLIENTE '.$nombre.' '.$apellido;
            $notificacion->tipo = 'P';
            $notificacion->fecha = $mytime->toDateString();
            $notificacion->hora = $mytime->toTimeString();
            $notificacion->save();


            /*  notificacion web */

            if (file_exists( public_path() . '/notificacion/' . $user->usuario . '.txt' )) {

                $archivo = fopen(public_path() . '/notificacion/' . $user->usuario . '.txt', 'r');
                $array = '';
                while ($linea = fgets($archivo)) {
                    $array .= $linea;
                }

                $array = preg_replace("/[\r\n|\n|\r]+/", "", $array);

                $array = $array == '' ? [] : json_decode($array);

                array_push($array, $notificacion);

                fclose($archivo);

                $archivo = fopen( public_path() . '/notificacion/' . $user->usuario . '.txt', 'w+');

                if ( fwrite( $archivo, json_encode($array) ) ) {
                    fclose( $archivo );
                }

            } else {
                $archivo = fopen( public_path() . '/notificacion/' . $user->usuario . '.txt', 'w+');
                
                $array = [];
                array_push($array, $notificacion);

                if ( fwrite( $archivo, json_encode($array) ) ) {
                    fclose( $archivo );
                }
            }

            /* end notificacion web */

            /* notificacion movil */

            if (file_exists( public_path() . '/notificacion/' . $user->usuario .'_movil' . '.txt' )) {

                $archivo = fopen(public_path() . '/notificacion/' . $user->usuario . '_movil' . '.txt', 'r');
                $array = '';
                while ($linea = fgets($archivo)) {
                    $array .= $linea;
                }

                $array = preg_replace("/[\r\n|\n|\r]+/", "", $array);

                $array = $array == '' ? [] : json_decode($array);

                array_push($array, $notificacion);

                fclose($archivo);

                $archivo = fopen( public_path() . '/notificacion/' . $user->usuario . '_movil' . '.txt', 'w+');

                if ( fwrite( $archivo, json_encode($array) ) ) {
                    fclose( $archivo );
                }

            } else {
                $archivo = fopen( public_path() . '/notificacion/' . $user->usuario . '_movil' . '.txt', 'w+');
                
                $array = [];
                array_push($array, $notificacion);

                if ( fwrite( $archivo, json_encode($array) ) ) {
                    fclose( $archivo );
                }
            }

            /* end notificacion movil */

        }

    }

    public function updateestado($idsolicitud, $estado, $idusuario) {
        
        $mytime = Carbon::now('America/La_paz');
        
        $usuario = DB::table('users as user')
            ->leftJoin('detalle_rol as det', 'user.id', '=', 'det.idusuario')
            ->select('user.id', 'user.nombre', 'user.apellido', 'user.imagen', 'user.usuario')
            ->where(function ($query) {
                return $query
                    ->orWhere('det.idrol', '=', '1')
                    ->orWhere('det.idrol', '=', '2');
            })
            ->get();

        $estadoproceso = $estado;
        if ($estado == 'C') {
            $estadoproceso = 'CANCELADO';
        }
        if ($estado == 'F') {
            $estadoproceso = 'FINALIZADO';
        }
        if ($estado == 'N') {
            $estadoproceso = 'FALLIDO';
        }

        $informacion = DB::table('informacion')
            ->where('idsolicitud', '=', $idsolicitud)
            ->first();

        foreach ($usuario as $user) {

            $notificacion = new Notificacion();
            $notificacion->idsolicitud = $idsolicitud;
            $notificacion->idusuarioenviado = $idusuario;
            $notificacion->idusuariorecibido = $user->id;
            $notificacion->idasignartrabajo = null;
            $notificacion->mensaje = 'LA SOLICITUD DEL PEDIDO DEL CLIENTE '.$informacion->nombre.' '.$informacion->apellido. ' HA SIDO '.$estadoproceso;
            $notificacion->tipo = 'P';
            $notificacion->fecha = $mytime->toDateString();
            $notificacion->hora = $mytime->toTimeString();
            $notificacion->save();

            /*  notificacion web */
            

            if (file_exists( public_path() . '/notificacion/' . $user->usuario . '.txt' )) {

                $archivo = fopen(public_path() . '/notificacion/' . $user->usuario . '.txt', 'r');
                $array = '';
                while ($linea = fgets($archivo)) {
                    $array .= $linea;
                }

                $array = preg_replace("/[\r\n|\n|\r]+/", "", $array);

                $array = $array == '' ? [] : json_decode($array);

                array_push($array, $notificacion);

                fclose($archivo);

                $archivo = fopen( public_path() . '/notificacion/' . $user->usuario . '.txt', 'w+');

                if ( fwrite( $archivo, json_encode($array) ) ) {
                    fclose( $archivo );
                }

            } else {
                $archivo = fopen( public_path() . '/notificacion/' . $user->usuario . '.txt', 'w+');
                
                $array = [];
                array_push($array, $notificacion);

                if ( fwrite( $archivo, json_encode($array) ) ) {
                    fclose( $archivo );
                }
            }

            /* end notificacion web */

            /* notificacion movil */

            if (file_exists( public_path() . '/notificacion/' . $user->usuario .'_movil' . '.txt' )) {

                $archivo = fopen(public_path() . '/notificacion/' . $user->usuario . '_movil' . '.txt', 'r');
                $array = '';
                while ($linea = fgets($archivo)) {
                    $array .= $linea;
                }

                $array = preg_replace("/[\r\n|\n|\r]+/", "", $array);

                $array = $array == '' ? [] : json_decode($array);

                array_push($array, $notificacion);

                fclose($archivo);

                $archivo = fopen( public_path() . '/notificacion/' . $user->usuario . '_movil' . '.txt', 'w+');

                if ( fwrite( $archivo, json_encode($array) ) ) {
                    fclose( $archivo );
                }

            } else {
                $archivo = fopen( public_path() . '/notificacion/' . $user->usuario . '_movil' . '.txt', 'w+');
                
                $array = [];
                array_push($array, $notificacion);

                if ( fwrite( $archivo, json_encode($array) ) ) {
                    fclose( $archivo );
                }
            }

            /* end notificacion movil */

        }

        $solicitud = Solicitud::findOrFail($idsolicitud);

        $notificacion = new Notificacion();
        $notificacion->idsolicitud = $idsolicitud;
        $notificacion->idusuarioenviado = $idusuario;
        $notificacion->idusuariorecibido = $solicitud->idusuario;
        $notificacion->idasignartrabajo = null;
        $notificacion->mensaje = 'Su solicitud del pedido ' . ' ha sido '. $estadoproceso;
        $notificacion->tipo = 'P';
        $notificacion->fecha = $mytime->toDateString();
        $notificacion->hora = $mytime->toTimeString();
        $notificacion->save();

        $user = User::findOrFail($solicitud->idusuario);

        /*  notificacion web */
        

        if (file_exists( public_path() . '/notificacion/' . $user->usuario . '.txt' )) {

            $archivo = fopen(public_path() . '/notificacion/' . $user->usuario . '.txt', 'r');
            $array = '';
            while ($linea = fgets($archivo)) {
                $array .= $linea;
            }

            $array = preg_replace("/[\r\n|\n|\r]+/", "", $array);

            $array = $array == '' ? [] : json_decode($array);

            array_push($array, $notificacion);

            fclose($archivo);

            $archivo = fopen( public_path() . '/notificacion/' . $user->usuario . '.txt', 'w+');

            if ( fwrite( $archivo, json_encode($array) ) ) {
                fclose( $archivo );
            }

        } else {
            $archivo = fopen( public_path() . '/notificacion/' . $user->usuario . '.txt', 'w+');
            
            $array = [];
            array_push($array, $notificacion);

            if ( fwrite( $archivo, json_encode($array) ) ) {
                fclose( $archivo );
            }
        }

        /* end notificacion web */

        /* notificacion movil */

        if (file_exists( public_path() . '/notificacion/' . $user->usuario .'_movil' . '.txt' )) {

            $archivo = fopen(public_path() . '/notificacion/' . $user->usuario . '_movil' . '.txt', 'r');
            $array = '';
            while ($linea = fgets($archivo)) {
                $array .= $linea;
            }

            $array = preg_replace("/[\r\n|\n|\r]+/", "", $array);

            $array = $array == '' ? [] : json_decode($array);

            array_push($array, $notificacion);

            fclose($archivo);

            $archivo = fopen( public_path() . '/notificacion/' . $user->usuario . '_movil' . '.txt', 'w+');

            if ( fwrite( $archivo, json_encode($array) ) ) {
                fclose( $archivo );
            }

        } else {
            $archivo = fopen( public_path() . '/notificacion/' . $user->usuario . '_movil' . '.txt', 'w+');
            
            $array = [];
            array_push($array, $notificacion);

            if ( fwrite( $archivo, json_encode($array) ) ) {
                fclose( $archivo );
            }
        }


    }

    public function desactivar($id) {
        $data = Notificacion::findOrFail($id);
        $data->estado = 'N';
        $data->update();
    }

}
