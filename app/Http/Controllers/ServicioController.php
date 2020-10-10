<?php

namespace App\Http\Controllers;

use App\Servicio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ServicioController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    //1. cual es el proposito del ccmi
    //2. explicar las caracteristicas esenciales de los nivel del ccmi

    public function get_data(Request $request) {
        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }

            $search = $request->input('search', null);

            $servicio = DB::table('servicio as serv')
                ->where('serv.estado', '=', 'A')
                ->whereNull('serv.deleted_at')
                ->orderBy('serv.id', 'desc')
                ->paginate(10);
            
            $categoria = DB::table('categoria as cat')
                ->where('cat.estado', '=', 'A')
                ->whereNull('cat.deleted_at')
                ->orderBy('cat.id', 'desc')
                ->paginate(10);

            return response()->json([
                'response' => 1,
                //'visitasitio' => $this->getvisitasitio(1),
                'servicio' => $servicio,
                'categoria' => $categoria,
                'servicio_pagination' => [
                    'total'        => $servicio->total(),
                    'current_page' => $servicio->currentPage(),
                    'per_page'     => $servicio->perPage(),
                    'last_page'    => $servicio->lastPage(),
                    'from'         => $servicio->firstItem(),
                    'to'           => $servicio->lastItem(),
                ],
                'categoria_pagination' => [
                    'total'        => $categoria->total(),
                    'current_page' => $categoria->currentPage(),
                    'per_page'     => $categoria->perPage(),
                    'last_page'    => $categoria->lastPage(),
                    'from'         => $categoria->firstItem(),
                    'to'           => $categoria->lastItem(),
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
                $data = DB::table('servicio as serv')
                    ->select('serv.idservicio as id', 'serv.nombre', 'serv.descripcion', 'serv.precio', 'serv.imagen', 'serv.estado')
                    ->where('serv.estado', '=', 'A')
                    ->whereNull('serv.deleted_at')
                    ->orderBy('serv.idservicio', 'desc')
                    ->paginate(10);
            }else {
                $data = DB::table('servicio as serv')
                    ->select('serv.idservicio as id', 'serv.nombre', 'serv.descripcion', 'serv.precio', 'serv.imagen', 'serv.estado')
                    ->where(function ($query) use ($search) {
                        return $query
                            ->orWhere('serv.nombre', 'LIKE', '%'.$search.'%');
                    })
                    ->where('serv.estado', '=', 'A')
                    ->whereNull('serv.deleted_at')
                    ->orderBy('serv.idservicio', 'desc')
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

            $data = DB::table('categoria')
                ->select('idcategoria as id', 'nombre as descripcion', 'estado')
                ->where('estado', '=', 'A')->get();

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
            $descripcion = $request->input('descripcion');
            $precio = $request->input('precio');
            $foto = $request->input('foto');

            $idcategoria = $request->input('idcategoria');

            $value = Servicio::where([ ['nombre', '=', $nombre], ['estado', '=', 'A'] ])->get();

            if (sizeof($value) > 0) {
                DB::rollBack();
                return response()->json([
                    'response' => -1,
                ]);
            }

            $data = new Servicio();
            $data->nombre = $nombre;
            $data->fkidcategoria = $idcategoria;
            $data->descripcion = $descripcion;
            $data->precio = $precio;
            $data->imagen = $foto;
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
        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }
            
            $data = DB::table('servicio as serv')
                ->leftJoin('categoria as cat', 'serv.fkidcategoria', '=', 'cat.idcategoria')
                ->select('serv.idservicio as id', 'serv.fkidcategoria as idcategoria', 'serv.nombre', 'serv.descripcion', 'serv.imagen',
                    'serv.precio', 'cat.nombre as categoria'
                )
                ->where('serv.idservicio', '=', $id)
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
            
            $data = DB::table('servicio as serv')
                ->leftJoin('categoria as cat', 'serv.fkidcategoria', '=', 'cat.idcategoria')
                ->select('serv.idservicio as id', 'serv.fkidcategoria as idcategoria', 'serv.nombre', 'serv.descripcion', 'serv.imagen',
                    'serv.precio', 'cat.nombre as categoria'
                )
                ->where('serv.idservicio', '=', $id)
                ->first();

            $categoria = DB::table('categoria')
                ->select('idcategoria as id', 'nombre as descripcion', 'estado')
                ->where('estado', '=', 'A')->get();

            return response()->json([
                'response' => 1,
                'data' => $data,
                'categoria' => $categoria,
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
            $precio = $request->input('precio');
            $foto = $request->input('foto');

            $idcategoria = $request->input('idcategoria');

            $data = Servicio::findOrFail($request->input('id'));

            if ($data->nombre != $nombre) {
                $value = Servicio::where([ ['nombre', '=', $nombre], ['estado', '=', 'A'] ])->get();

                if (sizeof($value) > 0) {
                    DB::rollBack();
                    return response()->json([
                        'response' => -1,
                    ]);
                }
            }

            $data->nombre = $nombre;
            $data->fkidcategoria = $idcategoria;
            $data->descripcion = $descripcion;
            $data->precio = $precio;
            if ($foto != null) {
                $data->imagen = $foto;
            }
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
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        try {

            DB::beginTransaction();

            $idservicio = $request->input('idservicio');

            $value = DB::table('solicituddetalle')
                ->where('fkidservicio', '=', $idservicio)
                ->where('estado', '=', 'A')
                ->whereNull('deleted_at')
                ->get();

            if (sizeof($value) > 0) {
                DB::rollBack();
                return response()->json([
                    'response'  => -1,
                ]);
            }

            $data = Servicio::findOrFail($idservicio); //deleted_at o estado ?
            $data->estado = 'N';
            $data->update();

            $data = DB::table('servicio as serv')
                ->select('serv.idservicio as id', 'serv.nombre', 'serv.descripcion', 'serv.precio', 'serv.imagen', 'serv.estado')
                ->where('serv.estado', '=', 'A')
                ->whereNull('serv.deleted_at')
                ->orderBy('serv.idservicio', 'desc')
                ->paginate(10);

            DB::commit();

            return response()->json([
                'response'  => 1,
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

    public function search_servicio(Request $request)
    {
        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }

            $search = $request->input('search');

            $data = DB::table('servicio as serv')
                ->select('serv.idservicio as id', 'serv.nombre', 'serv.descripcion', 'serv.precio', 'serv.imagen', 'serv.estado')
                ->where(function ($query) use ($search) {
                    return $query
                        ->orWhere('serv.nombre', 'LIKE', '%'.$search.'%');
                })
                ->where('serv.estado', '=', 'A')
                ->whereNull('serv.deleted_at')
                ->orderBy('serv.idservicio', 'desc')
                ->paginate(20);

            return response()->json([
                'response'  => 1,
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
