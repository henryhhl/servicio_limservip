<?php

namespace App\Http\Controllers;

use App\AsignarDetalle;
use App\AsignarTrabajo;
use App\Notificacion;
use App\Personal;
use App\Solicitud;
use App\SolicitudDetalle;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AsignarTrabajoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }

            $data = DB::table('personal as pers')
                ->leftJoin('users as user', 'pers.idusuario', '=', 'user.id')
                ->leftJoin('detalle_rol as rol', 'user.id', '=', 'rol.idusuario')
                ->select(
                    'user.nombre', 'user.apellido', 'user.email', 'user.imagen', 'pers.id', 'pers.ci', 'pers.contacto',
                    DB::raw(
                        "(SELECT COUNT(*)  
                        FROM asignardetalle as det 
                        WHERE pers.id = det.idpersonal AND det.estadoproceso = 'A') as cantidad"
                    )
                )
                ->where('rol.idrol', '=', '4')
                ->whereNull('pers.deleted_at')
                ->get();


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

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function get_personal(Request $request)
    {
        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }

            $data = DB::table('personal as pers')
                ->leftJoin('users as user', 'pers.idusuario', '=', 'user.id')
                ->leftJoin('detalle_rol as rol', 'user.id', '=', 'rol.idusuario')
                ->select(
                    'user.nombre', 'user.apellido', 'user.email', 'user.imagen', 'pers.id', 'pers.ci', 'pers.contacto',
                    DB::raw(
                        "(SELECT COUNT(*)  
                        FROM asignardetalle as det 
                        WHERE pers.id = det.idpersonal AND det.estadoproceso = 'A') as cantidad"
                    )
                )
                ->where('rol.idrol', '=', '4')
                ->whereNull('pers.deleted_at')
                ->get();


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

    public function asignar(Request $request)
    {
        try {
            DB::beginTransaction();

            $array_servicio = json_decode($request->input('array_servicio', '[]'));

            foreach ($array_servicio as $array) {
                $data = new AsignarTrabajo();
                $data->idsolicituddetalle = $array->iddetalle;
                $data->idusuario = Auth::user()->id;
                $mytime = Carbon::now('America/La_paz');
                $data->fecha = $mytime->toDateString();
                $data->horainicio =$mytime->toTimeString();
                $data->horafin =$mytime->toTimeString();
                $data->save();

                $solcituddetalle = SolicitudDetalle::find($array->iddetalle);
                $solcituddetalle->estadoproceso = 'E';
                $solcituddetalle->update();

                $solictud = Solicitud::findOrFail($solcituddetalle->idsolicitud);
                $solictud->estadoproceso = 'E';
                $solictud->update();

                foreach ($array->array_personal as $personal) {
                    if ($personal->value) {
                        $detalle = new AsignarDetalle();
                        $detalle->idasignartrabajo = $data->id;
                        $detalle->idpersonal = $personal->id;
                        $detalle->fecha = $mytime->toDateString();
                        $detalle->horainicio =$mytime->toTimeString();
                        $detalle->horafin =$mytime->toTimeString();
                        $detalle->save();

                        $objpersonal = Personal::findOrFail($personal->id);

                        $notificacion = new Notificacion();
                        $notificacion->idsolicitud = $solictud->id;
                        $notificacion->idusuarioenviado = Auth::user()->id;
                        $notificacion->idusuariorecibido = $objpersonal->idusuario;
                        $notificacion->idasignartrabajo = $data->id;
                        $notificacion->mensaje = 'SE HA ASIGNADO UNA NUEVA SOLICITUD';
                        $notificacion->tipo = 'A';
                        $notificacion->fecha = $mytime->toDateString();
                        $notificacion->hora = $mytime->toTimeString();
                        $notificacion->save();

                        $user = User::findOrFail($objpersonal->idusuario);

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


                        if (file_exists( public_path() . '/notificacion/' . $user->usuario . '_movil' . '.txt' )) {

                            $archivo = fopen(public_path() . '/notificacion/' . $user->usuario . '_movil' .  '.txt', 'r');
                            $array = '';
                            while ($linea = fgets($archivo)) {
                                $array .= $linea;
                            }
            
                            $array = preg_replace("/[\r\n|\n|\r]+/", "", $array);
            
                            $array = $array == '' ? [] : json_decode($array);
            
                            array_push($array, $notificacion);
            
                            fclose($archivo);
            
                            $archivo = fopen( public_path() . '/notificacion/' . $user->usuario . '_movil' .  '.txt', 'w+');
            
                            if ( fwrite( $archivo, json_encode($array) ) ) {
                                fclose( $archivo );
                            }
            
                        } else {
                            $archivo = fopen( public_path() . '/notificacion/' . $user->usuario . '_movil' .  '.txt', 'w+');
                            
                            $array = [];
                            array_push($array, $notificacion);
            
                            if ( fwrite( $archivo, json_encode($array) ) ) {
                                fclose( $archivo );
                            }
                        }

                        /* end notificacion movil */

                    }
                }

                $notificacion = new Notificacion();
                $notificacion->idsolicitud = $solictud->id;
                $notificacion->idusuarioenviado = Auth::user()->id;
                $notificacion->idusuariorecibido = $solictud->idusuario;
                $notificacion->idasignartrabajo = $data->id;
                $notificacion->mensaje = 'SE LE HA ASIGNADO PERSONAL A SU SOLICITUD.';
                $notificacion->tipo = 'A';
                $notificacion->fecha = $mytime->toDateString();
                $notificacion->hora = $mytime->toTimeString();
                $notificacion->save();

                $user = User::findOrFail($solictud->idusuario);


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


                if (file_exists( public_path() . '/notificacion/' . $user->usuario . '_movil' . '.txt' )) {

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

            DB::commit();

            return response()->json([
                'response'   => 1,
                'data'  => $array_servicio,
            ]);

        }catch(\Exception $th) {
            DB::rollBack();
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
