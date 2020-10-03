<?php

namespace App\Http\Controllers;

use App\Informacion;
use App\Solicitud;
use App\SolicitudDetalle;
use Carbon\Carbon;
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
                    ->leftJoin('users as usercli', 'cli.idusuario', '=', 'usercli.id')
                    ->leftJoin('informacion as info', 'sol.id', '=', 'info.idsolicitud')
                    ->select( 'sol.id', 'sol.montototal', 'sol.estadoproceso', 'sol.fecha', 'sol.hora', 'sol.nota',
                        'user.nombre as usuario', 'user.apellido as apellidouser',
                        'usercli.nombre as cliente', 'usercli.apellido as apellidocliente',
                        'info.nombre', 'info.apellido', 'info.pais', 'info.ciudad', 'info.direccion', 'info.direccioncompleto',
                        'info.telefono', 'info.email'
                    )
                    ->where('sol.estado', '=', 'A')
                    ->whereNull('sol.deleted_at')
                    ->orderBy('sol.id', 'desc')
                    ->paginate(10);
            }else {
                $data = DB::table('solicitud as sol')
                    ->leftJoin('users as user', 'sol.idusuario', '=', 'user.id')
                    ->leftJoin('cliente as cli', 'sol.idcliente', '=', 'cli.id')
                    ->leftJoin('users as usercli', 'cli.idusuario', '=', 'usercli.id')
                    ->leftJoin('informacion as info', 'sol.id', '=', 'info.idsolicitud')
                    ->select( 'sol.id', 'sol.montototal', 'sol.estadoproceso', 'sol.fecha', 'sol.hora', 'sol.nota',
                        'user.nombre as usuario', 'user.apellido as apellidouser',
                        'usercli.nombre as cliente', 'usercli.apellido as apellidocliente',
                        'info.nombre', 'info.apellido', 'info.pais', 'info.ciudad', 'info.direccion', 'info.direccioncompleto',
                        'info.telefono', 'info.email'
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
        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }

            $nro = DB::table('solicitud')
                ->where('idusuario', '=', Auth::user()->id)
                ->whereNull('deleted_at')
                ->get();

            return response()->json([
                'response'  => 1,
                'nro' => sizeof($nro) + 1,
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
            $servicio->idusuario = Auth::user()->id;
            $servicio->montototal = $montototal;
            $mytime = Carbon::now('America/La_paz');
            $servicio->fecha = $mytime->toDateString();
            $servicio->hora = $mytime->toTimeString();
            $servicio->save();

            $informacion = new Informacion();
            $informacion->idsolicitud = $servicio->id;
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
                $detalle->idsolicitud = $servicio->id;
                $detalle->idservicio = $data->id;
                $detalle->cantidad = $data->cantidad;
                $detalle->precio = $data->precio;
                $detalle->descuento = 0;
                $detalle->save();
            }

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
                ->leftJoin('users as user', 'sol.idusuario', '=', 'user.id')
                ->select('sol.id', 'sol.montototal', 'sol.nota', 'sol.estadoproceso', 'sol.fecha', 'sol.hora', 
                    'user.nombre', 'user.apellido'
                )
                ->where('sol.id', '=', $id)
                ->first();


            $informacion = DB::table('informacion')
                ->select('latitud', 'longitud', 'nombre', 'apellido', 'pais', 'ciudad', 'direccion', 'direccioncompleto', 
                    'zona', 'telefono', 'email'
                )
                ->where('idsolicitud', '=', $id)
                ->first();

            $detalle = DB::table('solicituddetalle as det')
                ->leftJoin('servicio as serv', 'det.idservicio', '=', 'serv.id')
                ->leftJoin('categoria as cat', 'serv.idcategoria', '=', 'cat.id')
                ->select('serv.id', 'serv.nombre as servicio', 'serv.descripcion', 'serv.imagen', 'cat.descripcion as categoria', 
                    'det.cantidad', 'det.precio', 'det.nota', 'det.estadoproceso'
                )
                ->where('det.idsolicitud', '=', $id)
                ->get();

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
