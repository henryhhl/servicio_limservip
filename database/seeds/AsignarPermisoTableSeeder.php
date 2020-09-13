<?php

use App\PermisoDetalle;
use App\Permiso;
use Illuminate\Database\Seeder;

class AsignarPermisoTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = Permiso::where('estado', '=', 'A')->orderBy('id', 'asc')->get();
        foreach ($data as $d) {
            $detalle = new PermisoDetalle();
            $detalle->idpermiso = $d->id;
            $detalle->idrol = 1;
            $detalle->estado = 'A';
            $detalle->save();
        }
        $vendedor = $this->permisos_vendedor();
        foreach($vendedor as $v){
            PermisoDetalle::create($v);
        }
    }
    public function permisos_vendedor(){
        return [
            [
                'idpermiso'   => 13,
                'idrol'       => 2,
                'estado'      => 'A',
            ], //1
            [
                'idpermiso'   => 32,
                'idrol'       => 2,
                'estado'      => 'A',
            ], //2
            [
                'idpermiso'   => 33,
                'idrol'       => 2,
                'estado'      => 'A',
            ], //3
            [
                'idpermiso'   => 34,
                'idrol'       => 2,
                'estado'      => 'A',
            ], //4
            [
                'idpermiso'   => 37,
                'idrol'       => 2,
                'estado'      => 'A',
            ], //5
            [
                'idpermiso'   => 38,
                'idrol'       => 2,
                'estado'      => 'A',
            ], //6
            [
                'idpermiso'   => 39,
                'idrol'       => 2,
                'estado'      => 'A',
            ], //7
            [
                'idpermiso'   => 41,
                'idrol'       => 2,
                'estado'      => 'A',
            ], //8
            [
                'idpermiso'   => 62,
                'idrol'       => 2,
                'estado'      => 'A',
            ], //9
            [
                'idpermiso'   => 63,
                'idrol'       => 2,
                'estado'      => 'A',
            ], //10
            [
                'idpermiso'   => 64,
                'idrol'       => 2,
                'estado'      => 'A',
            ], //11
            [
                'idpermiso'   => 66,
                'idrol'       => 2,
                'estado'      => 'A',
            ], //12
        ];
    }
}
