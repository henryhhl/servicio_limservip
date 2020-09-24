<?php

namespace App\Http\Controllers;

use App\GrupoUsuarioDetalle;
use App\PermisoDetalle;
use App\GrupoUsuario;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RolController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }

            $search = $request->input('search', null);

            if ($search == null) {
                $data = DB::table('rol')
                    ->select('id', 'nombre', 'descripcion', 'estado')
                    ->where('estado', '=', 'A')
                    ->orderBy('id', 'asc')
                    ->paginate(10);
            }else {
                $data = DB::table('rol')
                    ->select('id', 'nombre', 'descripcion', 'estado')
                    ->where(function ($query) use ($search) {
                        return $query->orWhere('nombre', 'LIKE', '%'.$search.'%');
                    })
                    ->where('estado', '=', 'A')
                    ->orderBy('id', 'desc')
                    ->paginate(10);
            }

            return response()->json([
                'response' => 1,
                'data' => $data,
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

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion, 
                ]);
            }

            $array_usuario = DB::table('users as user')
                ->leftJoin('detalle_rol as det', 'user.id', '=', 'det.idusuario')
                ->select('user.id', 'user.usuario', 'user.nombre', 'user.apellido', 'user.imagen', 'user.genero')
                ->where(function ($query) use ($request) {
                    return $query->orWhere('det.estado', '=', 'N')
                        ->orWhereNull('det.estado');
                })
                ->where('user.estado', '=', 'A')
                ->orderBy('user.id', 'desc')
                ->get();
            
            return response()->json([
                'response'      => 1,
                'array_usuario' => $array_usuario,
                // 'data' => $data,
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
        try {
            DB::beginTransaction();

            $nombre = $request->input('nombre');
            $descripcion = $request->input('descripcion');

            $rol = DB::table('rol')
                ->where('nombre', '=', $nombre)
                ->where('estado', '=', 'A')
                ->get();

            if (sizeof($rol) > 0) {
                DB::rollBack();
                return response()->json([
                    'response' => -1,
                ]);
            }

            $data = new GrupoUsuario();
            $data->nombre = $nombre;
            $data->descripcion = $descripcion;
            $mytime = Carbon::now('America/La_paz');
            $data->fecha = $mytime->toDateString();
            $data->hora = $mytime->toTimeString();
            $data->save();
            
            $array_permiso = DB::table('permiso')
                ->where('estado', '=', 'A')
                ->orderBy('id', 'asc')
                ->get();
            
            foreach ($array_permiso as $permiso) {
                $detalle = new PermisoDetalle();
                $detalle->idrol = $data->id;
                $detalle->idpermiso = $permiso->id;
                $detalle->estado = 'N';
                $detalle->save();
            }

            $array_usuario = json_decode($request->input('array_usuario', '[]'));

            foreach ($array_usuario as $key => $idusuario) {

                $detallerol = DB::table('detalle_rol')
                    ->select('id', 'idusuario', 'idrol', 'estado')
                    ->where('idusuario', '=', $idusuario)
                    ->first();

                if ($detallerol != null) {
                    $detalle = GrupoUsuarioDetalle::find($detallerol->id);
                    $detalle->idrol = $data->id;
                    $detalle->estado = 'A';
                    $detalle->update();
                } else {
                    $detalle = new GrupoUsuarioDetalle();
                    $detalle->idrol = $data->id;
                    $detalle->idusuario = $idusuario;
                    $detalle->estado = 'A';
                    $detalle->save();
                }

            }

            $array_permiso = DB::table('detalle_permiso as det')
                ->leftJoin('permiso as perm', 'det.idpermiso', '=', 'perm.id')
                ->select('det.id', 'perm.nombre', 'det.estado')
                ->where('det.idrol', '=', $data->id)
                ->orderBy('perm.id', 'asc')
                ->get();

            $rol = DB::table('rol')
                ->where('estado', '=', 'A')
                ->orderBy('id', 'desc')
                ->get();

            DB::commit();

            return response()->json([
                'response'      => 1,
                'data'          => $data,
                'rol'           => $rol,
                'array_permiso' => $array_permiso,
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

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            
            $data = DB::table('rol')
                ->where('id', '=', $id)
                ->first();

            $consulta = DB::select(
                'select *
                    from permiso as p
                    where p.id not in 
                    (select d.idpermiso 
                        from detalle_permiso as d
                        where d.idrol = '.$id.' 
                    )'
            );

            if (sizeof($consulta) > 0) {
                
                foreach ($consulta as $c) {
                    $detalle = new PermisoDetalle();
                    $detalle->idrol = $id;
                    $detalle->idpermiso = $c->id;
                    $detalle->estado = 'N';
    
                    $detalle->save();
    
                }
            }

            $permiso = DB::table('detalle_permiso as d')
                ->join('permiso as p', 'd.idpermiso', '=', 'p.id')
                ->select('d.id', 'p.nombre', 'd.estado')
                ->where('d.idrol', '=', $id)
                ->orderBy('p.id', 'asc')
                ->get();

            return response()->json([
                'response' => 1,
                'data' => $data,
                'permiso' => $permiso,
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
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }
            
            $data = DB::table('rol')
                ->select('id', 'nombre', 'descripcion', 'estado')
                ->where('id', '=', $id)
                ->first();

                $array_usuario = DB::table('users as user')
                ->leftJoin('detalle_rol as det', 'user.id', '=', 'det.idusuario')
                ->select('user.id', 'user.usuario', 'user.nombre', 'user.apellido', 'user.imagen', 'user.genero')
                ->where(function ($query) use ($id) {
                    return $query->orWhere('det.estado', '=', 'N')
                        ->orWhereNull('det.estado');
                })
                ->where('user.estado', '=', 'A')
                ->orderBy('user.id', 'desc')
                ->get();

            $usuario_activo = DB::table('detalle_rol as det')
                ->leftJoin('users as user', 'det.idusuario', '=', 'user.id')
                ->select('user.id', 'user.usuario', 'user.nombre', 'user.apellido', 'user.imagen', 'user.genero')
                ->where([ ['det.idrol', '=', $id], ['det.estado', '=', 'A'] ])
                ->get();

            return response()->json([
                'response' => 1,
                'data'     => $data,
                'array_usuario' => $array_usuario,
                'usuario_activo' => $usuario_activo,
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
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        try {

            DB::beginTransaction();

            $nombre = $request->input('nombre');
            $descripcion = $request->input('descripcion');
            $id = $request->input('id');

            $data = GrupoUsuario::find($id);

            if ($nombre != $data->nombre) {
                $rol = DB::table('rol')
                    ->where('nombre', '=', $nombre)
                    ->where('estado', '=', 'A')
                    ->get();

                if (sizeof($rol) > 0) {
                    DB::rollBack();
                    return response()->json([
                        'response' => -1,
                    ]);
                }
            }

            $data->nombre = $nombre;
            $data->descripcion = $descripcion;
            $data->update();

            $array_rol = DB::table('detalle_rol')
                ->select('id', 'idusuario', 'idrol', 'estado')
                ->where('idrol', '=', $id)
                ->get();

            foreach ($array_rol as $key => $rol) {
                $detalle = GrupoUsuarioDetalle::find($rol->id);
                $detalle->estado = 'N';
                $detalle->update();
            }

            $array_usuario = json_decode($request->input('array_usuario', '[]'));

            foreach ($array_usuario as $key => $idusuario) {

                $detallerol = DB::table('detalle_rol')
                    ->select('id', 'idusuario', 'idrol', 'estado')
                    ->where('idusuario', '=', $idusuario)
                    ->first();

                if ($detallerol != null) {
                    $detalle = GrupoUsuarioDetalle::find($detallerol->id);
                    $detalle->idrol = $data->id;
                    $detalle->estado = 'A';
                    $detalle->update();
                } else {
                    $detalle = new GrupoUsuarioDetalle();
                    $detalle->idrol = $data->id;
                    $detalle->idusuario = $idusuario;
                    $detalle->estado = 'A';
                    $detalle->save();
                }

            }

            $array_permiso = DB::select(
                'SELECT * FROM permiso AS perm
                    WHERE perm.id NOT IN 
                    (SELECT det.idpermiso  FROM detalle_permiso AS det
                        WHERE det.idrol = '.$id.')'
            );

            if (sizeof($array_permiso) > 0) {
                
                foreach ($array_permiso as $permiso) {

                    $detalle = new PermisoDetalle();
                    $detalle->idrol = $id;
                    $detalle->idpermiso = $permiso->id;
                    $detalle->estado = 'N';
                    $detalle->save();
    
                }
            }

            DB::commit();
            return response()->json([
                'response' => 1,
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

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        try {

            DB::beginTransaction();

            $idrol = $request->input('idrol', null);

            $value = DB::table('detalle_rol')
                ->where('idrol', '=', $idrol)
                ->where('estado', '=', 'A')
                ->get();

            if (sizeof($value) > 0) {
                DB::rollBack();
                return response()->json([
                    'response' => -1,
                ]);
            }

            $data = GrupoUsuario::findOrFail($idrol);
            $data->estado = 'N';
            $data->update();

            $data = DB::table('rol')
                ->select('id', 'nombre', 'descripcion', 'estado')
                ->where('estado', '=', 'A')
                ->orderBy('id', 'asc')
                ->paginate(10);

            DB::commit();

            return response()->json([
                'response' => 1,
                'data' => $data,
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
