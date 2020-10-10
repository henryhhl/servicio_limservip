<?php

namespace App\Http\Controllers;

use App\Categoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CategoriaController extends Controller
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
                $data = DB::table('categoria as cat')
                    ->select('cat.idcategorias as id', 'cat.nombre as descripcion', 'cat.estado')
                    ->where('cat.estado', '=', 'A')
                    ->whereNull('cat.deleted_at')
                    ->orderBy('cat.idcategoria', 'desc')
                    ->paginate(10);
            }else {
                $data = DB::table('categoria as cat')
                    ->select('cat.idcategoria as id', 'cat.nombre ad descripcion', 'cat.estado')
                    ->where(function ($query) use ($search) {
                        return $query
                            ->orWhere('cat.descripcion', 'LIKE', '%'.$search.'%');
                    })
                    ->where('cat.estado', '=', 'A')
                    ->whereNull('cat.deleted_at')
                    ->orderBy('cat.idcategoria', 'desc')
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

            $descripcion = $request->input('descripcion');

            $value = Categoria::where('nombre', '=', $descripcion)->where('estado', '=', 'A')->get();

            if (sizeof($value) > 0) {
                DB::rollBack();
                return response()->json([
                    'response' => -1,
                ]);
            }


            $data = new Categoria();
            $data->nombre = $descripcion;
            $data->save();

            $categoria = DB::table('categoria')
                ->where('estado', '=', 'A')
                ->orderBy('idcategoria', 'desc')
                ->get();

            DB::commit();

            return response()->json([
                'response'   => 1,
                'categoria'  => $categoria,
                'data'  => $data,
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
            
            $data = DB::table('categoria as cat')
                ->select('cat.idcategoria as id', 'cat.nombre as descripcion', 'cat.estado')
                ->where('cat.idcategoria', '=', $id)
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

            $descripcion = $request->input('descripcion');
            $idcategoria = $request->input('idcategoria');

            $data = Categoria::findOrFail($idcategoria);

            if ($data->nombre != $descripcion) {
                $value = Categoria::where('nombre', '=', $descripcion)->where('estado', '=', 'A')->get();

                if (sizeof($value) > 0) {
                    DB::rollBack();
                    return response()->json([
                        'response' => -1,
                    ]);
                }
            }

            $data->nombre = $descripcion;
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

            $idcategoria = $request->input('idcategoria', null);

            $categoria = Categoria::findOrFail($idcategoria);
            $categoria->estado = 'N';
            $categoria->update();

            $data = DB::table('categoria as cat')
                ->select('cat.idcategoria as id', 'cat.nombre as descripcion', 'cat.estado')
                ->where('cat.estado', '=', 'A')
                ->whereNull('cat.deleted_at')
                ->orderBy('cat.idcategoria', 'desc')
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
