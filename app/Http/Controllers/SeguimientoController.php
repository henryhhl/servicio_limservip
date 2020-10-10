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
                ->leftJoin('users as user', 'pers.idusuario', '=', 'user.id')
                ->leftJoin('detalle_rol as rol', 'user.id', '=', 'rol.idusuario')
                ->select(
                    'user.nombre', 'user.apellido', 'user.email', 'user.imagen', 'pers.id', 'pers.ci', 'pers.contacto', 'pers.direccion', 'pers.ciudad'
                )
                ->where(DB::raw("(SELECT COUNT(*) as cantidad 
                        FROM asignardetalle as det 
                        WHERE det.idpersonal = pers.id and det.estadoproceso = 'A')"), '>', '0'
                )
                ->where('rol.idrol', '=', '4')
                ->whereNull('pers.deleted_at')
                ->get();

            $personallibre = DB::table('personal as pers')
                ->leftJoin('users as user', 'pers.idusuario', '=', 'user.id')
                ->leftJoin('detalle_rol as rol', 'user.id', '=', 'rol.idusuario')
                ->select(
                    'user.nombre', 'user.apellido', 'user.email', 'user.imagen', 'pers.id', 'pers.ci', 'pers.contacto', 'pers.direccion', 'pers.ciudad'
                )
                ->where(DB::raw("(SELECT COUNT(*) as cantidad 
                        FROM asignardetalle as det 
                        WHERE det.idpersonal = pers.id and det.estadoproceso = 'A')"), '=', '0'
                )
                ->where('rol.idrol', '=', '4')
                ->whereNull('pers.deleted_at')
                ->get();

            return response()->json([
                'response'  => 1,
                'personalasignado'  => $personalasignado,
                'personallibre'  => $personallibre,
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

            $idusuario = $request->input('idusuario');
            $nickname = $request->input('nickname');
            $nombre = $request->input('nombre');
            $apellido = $request->input('apellido');
            $latitud = $request->input('latitud');
            $longitud = $request->input('longitud');


            /*  notificacion web */


            $obj = new \stdClass;
            $obj->idusuario = $idusuario;
            $obj->nickname = $nickname;
            $obj->nombre = $nombre;
            $obj->apellido = $apellido;
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
