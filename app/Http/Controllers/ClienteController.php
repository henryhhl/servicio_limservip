<?php

namespace App\Http\Controllers;

use App\Cliente;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class ClienteController extends Controller
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
                $data = DB::table('cliente as cli')
                    ->leftJoin('users as user', 'cli.idusuario', '=', 'user.id')
                    ->select('cli.id', 'user.nombre', 'user.apellido', 'user.usuario','cli.nit', 'cli.contacto', 
                        'user.imagen', 'user.email'
                    )
                    ->where('cli.estado', '=', 'A')
                    ->whereNull('cli.deleted_at')
                    ->orderBy('cli.id', 'desc')
                    ->paginate(10);
            }else {
                $data = DB::table('cliente as cli')
                    ->leftJoin('users as user', 'cli.idusuario', '=', 'user.id')
                    ->select('cli.id', 'user.nombre', 'user.apellido', 'user.usuario','cli.nit', 'cli.contacto', 
                        'user.imagen', 'user.email'
                    )
                    ->where(function ($query) use ($search) {
                        return $query->orWhere(DB::raw("CONCAT(user.nombre, ' ',user.apellido)"), 'LIKE', "%".$search."%")
                            ->orWhere('user.nombre', 'LIKE', '%'.$search.'%')
                            ->orWhere('user.apellido', 'LIKE', '%'.$search.'%')
                            ->orWhere('user.email', 'LIKE', '%'.$search.'%')
                            ->orWhere('cli.nit', 'LIKE', '%'.$search.'%')
                            ->orWhere('user.usuario', 'LIKE', '%'.$search.'%');
                    })
                    ->where('cli.estado', '=', 'A')
                    ->whereNull('cli.deleted_at')
                    ->orderBy('cli.id', 'desc')
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

            return response()->json([
                'response'  => 1,
                //'visitasitio' => $this->getvisitasitio(2),
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
            $nit = $request->input('nit');
            $email = $request->input('email');
            $contacto = $request->input('contacto');
            $foto = $request->input('foto');
            $usuario = $request->input('usuario');
            $password = $request->input('password');

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
            $user->usuario = $usuario;
            $user->imagen = $foto;
            $user->password = bcrypt($password);
            $user->save();

            $data = new Cliente();
            $data->idusuario = $user->id;
            $data->nit = $nit;
            $data->contacto = $contacto;
            $data->save();

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
        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }
            
            $data = DB::table('cliente as cli')
                ->leftJoin('users as user', 'cli.idusuario', '=', 'user.id')
                ->select('cli.id', 'user.nombre', 'user.apellido', 'user.usuario','cli.nit', 'cli.contacto', 
                    'user.imagen', 'user.email', 'user.password'
                )
                ->where('cli.id', '=', $id)
                ->first();


            return response()->json([
                'response' => 1,
                'data' => $data,
                //'visitasitio' => $this->getvisitasitio(3),
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
            $nit = $request->input('nit');
            $email = $request->input('email');
            $contacto = $request->input('contacto');
            $foto = $request->input('foto');
            $password = $request->input('password');

            $data = Cliente::findOrFail($request->input('id'));
            $data->nit = $nit;
            $data->contacto = $contacto;
            $data->update();

            $user = User::findOrFail($data->idusuario);
            $user->nombre = $nombre;
            $user->apellido = $apellido;
            $user->email = $email;
            if ($foto != null) {
                $user->imagen = $foto;
            }
            $user->password = bcrypt($password);
            $user->update();

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
    public function destroy($id)
    {
        //
    }
}
