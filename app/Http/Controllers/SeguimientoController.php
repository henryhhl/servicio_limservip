<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SeguimientoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
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

            $personalasignado = DB::table('personal as pers')
                ->leftJoin('users as user', 'pers.fkidusuario', '=', 'user.id')
                ->leftJoin('detalle_rol as rol', 'user.id', '=', 'rol.fkidusuario')
                ->select(
                    'user.nombre', 'user.apellido', 'user.email', 'user.imagen', 'pers.idpersonal as id', 'pers.ci', 
                    'pers.contacto', 'pers.direccion', 'pers.ciudad'
                )
                ->where(DB::raw("(SELECT COUNT(*) as cantidad 
                        FROM asignardetalle as det 
                        WHERE det.fkidpersonal = pers.idpersonal and det.estadoproceso = 'A')"), '>', '0'
                )
                ->where('rol.fkidrol', '=', '4')
                ->whereNull('pers.deleted_at')
                ->orderBy('user.nombre')
                ->get();

            $personallibre = DB::table('personal as pers')
                ->leftJoin('users as user', 'pers.fkidusuario', '=', 'user.id')
                ->leftJoin('detalle_rol as rol', 'user.id', '=', 'rol.fkidusuario')
                ->select(
                    'user.nombre', 'user.apellido', 'user.email', 'user.imagen', 'pers.idpersonal as id', 
                    'pers.ci', 'pers.contacto', 'pers.direccion', 'pers.ciudad'
                )
                ->where(DB::raw("(SELECT COUNT(*) as cantidad 
                        FROM asignardetalle as det 
                        WHERE det.fkidpersonal = pers.idpersonal and det.estadoproceso = 'A')"), '=', '0'
                )
                ->where('rol.fkidrol', '=', '4')
                ->whereNull('pers.deleted_at')
                ->orderBy('user.nombre')
                ->get();

            
            $solicitud = DB::table('solicitud as soli')
                ->leftJoin('informacion as info', 'soli.idsolicitud', '=', 'info.fkidsolicitud')
                ->select('soli.idsolicitud as id', 'soli.estadoproceso as estado', 'info.nombre', 'info.apellido', 'info.latitud', 
                    'info.longitud', 'soli.fecha', 'soli.hora', 'soli.montototal'
                )
                ->where('soli.estado', '=', 'A')
                ->whereNull('soli.deleted_at')
                ->get();

            $solicitud_pendproc = DB::table('solicitud as soli')
                ->leftJoin('informacion as info', 'soli.idsolicitud', '=', 'info.fkidsolicitud')
                ->select('soli.idsolicitud as id', 'soli.estadoproceso as estado', 'info.nombre', 'info.apellido', 'info.latitud', 
                    'info.longitud', 'soli.fecha', 'soli.hora', 'soli.montototal'
                )
                ->where('soli.estado', '=', 'A')
                ->where(function ($query) {
                    return $query
                        ->orWhere('soli.estadoproceso', '=', 'E')
                        ->orWhere('soli.estadoproceso', '=', 'P');
                })
                ->whereNull('soli.deleted_at')
                ->get();

            foreach ($solicitud_pendproc as $det) {

                $det->servicios = DB::table('servicio as serv')
                    ->leftJoin('solicituddetalle as det', 'serv.idservicio', '=', 'det.fkidservicio')
                    ->select('serv.idservicio', 'serv.nombre', 'serv.descripcion', 'serv.imagen', 
                        'det.cantidad', 'det.precio', 'det.nota', 'det.idsolicituddetalle as iddetalle'
                    )
                    ->where('det.fkidsolicitud', '=', $det->id)
                    ->where('det.estado', '=', 'A')
                    ->whereNull('det.deleted_at')
                    ->get();
                
                foreach ($det->servicios as $array) {
                    $array->personales = DB::table('asignartrabajo as asignar')
                        ->leftJoin('asignardetalle as det', 'asignar.idasignartrabajo', '=', 'det.fkidasignartrabajo')
                        ->leftJoin('personal as pers', 'det.fkidpersonal', '=', 'pers.idpersonal')
                        ->leftJoin('users as user', 'pers.fkidusuario', '=', 'user.id')
                        ->select('pers.idpersonal', 'user.nombre', 'user.apellido')
                        ->where('asignar.fkidsolicituddetalle', '=', $array->iddetalle)
                        ->whereNull('asignar.deleted_at')
                        ->get();
                }
            }

            return response()->json([
                'response'  => 1,
                'personalasignado'  => $personalasignado,
                'personallibre'  => $personallibre,
                'solicitud'  => $solicitud,
                'solicitud_pendproc'  => $solicitud_pendproc,
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

    public function iniciar_seguimiento(Request $request) {

        try {

            $fkidusuario = $request->input('fkidusuario');
            $latitud = $request->input('latitud');
            $longitud = $request->input('longitud');
            $nickname = $request->input('nickname');

            $obj = new \stdClass;
            $obj->fkidusuario = $fkidusuario;
            $obj->latitud = $latitud;
            $obj->longitud = $longitud;
        

            if (file_exists( public_path() . '/seguimiento/' . $nickname . '.txt' )) {

                $archivo = fopen(public_path() . '/seguimiento/' . $nickname . '.txt', 'r');
                $array = '';
                while ($linea = fgets($archivo)) {
                    $array .= $linea;
                }

                $array = preg_replace("/[\r\n|\n|\r]+/", "", $array);

                $array = $array == '' ? [] : json_decode($array);

                array_push($array, $obj);

                fclose($archivo);

                $archivo = fopen( public_path() . '/seguimiento/' . $nickname . '.txt', 'w+');

                if ( fwrite( $archivo, json_encode($array) ) ) {
                    fclose( $archivo );
                }

            } else {
                $archivo = fopen( public_path() . '/seguimiento/' . $nickname . '.txt', 'w+');
                
                $array = [];
                array_push($array, $obj);

                if ( fwrite( $archivo, json_encode($array) ) ) {
                    fclose( $archivo );
                }
            }


            return response()->json([
                'response'  => 1,
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
