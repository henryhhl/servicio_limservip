<?php

use App\Permiso;
use Illuminate\Database\Seeder;

class PermisoTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = $this->_get_data();
        foreach ($data as $d) {
            Permiso::create($d);
        }
    }
    private function _get_data() {
        return [
            [
                'nombre'    => 'paquete-seguridad',
            ], //1

            [
                'nombre'    => 'gestionar-usuario',
            ], //2

            [
                'nombre'    => 'crear-usuario',
            ], //3
            [
                'nombre'    => 'editar-usuario',
            ], //4
            [
                'nombre'    => 'delete-usuario',
            ], //5
            [
                'nombre'    => 'show-usuario',
            ], //5


            [
                'nombre'    => 'gestionar-rol',
            ], //6
            [
                'nombre'    => 'crear-rol',
            ], //7
            [
                'nombre'    => 'editar-rol',
            ], //8
            [
                'nombre'    => 'delete-rol',
            ], //9
            [
                'nombre'    => 'show-rol',
            ], //5


            [
                'nombre'    => 'asignar-permiso',
            ], //9



            [
                'nombre'    => 'paquete-servicio',
            ], //10


            [
                'nombre'    => 'gestionar-servicio',
            ], //11
            [
                'nombre'    => 'crear-servicio',
            ], //12
            [
                'nombre'    => 'editar-servicio',
            ], //13
            [
                'nombre'    => 'delete-servicio',
            ], //14
            [
                'nombre'    => 'show-servicio',
            ], //14

            [
                'nombre'    => 'crear-articulo',
            ], //32
            [
                'nombre'    => 'editar-articulo',
            ], //33
            [
                'nombre'    => 'delete-articulo',
            ], //34
            [
                'nombre'    => 'show-articulo',
            ], //14

            [
                'nombre'    => 'crear-categoria',
            ], //32
            [
                'nombre'    => 'editar-categoria',
            ], //33
            [
                'nombre'    => 'delete-categoria',
            ], //34
            [
                'nombre'    => 'show-categoria',
            ], //14



            [
                'nombre'    => 'gestionar-mecanico',
            ], //15
            [
                'nombre'    => 'crear-mecanico',
            ], //16
            [
                'nombre'    => 'editar-mecanico',
            ], //17
            [
                'nombre'    => 'delete-mecanico',
            ], //18
            [
                'nombre'    => 'show-mecanico',
            ], //14


            [
                'nombre'    => 'gestionar-vehiculo',
            ], //19

            [
                'nombre'    => 'crear-vehiculo',
            ], //20
            [
                'nombre'    => 'editar-vehiculo',
            ], //21
            [
                'nombre'    => 'delete-vehiculo',
            ], //22
            [
                'nombre'    => 'show-vehiculo',
            ], //14


            [
                'nombre'    => 'gestionar-cliente',
            ], //23
            [
                'nombre'    => 'crear-cliente',
            ], //24
            [
                'nombre'    => 'editar-cliente',
            ], //25
            [
                'nombre'    => 'delete-cliente',
            ], //26
            [
                'nombre'    => 'show-cliente',
            ], //14

            
            [
                'nombre'    => 'crear-vehiculotipo',
            ], //28
            [
                'nombre'    => 'editar-vehiculotipo',
            ], //29
            [
                'nombre'    => 'delete-vehiculotipo',
            ], //30
            [
                'nombre'    => 'show-vehiculotipo',
            ], //14


            [
                'nombre'    => 'crear-marca',
            ], //14
            [
                'nombre'    => 'editar-marca',
            ], //14
            [
                'nombre'    => 'delete-marca',
            ], //14
            [
                'nombre'    => 'show-marca',
            ], //14

            [
                'nombre'    => 'crear-modelomarca',
            ], //14
            [
                'nombre'    => 'editar-modelomarca',
            ], //14
            [
                'nombre'    => 'delete-modelomarca',
            ], //14
            [
                'nombre'    => 'show-modelomarca',
            ], //14

            [
                'nombre'    => 'crear-color',
            ], //14
            [
                'nombre'    => 'editar-color',
            ], //14
            [
                'nombre'    => 'delete-color',
            ], //14
            [
                'nombre'    => 'show-color',
            ], //14

            [
                'nombre'    => 'crear-year',
            ], //14
            [
                'nombre'    => 'editar-year',
            ], //14
            [
                'nombre'    => 'delete-year',
            ], //14
            [
                'nombre'    => 'show-year',
            ], //14
            

            [
                'nombre'    => 'gestionar-mantenimiento',
            ], //14
            [
                'nombre'    => 'crear-mantenimiento',
            ], //14
            [
                'nombre'    => 'editar-mantenimiento',
            ], //14
            [
                'nombre'    => 'delete-mantenimiento',
            ], //14
            [
                'nombre'    => 'show-mantenimiento',
            ], //14


            [
                'nombre'    => 'gestionar-promocion',
            ], //14
            [
                'nombre'    => 'crear-promocion',
            ], //14
            [
                'nombre'    => 'editar-promocion',
            ], //14
            [
                'nombre'    => 'delete-promocion',
            ], //14
            [
                'nombre'    => 'show-promocion',
            ], //14
        ];
    }
}
