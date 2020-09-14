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
                    ->where('serv.estado', '=', 'A')
                    ->whereNull('serv.deleted_at')
                    ->orderBy('serv.id', 'desc')
                    ->paginate(10);
            }else {
                $data = DB::table('servicio as serv')
                    ->where(function ($query) use ($search) {
                        return $query
                            ->orWhere('serv.nombre', 'LIKE', '%'.$search.'%');
                    })
                    ->where('serv.estado', '=', 'A')
                    ->whereNull('serv.deleted_at')
                    ->orderBy('serv.id', 'desc')
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
            $descripcion = $request->input('descripcion');
            $precio = $request->input('precio');
            $foto = $request->input('foto');

            $value = Servicio::where([ ['nombre', '=', $nombre], ['estado', '=', 'A'] ])->get();

            if (sizeof($value) > 0) {
                DB::rollBack();
                return response()->json([
                    'response' => -1,
                ]);
            }

            $data = new Servicio();
            $data->nombre = $nombre;
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
                ->where('serv.id', '=', $id)
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
                ->where('serv.id', '=', $id)
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
            $descripcion = $request->input('descripcion');
            $precio = $request->input('precio');
            $foto = $request->input('foto');

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
    public function destroy($id)
    {
        //
    }
}
