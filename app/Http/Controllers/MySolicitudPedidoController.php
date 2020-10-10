<?php

namespace App\Http\Controllers;

use App\Informacion;
use App\Notificacion;
use App\Solicitud;
use App\SolicitudDetalle;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MySolicitudPedidoController extends Controller
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
                    ->leftJoin('cliente as cli', 'sol.fkidcliente', '=', 'cli.idcliente')
                    ->leftJoin('users as usercli', 'cli.fkidusuario', '=', 'usercli.id')
                    ->leftJoin('informacion as info', 'sol.idsolicitud', '=', 'info.fkidsolicitud')
                    ->select( 'sol.idsolicitud as id', 'sol.montototal', 'sol.estadoproceso', 'sol.fecha', 'sol.hora', 'sol.nota',
                        'user.nombre as usuario', 'user.apellido as apellidouser',
                        'usercli.nombre as cliente', 'usercli.apellido as apellidocliente',
                        'info.nombre', 'info.apellido', 'info.pais', 'info.ciudad', 'info.direccion', 'info.direccioncompleto',
                        'info.telefono', 'info.email'
                    )
                    ->where('sol.estado', '=', 'A')
                    ->where('sol.fkidusuario', '=', Auth::user()->id)
                    ->whereNull('sol.deleted_at')
                    ->orderBy('sol.idsolicitud', 'desc')
                    ->paginate(10);
            }else {
                $data = DB::table('solicitud as sol')
                    ->leftJoin('users as user', 'sol.fkidusuario', '=', 'user.id')
                    ->leftJoin('cliente as cli', 'sol.fkidcliente', '=', 'cli.idcliente')
                    ->leftJoin('users as usercli', 'cli.fkidusuario', '=', 'usercli.id')
                    ->leftJoin('informacion as info', 'sol.idsolicitud', '=', 'info.fkidsolicitud')
                    ->select( 'sol.idsolicitud as id', 'sol.montototal', 'sol.estadoproceso', 'sol.fecha', 'sol.hora', 'sol.nota',
                        'user.nombre as usuario', 'user.apellido as apellidouser',
                        'usercli.nombre as cliente', 'usercli.apellido as apellidocliente',
                        'info.nombre', 'info.apellido', 'info.pais', 'info.ciudad', 'info.direccion', 'info.direccioncompleto',
                        'info.telefono', 'info.email'
                    )
                    ->where(function ($query) use ($search) {
                        return $query
                            ->orWhere('info.direccion', 'LIKE', '%'.$search.'%')
                            ->orWhere('info.email', 'LIKE', '%'.$search.'%')
                            ->orWhere('info.telefono', 'LIKE', '%'.$search.'%');
                    })
                    ->where('sol.estado', '=', 'A')
                    ->where('sol.fkidusuario', '=', Auth::user()->id)
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
        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }

            $nro = DB::table('solicitud')
                ->where('fkidusuario', '=', Auth::user()->id)
                ->whereNull('deleted_at')
                ->get();

            return response()->json([
                'response'  => 1,
                'nro' => sizeof($nro) + 1,
                'usuario' => Auth::user(),
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
            $email = $request->input('email');
            $telefono = $request->input('telefono');
            $direccion = $request->input('direccion');
            $ciudad = $request->input('ciudad');
            $zona = $request->input('zona');
            $pais = $request->input('pais');
            
            $direccioncompleto = $request->input('direccioncompleto');
            $montototal = $request->input('montototal');

            $latitud = $request->input('latitud');
            $longitud = $request->input('longitud');

            $array_servicio = json_decode($request->input('array_servicio', '[]'));

            $servicio = new Solicitud();
            $servicio->fkidusuario = Auth::user()->id;
            $servicio->montototal = $montototal;
            $servicio->estadoproceso = 'P';
            $mytime = Carbon::now('America/La_paz');
            $servicio->fecha = $mytime->toDateString();
            $servicio->hora = $mytime->toTimeString();
            $servicio->save();

            $informacion = new Informacion();
            $informacion->fkidsolicitud = $servicio->idsolicitud;
            $informacion->nombre = $nombre;
            $informacion->apellido = $apellido;
            $informacion->pais = $pais;
            $informacion->ciudad = $ciudad;
            $informacion->direccion = $direccion;
            $informacion->telefono = $telefono;
            $informacion->email = $email;
            $informacion->zona = $zona;

            $informacion->direccioncompleto = $direccioncompleto;

            $informacion->latitud = $latitud;
            $informacion->longitud = $longitud;

            $informacion->save();

            foreach ($array_servicio as $data) {
                $detalle = new SolicitudDetalle();
                $detalle->idsolicitud = $servicio->idsolicitud;
                $detalle->idservicio = $data->id;
                $detalle->cantidad = $data->cantidad;
                $detalle->precio = $data->precio;
                $detalle->nota = $data->nota;
                $detalle->estadoproceso = 'P';
                $detalle->descuento = 0;
                $detalle->save();
            }

            $idusuario = Auth::user()->id;

            $notificacion = new Notificacion();
            $notificacion->insertarNotificacion($servicio->idsolicitud, $nombre, $apellido, $idusuario);

            DB::commit();

            return response()->json([
                'response'  => 1,
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
                    ->orderBy('user.nombre')
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
