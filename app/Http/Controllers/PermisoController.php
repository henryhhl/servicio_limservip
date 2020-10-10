<?php

namespace App\Http\Controllers;

use App\PermisoDetalle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PermisoController extends Controller
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

            $rol = DB::table('rol')
                ->select('idrol as id', 'nombre', 'descripcion')
                ->where('estado', '=', 'A')
                ->orderBy('idrol', 'desc')
                ->get();

            $permiso = DB::table('permiso')
                ->select('idpermiso as id', 'nombre')
                ->where('estado', '=', 'A')
                ->orderBy('idpermiso', 'asc')
                ->get();
            
            return response()->json([
                'response' => 1,
                'permiso' => $permiso,
                'rol' => $rol,
                'sesion'   => Auth::guest(),
                'user'   => Auth::user(), 
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

    public function select_rol(Request $request)
    {
        try {

            DB::beginTransaction();

            $sesion = Auth::guest();

            if ($sesion) {
                DB::rollBack();
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }

            $idrol = $request->input('idrol', null);

            $array_permiso = DB::select(
                'SELECT * FROM permiso AS perm
                    WHERE perm.idpermiso NOT IN 
                    (SELECT det.fkidpermiso  FROM detalle_permiso AS det
                        WHERE det.fkidrol = '.$idrol.')'
            );

            if (sizeof($array_permiso) > 0) {
                
                foreach ($array_permiso as $permiso) {

                    $detalle = new PermisoDetalle();
                    $detalle->fkidrol = $idrol;
                    $detalle->fkidpermiso = $permiso->id;
                    $detalle->estado = 'N';
                    $detalle->save();
    
                }
            }

            $array_permiso = DB::table('detalle_permiso as det')
                ->leftJoin('permiso as perm', 'det.fkidpermiso', '=', 'perm.idpermiso')
                ->select('det.idpermisodetalle as id', 'perm.nombre', 'det.estado')
                ->where('det.fkidrol', '=', $idrol)
                ->orderBy('perm.idpermiso', 'asc')
                ->get();

            $permiso_activo = DB::table('detalle_permiso as det')
                ->leftJoin('permiso as perm', 'det.fkidpermiso', '=', 'perm.idpermiso')
                ->select('det.idpermisodetalle as id', 'perm.nombre', 'det.estado')
                ->where([ ['det.fkidrol', '=', $idrol], ['det.estado', '=', 'A'] ])
                ->orderBy('perm.idpermiso', 'asc')
                ->get();

                DB::commit();
            
            return response()->json([
                'response'       => 1,
                'sesion'         => Auth::guest(),
                'array_permiso'  => $array_permiso,
                'permiso_activo' => $permiso_activo,
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

    public function asignar(Request $request) {

        try {
            DB::beginTransaction();

            $idrol = $request->input('idrol', null);

            $array_permiso = DB::table('detalle_permiso as det')
                ->leftJoin('permiso as perm', 'det.fkidpermiso', '=', 'perm.idpermiso')
                ->select('det.idpermisodetalle as id', 'perm.nombre', 'det.estado')
                ->where('det.fkidrol', '=', $idrol)
                ->orderBy('perm.idpermiso', 'asc')
                ->get();

            foreach ($array_permiso as $permiso) {

                $detalle = PermisoDetalle::find($permiso->id);
                $detalle->estado = 'N';
                $detalle->update();

            }

            $array_permiso = json_decode($request->input('array_permiso', '[]'));

            foreach ($array_permiso as $permiso) {
                $detalle = PermisoDetalle::find($permiso);
                $detalle->estado = 'A';
                $detalle->update();
            }

            DB::commit();

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
