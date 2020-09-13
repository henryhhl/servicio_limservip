<?php

namespace App\Http\Controllers;

use App\Promocion;
use App\PromocionDetalle;
use App\Visitas;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PromocionController extends Controller
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
                $data = DB::table('promocion')
                    ->where('estado', '=', 'A')
                    ->orderBy('id', 'desc')
                    ->paginate(10);
            }else {
                $data = DB::table('promocion')
                    ->where('descripcion', 'LIKE', '%'.$search.'%')
                    ->where('estado', '=', 'A')
                    ->orderBy('id', 'desc')
                    ->paginate(10);
            }

            return response()->json([
                'response' => 1,
                'visitasitio' => $this->getvisitasitio(1),
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

    public function getvisitasitio($bandera) {

        $data = new Visitas();
        if ($bandera == 1) {
            $data->promocion = '1';
        }
        if ($bandera == 2) {
            $data->promocioncreate = '1';
        }
        if ($bandera == 3) {
            $data->promocionedit = '1';
        }
        if ($bandera == 4) {
            $data->promocionshow = '1';
        }
        $mytime = Carbon::now('America/La_paz');
        $data->fecha = $mytime->toDateString();
        $data->hora = $mytime->toTimeString();
        $data->save();

        if ($bandera == 1) {
            $cantidad = sizeof( DB::table('visitas')->whereNotNull('promocion')->get() );
            return ' LISTADO DE PROMOCION: ' . $cantidad;
        }
        if ($bandera == 2) {
            $cantidad = sizeof( DB::table('visitas')->whereNotNull('promocioncreate')->get() );
            return ' NUEVA PROMOCION: ' . $cantidad;
        }
        if ($bandera == 3) {
            $cantidad = sizeof( DB::table('visitas')->whereNotNull('promocionedit')->get() );
            return ' EDITAR PROMOCION: ' . $cantidad;
        }
        $cantidad = sizeof( DB::table('visitas')->whereNotNull('promocionshow')->get() );
        return ' DETALLE PROMOCION: ' . $cantidad;
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
                'response' => 1,
                'visitasitio' => $this->getvisitasitio(2),
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
            $fechainicio = $request->input('fechainicio');
            $fechafin = $request->input('fechafin');
            $descuento = $request->input('descuento');

            $array_producto = json_decode($request->input('array_producto'));

            $data = DB::table('promocion')
                ->where('descripcion', '=', $descripcion)
                ->where('estado', '=', 'A')
                ->get();

            if (sizeof($data) > 0) {
                return response()->json([
                    'response' => -1,
                ]);
            }

            $mytime = Carbon::now('America/La_paz');

            $data = new Promocion();
            $data->descripcion = $descripcion;
            $data->fechainicio = $fechainicio;
            $data->fechafinal = $fechafin;
            $data->descuento = $descuento;
            $data->estado = 'A';
            $data->fecha = $mytime->toDateString();
            $data->hora = $mytime->toTimeString();
            $data->save();

            foreach ($array_producto as $key => $value) {
                if ($value->id != null) {
                    $detalle = new PromocionDetalle();
                    $detalle->idpromocion = $data->id;
                    $detalle->idservicio = $value->id;
                    $detalle->precio = $value->precio * 1;
                    $detalle->preciodescuento = $value->preciodescuento;
                    $detalle->cantidad = 0;
                    $detalle->descuento = $value->descuento;
                    $detalle->estado = 'A';
                    $detalle->save();
                }
            }

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
        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }

            $promocion = DB::table('promocion')
                ->where('id', '=', $id)
                ->first();

            $detalle = DB::table('detalle_promocion as det')
                ->leftJoin('servicio as serv', 'det.idservicio', '=', 'serv.id')
                ->select('det.id', 'det.idservicio', 'serv.codigo', 'serv.descripcion', 'det.precio', 
                    'serv.stockactual', 'serv.tipo', 'serv.imagen', 'serv.costo', 
                    'det.descuento', 'det.preciodescuento'
                )
                ->where('det.idpromocion', '=', $id)
                ->where('det.estado', '=', 'A')
                ->get();

            return response()->json([
                'response' => 1,
                'promocion' => $promocion,
                'detalle' => $detalle,
                'visitasitio' => $this->getvisitasitio(3),
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
            $fechainicio = $request->input('fechainicio');
            $fechafin = $request->input('fechafin');
            $descuento = $request->input('descuento');
            $id = $request->input('id');

            $array_producto = json_decode($request->input('array_producto'));

            $data = Promocion::find($id);

            if ($data->descripcion != $descripcion) {
                $promocion = DB::table('promocion')
                    ->where('descripcion', '=', $descripcion)
                    ->where('estado', '=', 'A')
                    ->get();

                if (sizeof($promocion) > 0) {
                    return response()->json([
                        'response' => -1,
                    ]);
                }
            }

            
            $data->descripcion = $descripcion;
            $data->fechainicio = $fechainicio;
            $data->fechafinal = $fechafin;
            $data->descuento = $descuento;
            $data->update();

            foreach ($array_producto as $key => $value) {
                if ($value->id != null) {
                    if ($value->iddetalle == null) {
                        $detalle = new PromocionDetalle();
                        $detalle->idpromocion = $data->id;
                        $detalle->idservicio = $value->id;
                        $detalle->precio = $value->precio * 1;
                        $detalle->preciodescuento = $value->preciodescuento;
                        $detalle->cantidad = 0;
                        $detalle->descuento = $value->descuento;
                        $detalle->estado = 'A';
                        $detalle->save();
                    }else {
                        $detalle = PromocionDetalle::find($value->iddetalle);
                        $detalle->precio = $value->precio * 1;
                        $detalle->preciodescuento = $value->preciodescuento;
                        $detalle->descuento = $value->descuento;
                        $detalle->update();
                    }
                }
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

            $id = $request->input('idpromocion');

            $getdata = DB::table('detalle_venta')
                ->where('idpromociondetalle', '=', $id)
                ->get();

            if (sizeof($getdata) > 0) {
                DB::rollBack();
                return response()->json([
                    'response' => -1,
                ]);
            }

            $data = Promocion::find($id);
            $data->estado = 'N';
            $data->update();

            $data = DB::table('promocion')
                ->where('estado', '=', 'A')
                ->orderBy('id', 'desc')
                ->paginate(10);

            DB::commit();

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
