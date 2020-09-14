<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SolicitudController extends Controller
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
                $data = DB::table('solicitud as sol')
                    ->leftJoin('users as user', 'sol.idusuario', '=', 'user.id')
                    ->leftJoin('cliente as cli', 'sol.idcliente', '=', 'cli.id')
                    ->leftJoin('informacion as info', 'sol.id', '=', 'info.idsolicitud')
                    ->select( 'sol.id', 'sol.montototal', 'sol.estadoproceso', 'sol.fecha', 'sol.hora', 'sol.nota',
                        'user.nombre as usuario', 'user.apellido as apellidouser',
                        'cli.nombre as cliente', 'cli.apellido as apellidocliente',
                        'info.nombre', 'info.apellido', 'info.pais', 'info.ciudad', 'info.direccion', 'info.calle',
                        'info.numero', 'info.telefono', 'info.email'
                    )
                    ->where('sol.estado', '=', 'A')
                    ->whereNull('sol.deleted_at')
                    ->orderBy('sol.id', 'desc')
                    ->paginate(10);
            }else {
                $data = DB::table('solicitud as sol')
                    ->leftJoin('users as user', 'sol.idusuario', '=', 'user.id')
                    ->leftJoin('cliente as cli', 'sol.idcliente', '=', 'cli.id')
                    ->leftJoin('informacion as info', 'sol.id', '=', 'info.idsolicitud')
                    ->select( 'sol.id', 'sol.montototal', 'sol.estadoproceso', 'sol.fecha', 'sol.hora', 'sol.nota',
                        'user.nombre as usuario', 'user.apellido as apellidouser',
                        'cli.nombre as cliente', 'cli.apellido as apellidocliente',
                        'info.nombre', 'info.apellido', 'info.pais', 'info.ciudad', 'info.direccion', 'info.calle',
                        'info.numero', 'info.telefono', 'info.email'
                    )
                    ->where(function ($query) use ($search) {
                        return $query
                            ->orWhere(DB::raw("CONCAT(info.nombre, ' ',info.apellido)"), 'LIKE', "%".$search."%")
                            ->orWhere(DB::raw("CONCAT(cli.nombre, ' ',cli.apellido)"), 'LIKE', "%".$search."%")
                            ->orWhere(DB::raw("CONCAT(user.nombre, ' ',user.apellido)"), 'LIKE', "%".$search."%")
                            ->orWhere('user.nombre', 'LIKE', '%'.$search.'%')
                            ->orWhere('user.apellido', 'LIKE', '%'.$search.'%')
                            ->orWhere('info.nombre', 'LIKE', '%'.$search.'%')
                            ->orWhere('info.apellido', 'LIKE', '%'.$search.'%')
                            ->orWhere('cli.nombre', 'LIKE', '%'.$search.'%')
                            ->orWhere('cli.apellido', 'LIKE', '%'.$search.'%')
                            ->orWhere('info.email', 'LIKE', '%'.$search.'%')
                            ->orWhere('info.telefono', 'LIKE', '%'.$search.'%');
                    })
                    ->where('sol.estado', '=', 'A')
                    ->whereNull('sol.deleted_at')
                    ->orderBy('sol.id', 'desc')
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
}
