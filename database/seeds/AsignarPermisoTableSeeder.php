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
         $cliente = $this->permisos_cliente();
         foreach($cliente as $v){
             PermisoDetalle::create($v);
         }
         $supervisor = $this->permisos_supervisor();
         foreach($supervisor as $v){
             PermisoDetalle::create($v);
         }
    }
     public function permisos_cliente(){
         return [
             [
                 'idpermiso'   => 1,
                 'idrol'       => 3,
                 'estado'      => 'A',
             ], //1
             [
                'idpermiso'   => 10,
                'idrol'       => 3,
                'estado'      => 'A',
            ], //1
            [
                'idpermiso'   => 11,
                'idrol'       => 3,
                'estado'      => 'A',
            ], //1
            [
                'idpermiso'   => 12,
                'idrol'       => 3,
                'estado'      => 'A',
            ], //1
            
            [
                'idpermiso'   => 24,
                'idrol'       => 3,
                'estado'      => 'A',
            ], //1
            [
                'idpermiso'   => 26,
                'idrol'       => 3,
                'estado'      => 'A',
            ], //1
            [
                'idpermiso'   => 27,
                'idrol'       => 3,
                'estado'      => 'A',
            ], //1
            [
                'idpermiso'   => 47,
                'idrol'       => 3,
                'estado'      => 'A',
            ], //1
    
         ];
    }
    public function permisos_supervisor(){
        return [
            [
                'idpermiso'   => 1,
                'idrol'       => 2,
                'estado'      => 'A',
            ], //1
            [
                'idpermiso'   => 7,
                'idrol'       => 2,
                'estado'      => 'A',
            ], //1
            [
                'idpermiso'   => 8,
                'idrol'       => 2,
                'estado'      => 'A',
            ], //1
            [
                'idpermiso'   => 9,
                'idrol'       => 2,
                'estado'      => 'A',
            ], //1
            [
                'idpermiso'   => 10,
                'idrol'       => 2,
                'estado'      => 'A',
            ], //1
            [
                'idpermiso'   => 11,
                'idrol'       => 2,
                'estado'      => 'A',
            ], //1
            [
                'idpermiso'   => 12,
                'idrol'       => 2,
                'estado'      => 'A',
            ], //1
            [
                'idpermiso'   => 13,
                'idrol'       => 2,
                'estado'      => 'A',
            ], //1
            [
                'idpermiso'   => 17,
                'idrol'       => 2,
                'estado'      => 'A',
            ], //1
            [
                'idpermiso'   => 18,
                'idrol'       => 2,
                'estado'      => 'A',
            ], //1
            [
                'idpermiso'   => 22,
                'idrol'       => 2,
                'estado'      => 'A',
            ], //1
            [
                'idpermiso'   => 23,
                'idrol'       => 2,
                'estado'      => 'A',
            ], //1
            [
                'idpermiso'   => 27,
                'idrol'       => 2,
                'estado'      => 'A',
            ], //1
            [
                'idpermiso'   => 28,
                'idrol'       => 2,
                'estado'      => 'A',
            ], //1
            [
                'idpermiso'   => 29,
                'idrol'       => 2,
                'estado'      => 'A',
            ], //1
        ];
    }
}
