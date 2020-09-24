<?php

namespace App\Http\Controllers;

use App\GrupoUsuario;
use App\GrupoUsuarioDetalle;
use App\Personal;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PersonalController extends Controller
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
                $data = DB::table('personal as pers')
                    ->leftJoin('users as user', 'pers.idusuario', '=', 'user.id')
                    ->select('pers.id', 'user.nombre', 'user.apellido', 'user.usuario', 'pers.contacto', 
                        'user.imagen', 'user.email', 'pers.ci', 'pers.ciudad', 'pers.direccion'
                    )
                    ->where('pers.estado', '=', 'A')
                    ->whereNull('pers.deleted_at')
                    ->orderBy('pers.id', 'desc')
                    ->paginate(10);
            }else {
                $data = DB::table('personal as pers')
                    ->leftJoin('users as user', 'pers.idusuario', '=', 'user.id')
                    ->select('pers.id', 'user.nombre', 'user.apellido', 'user.usuario', 'pers.contacto', 
                        'user.imagen', 'user.email', 'pers.ci', 'pers.ciudad', 'pers.direccion'
                    )
                    ->where(function ($query) use ($search) {
                        return $query->orWhere(DB::raw("CONCAT(user.nombre, ' ',user.apellido)"), 'LIKE', "%".$search."%")
                            ->orWhere('user.nombre', 'LIKE', '%'.$search.'%')
                            ->orWhere('user.apellido', 'LIKE', '%'.$search.'%')
                            ->orWhere('user.email', 'LIKE', '%'.$search.'%')
                            ->orWhere('user.usuario', 'LIKE', '%'.$search.'%');
                    })
                    ->where('pers.estado', '=', 'A')
                    ->whereNull('pers.deleted_at')
                    ->orderBy('pers.id', 'desc')
                    ->paginate(10);
            }

            return response()->json([
                'response' => 1,
                //'visitasitio' => $this->getvisitasitio(1),
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

            $data = GrupoUsuario::select('id', 'nombre', 'descripcion')
                ->where([ ['estado', '=', 'A'], ['id', '<>', '1'], ['id', '<>', '3'] ])
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
            $apellido = $request->input('apellido');
            $ci = $request->input('ci');
            $ciudad = $request->input('ciudad');
            $direccion = $request->input('direccion');
            $nacimiento = $request->input('nacimiento');
            $email = $request->input('email');
            $contacto = $request->input('contacto');
            $foto = $request->input('foto');
            $usuario = $request->input('usuario');
            $password = $request->input('password');

            $idrol = $request->input('idrol');

            $value = User::where('usuario', '=', $usuario)->get();

            if (sizeof($value) > 0) {
                DB::rollBack();
                return response()->json([
                    'response' => -1,
                ]);
            }


            $user = new User();
            $user->nombre = $nombre;
            $user->apellido = $apellido;
            $user->email = $email;
            $user->nacimiento = $nacimiento;
            $user->usuario = $usuario;
            $user->imagen = $foto;
            $user->password = bcrypt($password);
            $user->save();

            $data = new Personal();
            $data->idusuario = $user->id;
            $data->ci = $ci;
            $data->ciudad = $ciudad;
            $data->direccion = $direccion;
            $data->contacto = $contacto;
            $data->save();

            $grupousuario = new GrupoUsuarioDetalle();
            $grupousuario->idrol = $idrol;
            $grupousuario->idusuario = $user->id;
            $grupousuario->estado = 'A';
            $grupousuario->save();

            DB::commit();

            return response()->json([
                'response'      => 1,
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

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }
            
            $data = DB::table('personal as pers')
                ->leftJoin('users as user', 'pers.idusuario', '=', 'user.id')
                ->select('pers.id', 'user.nombre', 'user.apellido', 'user.usuario', 'pers.contacto', 'user.password',
                    'user.imagen', 'user.email', 'user.nacimiento', 'pers.ci', 'pers.ciudad', 'pers.direccion'
                )
                ->where('pers.id', '=', $id)
                ->first();


            return response()->json([
                'response' => 1,
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
            
            $data = DB::table('personal as pers')
                ->leftJoin('users as user', 'pers.idusuario', '=', 'user.id')
                ->select('pers.id', 'user.nombre', 'user.apellido', 'user.usuario', 'pers.contacto', 'user.password',
                    'user.imagen', 'user.email', 'user.nacimiento', 'pers.ci', 'pers.ciudad', 'pers.direccion', 'user.id as idusuario'
                )
                ->where('pers.id', '=', $id)
                ->first();

            $array_rol = GrupoUsuario::select('id', 'nombre', 'descripcion')
                ->where([ ['estado', '=', 'A'], ['id', '<>', '1'], ['id', '<>', '3'] ])
                ->get();

            $rol = DB::table('detalle_rol as det')
                ->leftJoin('rol as r', 'det.idrol', '=', 'r.id')
                ->select('r.id', 'r.nombre', 'r.descripcion')
                ->where('det.idusuario', '=', $data->idusuario)
                ->where('det.estado', '=', 'A')
                ->first();


            return response()->json([
                'response' => 1,
                'data' => $data,
                'array_rol' => $array_rol,
                'rol' => $rol,
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
            $apellido = $request->input('apellido');
            $ci = $request->input('ci');
            $ciudad = $request->input('ciudad');
            $direccion = $request->input('direccion');
            $nacimiento = $request->input('nacimiento');
            $email = $request->input('email');
            $contacto = $request->input('contacto');
            $foto = $request->input('foto');
            $usuario = $request->input('usuario');
            $password = $request->input('password');

            $idrol = $request->input('idrol');

            $data = Personal::findOrFail($request->input('id'));
            $data->ci = $ci;
            $data->ciudad = $ciudad;
            $data->direccion = $direccion;
            $data->contacto = $contacto;
            $data->update();

            $user = User::findOrFail($data->idusuario);
            $user->nombre = $nombre;
            $user->apellido = $apellido;
            $user->nacimiento = $nacimiento;
            $user->email = $email;
            if ($foto != null) {
                $user->imagen = $foto;
            }
            $user->password = bcrypt($password);
            $user->update();

            $rol_usuario = DB::table('detalle_rol')
                ->select('id', 'idrol', 'idusuario', 'estado')
                ->where('idusuario', '=', $data->idusuario)
                ->first();

            if ($rol_usuario == null) {

                $detalle = new GrupoUsuarioDetalle();
                $detalle->idrol = $idrol;
                $detalle->idusuario = $data->idusuario;
                $detalle->estado = 'A';
                $detalle->save();

            }else {
                $detalle = GrupoUsuarioDetalle::find($rol_usuario->id);
                $detalle->estado = 'A';
                $detalle->idrol = $idrol;
                $detalle->update();
            }

            DB::commit();

            return response()->json([
                'response'      => 1,
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

            $idpersonal = $request->input('idpersonal');

            $data = Personal::findOrFail($idpersonal);

            $data->estado = 'N';
            $data->update();

            $data = DB::table('personal as pers')
                ->leftJoin('users as user', 'pers.idusuario', '=', 'user.id')
                ->select('pers.id', 'user.nombre', 'user.apellido', 'user.usuario', 'pers.contacto', 
                    'user.imagen', 'user.email', 'pers.ci', 'pers.ciudad', 'pers.direccion'
                )
                ->where('pers.estado', '=', 'A')
                ->whereNull('pers.deleted_at')
                ->orderBy('pers.id', 'desc')
                ->paginate(10);

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
}
