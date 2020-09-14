<?php

namespace App\Http\Controllers;

use App\Ajuste;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AjusteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }

            $data = Ajuste::where('idusuario', '=', Auth::user()->id)->orderBy('id')->first();

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
                ],
            ]);
        }
    }

    public function search_general(Request $request) {
        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }
            $search = $request->input('search');

            $like = 'ILIKE';

            $marca = DB::table('marca')
                ->where('descripcion', $like, '%'.$search.'%')
                ->where('estado', '=', 'A')
                ->get();

            $modelo = DB::table('modelo')
                ->where('descripcion', $like, '%'.$search.'%')
                ->where('estado', '=', 'A')
                ->get();

            $color = DB::table('vehiculocolor')
                ->where('descripcion', $like, '%'.$search.'%')
                ->where('estado', '=', 'A')
                ->get();

            $vehiculo = DB::table('vehiculo')
                ->where('placa', $like, '%'.$search.'%')
                ->where('estado', '=', 'A')
                ->get();

            $categoria = DB::table('categoria')
                ->where('descripcion', $like, '%'.$search.'%')
                ->where('estado', '=', 'A')
                ->get();
            
            $articulo = DB::table('articulo')
                ->where('descripcion', $like, '%'.$search.'%')
                ->where('estado', '=', 'A')
                ->get();

            $cliente = DB::table('cliente')
                ->where(function ($query) use ($search, $like) {
                        return $query->orWhere('nombre', $like, '%'.$search.'%')
                            ->orWhere('apellido', $like, '%'.$search.'%')
                            ->orWhere('telefono', $like, '%'.$search.'%');
                    })
                ->where('estado', '=', 'A')
                ->get();

            $mecanico = DB::table('mecanico')
                ->where(function ($query) use ($search, $like) {
                    return $query->orWhere('nombre', $like, '%'.$search.'%')
                        ->orWhere('apellido', $like, '%'.$search.'%')
                        ->orWhere('telefono', $like, '%'.$search.'%');
                    })
                ->where('estado', '=', 'A')
                ->get();

            $usuario = DB::table('users')
                ->where(function ($query) use ($search, $like) {
                    return $query->orWhere('nombre', $like, '%'.$search.'%')
                        ->orWhere('apellido', $like, '%'.$search.'%')
                        ->orWhere('usuario', $like, '%'.$search.'%');
                    })
                ->where('estado', '=', 'A')
                ->get();

            $servicio = DB::table('servicio')
                ->where(function ($query) use ($search, $like) {
                    return $query->orWhere('descripcion', $like, '%'.$search.'%');
                })
                ->where('estado', '=', 'A')
                ->get();

            return response()->json([
                'response' => 1,
                'search' => $search,
                'marca' => $marca,
                'color' => $color,
                'vehiculo' => $vehiculo,
                'categoria' => $categoria,
                'articulo' => $articulo,
                'cliente' => $cliente,
                'mecanico' => $mecanico,
                'usuario' => $usuario,
                'servicio' => $servicio,
            ]);

        }catch(\Exception $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Error al procesar la solicitud',
                'error' => [
                    'file'    => $th->getFile(),
                    'line'    => $th->getLine(),
                    'message' => $th->getMessage()
                ],
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
        //
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

            $header = $request->input('header');
            $sidebar = $request->input('sidebar');
            $footer = $request->input('footer');
            $button = $request->input('button');
            $sizetext = $request->input('sizetext');

            $data = Ajuste::where('idusuario', '=', Auth::user()->id)->get();

            if ( sizeof($data) > 0 ) {
                $ajuste = Ajuste::find($data[0]->id);
                $ajuste->idusuario = Auth::user()->id;
                $ajuste->colorheader = $header;
                $ajuste->colorsidebar = $sidebar;
                $ajuste->colorfooter = $footer;
                $ajuste->colorgeneral = $button;
                $ajuste->sizetext = $sizetext;
                $ajuste->update();
            } else {
                $ajuste = new Ajuste();
                $ajuste->idusuario = Auth::user()->id;
                $ajuste->colorheader = $header;
                $ajuste->colorsidebar = $sidebar;
                $ajuste->colorfooter = $footer;
                $ajuste->colorgeneral = $button;
                $ajuste->sizetext = $sizetext;
                $ajuste->save();
            }

            $data = Ajuste::where('idusuario', '=', Auth::user()->id)->orderBy('id')->first();

            DB::commit();

            return response()->json([
                'response'  => 1,
                'data'      => $data,
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
}
