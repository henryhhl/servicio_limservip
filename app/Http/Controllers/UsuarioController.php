<?php

namespace App\Http\Controllers;

use App\Ajuste;
use App\Events\NotificacionEvent;
use App\GrupoUsuarioDetalle;
use App\GrupoUsuario;
use App\Notificacion;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;

class UsuarioController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    //comentario  2
    public function inicio(Request $request) {
        
        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }

            $fechainicio = $request->input('fechainicio');
            $fechafin = $request->input('fechafin');

            $fechainiciomes = $request->input('fechainiciomes');
            $fechafinmes = $request->input('fechafinmes');

            $solicitud = DB::table('solicitud as soli')
                ->select( 
                    DB::raw("DATE_TRUNC('day', soli.fecha) as dia"), DB::raw("COUNT(*) as cantidad")
                    // DB::raw("DAY(soli.fecha) as dia"), DB::raw("COUNT(*) as cantidad")
                )
                ->where('soli.estado', '=', 'A')
                ->where([ ['soli.fecha', '>=', $fechainicio], ['soli.fecha', '<=', $fechafin] ])
                ->whereNull('soli.deleted_at')
                ->groupBy('soli.fecha')
                ->orderBy('soli.fecha')
                ->get();

            $solicitud_mes = DB::table('solicitud as soli')
                ->select( 
                    DB::raw("DATE_TRUNC('month', soli.fecha) as mes"), DB::raw("COUNT(*) as cantidad")
                    // DB::raw("MONTH(soli.fecha) as mes"), DB::raw("COUNT(*) as cantidad")
                )
                ->where('soli.estado', '=', 'A')
                ->where([ ['soli.fecha', '>=', $fechainiciomes], ['soli.fecha', '<=', $fechafinmes] ])
                ->whereNull('soli.deleted_at')
                ->groupBy('soli.fecha')
                ->orderBy('soli.fecha')
                ->get();


            $data = DB::table('solicitud as sol')
                ->leftJoin('users as user', 'sol.fkidusuario', '=', 'user.id')
                ->leftJoin('informacion as info', 'sol.idsolicitud', '=', 'info.fkidsolicitud')
                ->leftJoin('solicituddetalle as soldet', 'sol.idsolicitud', '=', 'soldet.fkidsolicitud')
                ->leftJoin('asignartrabajo as asignar', 'soldet.idsolicituddetalle', '=', 'asignar.fkidsolicituddetalle')
                ->leftJoin('asignardetalle as asignardet', 'asignar.idasignartrabajo', '=', 'asignardet.fkidasignartrabajo')
                ->leftJoin('personal as pers', 'asignardet.fkidpersonal', '=', 'pers.idpersonal')
                ->select( 'sol.idsolicitud as id', 'sol.montototal', 'sol.estadoproceso', 'sol.fecha', 'sol.hora', 'sol.nota',
                    'user.nombre as usuario', 'user.apellido as apellidouser',
                    'info.nombre', 'info.apellido', 'info.pais', 'info.ciudad', 'info.direccion', 'info.direccioncompleto',
                    'info.telefono', 'info.email'
                )
                ->where('sol.estado', '=', 'A')
                ->where('sol.estadoproceso', '=', 'E')
                ->where('pers.fkidusuario', '=', Auth::user()->id)
                ->whereNull('sol.deleted_at')
                ->orderBy('sol.idsolicitud', 'desc')
                ->get();
            
            return response()->json([
                'response' => 1,
                'solicitud' => $solicitud,
                'solicitud_mes' => $solicitud_mes,
                'data' => $data,
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

    public function perfil() {
        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }

            $usuario = DB::table('users as user')
                ->leftJoin('detalle_rol as det', 'user.id', '=', 'det.fkidusuario')
                ->leftJoin('rol as grupo', 'det.fkidrol', '=', 'grupo.idrol')
                ->select('grupo.nombre as rol', 'grupo.descripcion', 'user.id', 
                    'user.nombre', 'user.apellido', 'user.nacimiento', 'user.usuario', 'user.imagen', 
                    'user.genero', 'user.email_verified_at as email'
                )
                ->where('user.id', '=', Auth::user()->id)
                ->first();

            return response()->json([
                'response' => 1,
                'usuario'  => $usuario,
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

    public function get_notificacion($usuario) {

        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }

            $bandera = '';

            if (file_exists( public_path() . '/notificacion/' . $usuario . '.txt' )) {

                $archivo = fopen(public_path() . '/notificacion/' . $usuario . '.txt', 'r');
                while ($linea = fgets($archivo)) {
                    $bandera .= $linea;
                }
                $bandera = preg_replace("/[\r\n|\n|\r]+/", "", $bandera);
                fclose($archivo);

            } else {
                $archivo = fopen( public_path() . '/notificacion/' . $usuario . '.txt', 'w+');
                if ( fwrite( $archivo, '' ) ) {
                    fclose( $archivo );
                }
            }
            $bandera = $bandera == '' ? [] : json_decode($bandera);

            $archivo = fopen( public_path() . '/notificacion/' . $usuario . '.txt', 'w+');
            if ( fwrite( $archivo, '' ) ) {
                fclose( $archivo );
            }

            $notificacion = [];
            if (sizeof($bandera) > 0) {
                $obj = new Notificacion();
                $notificacion = $obj->get_notificacion(Auth::user()->id);
            }

            return response()->json([
                'response' => 1,
                'bandera' => $bandera,
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

    public function get_information() {

        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }
            
            $session = app('session');
            $token = null;

            if (isset($session)) {
                $token = $session->token();
            }

            $data = Ajuste::where('fkidusuario', '=', Auth::user()->id)->orderBy('idajuste')->first();

            $rol = DB::table('detalle_rol')->where([['fkidusuario', '=', Auth::user()->id], ['estado', '=', 'A']])->first();

            $permisos = [];

            if (!is_null($rol)) {
                $permisos = DB::table('permiso as perm')
                    ->leftJoin('detalle_permiso as det', 'perm.idpermiso', '=', 'det.fkidpermiso')
                    ->select('perm.idpermiso as id', 'perm.nombre', 'det.estado')
                    ->where('det.fkidrol', '=', $rol->fkidrol)
                    ->get();
            }

            $usuario = DB::table('users as user')
                ->leftJoin('detalle_rol as det', 'user.id', '=', 'det.fkidusuario')
                ->leftJoin('rol as grupo', 'det.fkidrol', '=', 'grupo.idrol')
                ->select('grupo.nombre as rol', 'grupo.descripcion', 'user.id', 
                    'user.nombre', 'user.apellido', 'user.nacimiento', 'user.usuario', 'user.imagen', 
                    'user.genero', 'user.email_verified_at as email', 'det.fkidrol as idrol'
                )
                ->where('user.id', '=', Auth::user()->id)
                ->first();

            // event (new NotificacionEvent('mensaje', $usuario));

            $obj = new Notificacion();
            $notificacion = $obj->get_notificacion($usuario->id);

            return response()->json([
                'response' => 1,
                'token'    => $token,
                'usuario'  => $usuario,
                'ajuste'   => $data,
                'permiso'   => $permisos,
                'notificacion'   => $notificacion,
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

    public function update_notificacion($id) {
        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }

            $obj = new Notificacion();
            $data = $obj->desactivar($id);

            $idusuario = Auth::user()->id;

            $notificacion = $obj->get_notificacion($idusuario);

            return response()->json([
                'response' => 1,
                'notificacion'  => $notificacion,
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
            $number = is_numeric($search) ? $search : -1;

            if ($search == null) {

                $data = DB::table('users as user')
                    ->leftJoin('detalle_rol as det', 'user.id', '=', 'det.fkidusuario')
                    ->leftJoin('rol as grupousuario', 'det.fkidrol', '=', 'grupousuario.idrol')
                    ->select('user.id', 'user.nombre', 'user.apellido', 'user.usuario', 'user.nacimiento', 
                        'user.genero', 'user.tipo', 'user.estado', 'grupousuario.nombre as rol'
                    )
                    ->where('user.estado', '=', 'A')
                    ->orderBy('user.id', 'desc')
                    ->paginate(10);

            }else {

                $data = DB::table('users as user')
                    ->leftJoin('detalle_rol as det', 'user.id', '=', 'det.fkidusuario')
                    ->leftJoin('rol as grupousuario', 'det.fkidrol', '=', 'grupousuario.idrol')
                    ->select('user.id', 'user.nombre', 'user.apellido', 'user.usuario', 'user.nacimiento', 
                        'user.genero', 'user.tipo', 'user.estado', 'grupousuario.nombre as rol'
                    )
                    ->where(function ($query) use ($search, $number) {
                        return $query->orWhere(DB::raw("CONCAT(user.nombre, ' ',user.apellido)"), 'LIKE', "%".$search."%")
                            ->orWhere('user.nombre', 'LIKE', '%'.$search.'%')
                            ->orWhere('user.usuario', 'LIKE', '%'.$search.'%')
                            ->orWhere('user.apellido', 'LIKE', '%'.$search.'%');
                    })
                    ->where('user.estado', '=', 'A')
                    ->orderBy('user.id', 'desc')
                    ->paginate(10);

            }

            return response()->json([
                'response'   => 1,
                'data'       => $data,
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

            $data = GrupoUsuario::select('idrol as id', 'nombre', 'descripcion')->where('estado', '=', 'A')->get();

            return response()->json([
                'response'  => 1,
                'data'      => $data,
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
            $genero = $request->input('genero');
            $nacimiento = $request->input('nacimiento');

            $usuario = $request->input('usuario');
            $password = $request->input('password');
            $idrol = $request->input('idrol', null);

            $rol = DB::table('users')
                ->where('usuario', '=', $usuario)
                ->where('estado', '=', 'A')
                ->get();

            if (sizeof($rol) > 0) {
                return response()->json([
                    'response' => -1,
                ]);
            }

            $registro = date('Y').date('d').date('m').date('h').date('i').date('s');
            $rutadelarchivo = null;

            if (Input::hasFile('imagen')){
            
                $imagen = $request->file('imagen');
                $name = $imagen->getClientOriginalName();
                $extension = $imagen->getClientOriginalExtension();
                $nuevoNombre = 'usuario-'.$registro.'.'.$extension;

                $rutadelarchivo = '/img/usuario/'.$nuevoNombre;

                $archivo = Input::file('imagen');
                $archivo->move(public_path().'/img/usuario/', $nuevoNombre);

            }

            $data = new User();
            $data->nombre = $nombre;
            $data->apellido = $apellido;
            $data->nacimiento = $nacimiento;
            $data->genero = $genero;

            $data->usuario = $usuario;
            $data->password = bcrypt($password);
            $data->imagen = $request->input('foto');
            $data->tipo = 'S';
            $data->save();

            if ($idrol != null) {
                
                $detalle = new GrupoUsuarioDetalle();
                $detalle->fkidrol = $idrol;
                $detalle->fkidusuario = $data->id;
                $detalle->estado = 'A';
                $detalle->save();
                
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

    public function update_perfil(Request $request) {

        try {
            DB::beginTransaction();

            $nombre = $request->input('nombre');
            $apellido = $request->input('apellido');
            $genero = $request->input('genero');
            $nacimiento = $request->input('nacimiento');
            $email = $request->input('email');
            $img = $request->input('imagen');

            $registro = date('Y').date('d').date('m').date('h').date('i').date('s');
            $rutadelarchivo = null;

            if (Input::hasFile('foto')){
            
                $imagen = $request->file('foto');
                $name = $imagen->getClientOriginalName();
                $extension = $imagen->getClientOriginalExtension();
                $nuevoNombre = 'usuario-'.$registro.'.'.$extension;

                $rutadelarchivo = '/img/usuario/'.$nuevoNombre;

                $archivo = Input::file('foto');
                $archivo->move(public_path().'/img/usuario/', $nuevoNombre);

            }

            $data = User::find(Auth::user()->id);
            $data->nombre = $nombre;
            $data->apellido = $apellido;
            $data->nacimiento = $nacimiento;
            $data->genero = $genero;
            $data->email = $email;
            $data->imagen = $img;
            $data->update();

            $usuario = DB::table('users as user')
                ->leftJoin('detalle_rol as det', 'user.id', '=', 'det.fkidusuario')
                ->leftJoin('rol as grupo', 'det.fkidrol', '=', 'grupo.idrol')
                ->select('grupo.nombre as rol', 'grupo.descripcion', 'user.id', 
                    'user.nombre', 'user.apellido', 'user.nacimiento', 'user.usuario', 'user.imagen', 
                    'user.genero', 'user.email_verified_at as email'
                )
                ->where('user.id', '=', Auth::user()->id)
                ->first();

            DB::commit();

            return response()->json([
                'response' => 1,
                'usuario'  => $usuario,
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
            
            $data = DB::table('users')
                ->where('id', '=', $id)
                ->first();

            $rol = DB::table('detalle_rol')
                ->select('idroldetalle as id', 'fkidrol as idrol', 'fkidusuario as idusuario')
                ->where('fkidusuario', '=', $id)
                ->first();

            return response()->json([
                'response' => 1,
                'data' => $data,
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
            
            $data = DB::table('users')
                ->where('id', '=', $id)
                ->first();

            $rol = DB::table('detalle_rol as det')
                ->leftJoin('rol as r', 'det.fkidrol', '=', 'r.idrol')
                ->select('r.idrol as id', 'r.nombre', 'r.descripcion')
                ->where('det.fkidusuario', '=', $id)
                ->where('det.estado', '=', 'A')
                ->first();

            $array_rol = GrupoUsuario::select('idrol as id', 'nombre', 'descripcion')->where('estado', '=', 'A')->get();

            return response()->json([
                'response' => 1,
                'data' => $data,
                'rol' => $rol,
                'array_rol' => $array_rol,
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
            $genero = $request->input('genero');
            $nacimiento = $request->input('nacimiento');

            $usuario = $request->input('usuario');
            $password = $request->input('password');
            $idrol = $request->input('idrol', null);

            $id = $request->input('id');

            $registro = date('Y').date('d').date('m').date('h').date('i').date('s');
            $rutadelarchivo = null;

            if (Input::hasFile('imagen')){
                $imagen = $request->file('imagen');
                $name = $imagen->getClientOriginalName();
                $extension = $imagen->getClientOriginalExtension();
                $nuevoNombre = 'usuario-'.$registro.'.'.$extension;

                $rutadelarchivo = '/img/usuario/'.$nuevoNombre;

                $archivo = Input::file('imagen');
                $archivo->move(public_path().'/img/usuario/', $nuevoNombre);
            }

            $data = User::find($id);
            $data->nombre = $nombre;
            $data->apellido = $apellido;
            $data->nacimiento = $nacimiento;
            $data->genero = $genero;
            $data->usuario = $usuario;
            $data->password = bcrypt($password);
            if ($rutadelarchivo != null) {
                $data->imagen = $request->input('foto');
            }
            $data->update();

            if ($idrol != null) {

                $rol_usuario = DB::table('detalle_rol')
                    ->select('idroldetalle as id', 'fkidrol as idrol', 'fkidusuario as idusuario', 'estado')
                    ->where('fkidusuario', '=', $id)
                    ->first();

                if ($rol_usuario == null) {

                    $detalle = new GrupoUsuarioDetalle();
                    $detalle->fkidrol = $idrol;
                    $detalle->fkidusuario = $id;
                    $detalle->estado = 'A';
                    $detalle->save();

                }else {
                    $detalle = GrupoUsuarioDetalle::find($rol_usuario->id);
                    $detalle->estado = 'A';
                    $detalle->fkidrol = $idrol;
                    $detalle->update();
                }
            }else {
                $rol_usuario = DB::table('detalle_rol')
                    ->select('idroldetalle as id', 'fkidrol as idrol', 'fkidusuario as idusuario', 'estado')
                    ->where('fkidusuario', '=', $id)
                    ->first();

                if ($rol_usuario != null) {
                    $detalle = GrupoUsuarioDetalle::find($rol_usuario->id);
                    $detalle->estado = 'N';
                    $detalle->update();
                }
            }

            DB::commit();

            return response()->json([
                'response' => 1,
                'data'     => $data,
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

            $id = $request->input('idusuario');

            // $data = User::find($id);
            // $data->estado = 'N';
            // $data->update();

            $data = DB::table('users')
                ->where('estado', '=', 'A')
                ->orderBy('id', 'asc')
                ->get();

            DB::commit();

            return response()->json([
                'response' => 1,
                'data' => $data,
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
