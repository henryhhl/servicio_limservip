<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MySolicitudAsignadoController extends Controller
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
                    ->where('pers.fkidusuario', '=', Auth::user()->id)
                    ->whereNull('sol.deleted_at')
                    ->orderBy('sol.idsolicitud', 'desc')
                    ->paginate(10);
            }else {
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
                    ->where(function ($query) use ($search) {
                        return $query
                            ->orWhere(DB::raw("CONCAT(info.nombre, ' ',info.apellido)"), 'LIKE', "%".$search."%")
                            ->orWhere('info.nombre', 'LIKE', '%'.$search.'%')
                            ->orWhere('info.apellido', 'LIKE', '%'.$search.'%')
                            ->orWhere('info.email', 'LIKE', '%'.$search.'%')
                            ->orWhere('info.telefono', 'LIKE', '%'.$search.'%');
                    })
                    ->where('sol.estado', '=', 'A')
                    ->where('pers.fkidusuario', '=', Auth::user()->id)
                    ->whereNull('sol.deleted_at')
                    ->orderBy('sol.idsolicitud', 'desc')
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
        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }

            $solicitud = DB::table('solicitud as sol')
                ->leftJoin('users as user', 'sol.fkidusuario', '=', 'user.id')
                ->select('sol.idsolicitud as id', 'sol.montototal', 'sol.nota', 'sol.estadoproceso', 'sol.fecha', 'sol.hora', 
                    'user.nombre', 'user.apellido'
                )
                ->where('sol.idsolicitud', '=', $id)
                ->first();

            $informacion = DB::table('informacion')
                ->select('latitud', 'longitud', 'nombre', 'apellido', 'pais', 'ciudad', 'direccion', 'direccioncompleto', 
                    'zona', 'telefono', 'email'
                )
                ->where('fkidsolicitud', '=', $id)
                ->first();

            $detalle = DB::table('solicituddetalle as det')
                ->leftJoin('servicio as serv', 'det.fkidservicio', '=', 'serv.idservicio')
                ->leftJoin('categoria as cat', 'serv.fkidcategoria', '=', 'cat.idcategoria')
                ->select('serv.idservicio as id', 'serv.nombre as servicio', 'serv.descripcion', 'serv.imagen', 'cat.nombre as categoria', 
                    'det.cantidad', 'det.precio', 'det.nota', 'det.estadoproceso', 'det.idsolicituddetalle as iddetalle'
                )
                ->where('det.fkidsolicitud', '=', $id)
                ->get();

            foreach ($detalle as $det) {
                $det->personalasignado = DB::table('asignartrabajo as asignar')
                    ->leftJoin('asignardetalle as det', 'asignar.idasignartrabajo', '=', 'det.fkidasignartrabajo')
                    ->leftJoin('personal as pers', 'det.fkidpersonal', '=', 'pers.idpersonal')
                    ->leftJoin('users as user', 'pers.fkidusuario', '=', 'user.id')
                    ->select('user.nombre', 'user.apellido', 'user.imagen')
                    ->where('asignar.fkidsolicituddetalle', '=', $det->iddetalle)
                    ->whereNull('asignar.deleted_at')
                    ->get();
            }

            return response()->json([
                'response'  => 1,
                'solicitud' => $solicitud,
                'informacion' => $informacion,
                'detalle' => $detalle,
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
