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
        $data = Permiso::where('estado', '=', 'A')->orderBy('idpermiso', 'asc')->get();
        foreach ($data as $d) {
            $detalle = new PermisoDetalle();
            $detalle->fkidpermiso = $d->idpermiso;
            $detalle->fkidrol = 1;
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
                 'fkidpermiso'   => 1,
                 'fkidrol'       => 3,
                 'estado'      => 'A',
             ], //1
             [
                'fkidpermiso'   => 10,
                'fkidrol'       => 3,
                'estado'      => 'A',
            ], //1
            [
                'fkidpermiso'   => 11,
                'fkidrol'       => 3,
                'estado'      => 'A',
            ], //1
            [
                'fkidpermiso'   => 12,
                'fkidrol'       => 3,
                'estado'      => 'A',
            ], //1
            
            [
                'fkidpermiso'   => 24,
                'fkidrol'       => 3,
                'estado'      => 'A',
            ], //1
            [
                'fkidpermiso'   => 26,
                'fkidrol'       => 3,
                'estado'      => 'A',
            ], //1
            [
                'fkidpermiso'   => 27,
                'fkidrol'       => 3,
                'estado'      => 'A',
            ], //1
            [
                'fkidpermiso'   => 47,
                'fkidrol'       => 3,
                'estado'      => 'A',
            ], //1
    
         ];
    }
    public function permisos_supervisor(){
        return [
            [
                'fkidpermiso'   => 1,
                'fkidrol'       => 2,
                'estado'      => 'A',
            ], //1
            [
                'fkidpermiso'   => 7,
                'fkidrol'       => 2,
                'estado'      => 'A',
            ], //1
            [
                'fkidpermiso'   => 8,
                'fkidrol'       => 2,
                'estado'      => 'A',
            ], //1
            [
                'fkidpermiso'   => 9,
                'fkidrol'       => 2,
                'estado'      => 'A',
            ], //1
            [
                'fkidpermiso'   => 10,
                'fkidrol'       => 2,
                'estado'      => 'A',
            ], //1
            [
                'fkidpermiso'   => 11,
                'fkidrol'       => 2,
                'estado'      => 'A',
            ], //1
            [
                'fkidpermiso'   => 12,
                'fkidrol'       => 2,
                'estado'      => 'A',
            ], //1
            [
                'fkidpermiso'   => 13,
                'fkidrol'       => 2,
                'estado'      => 'A',
            ], //1
            [
                'fkidpermiso'   => 17,
                'fkidrol'       => 2,
                'estado'      => 'A',
            ], //1
            [
                'fkidpermiso'   => 18,
                'fkidrol'       => 2,
                'estado'      => 'A',
            ], //1
            [
                'fkidpermiso'   => 22,
                'fkidrol'       => 2,
                'estado'      => 'A',
            ], //1
            [
                'fkidpermiso'   => 23,
                'fkidrol'       => 2,
                'estado'      => 'A',
            ], //1
            [
                'fkidpermiso'   => 27,
                'fkidrol'       => 2,
                'estado'      => 'A',
            ], //1
            [
                'fkidpermiso'   => 28,
                'fkidrol'       => 2,
                'estado'      => 'A',
            ], //1
            [
                'fkidpermiso'   => 29,
                'fkidrol'       => 2,
                'estado'      => 'A',
            ], //1
        ];
    }
}
