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
                'nombre'    => 'paquete-personal',
            ], //1

            [
                'nombre'    => 'gestionar-personal',
            ], //2

            [
                'nombre'    => 'crear-personal',
            ], //3
            [
                'nombre'    => 'editar-personal',
            ], //4
            [
                'nombre'    => 'delete-personal',
            ], //5
            [
                'nombre'    => 'show-personal',
            ], //6


            [
                'nombre'    => 'asignar-trabajo',
            ], //7
            [
                'nombre'    => 'crear-trabajo',
            ], //8
            [
                'nombre'    => 'show-trabajo',
            ], //9
            [
                'nombre'    => 'visualizar-seguimiento',
            ], //10
            [
                'nombre'    => 'show-seguimiento',
            ], //11


            [
                'nombre'    => 'paquete-solicitud-servicio',
            ], //12



            [
                'nombre'    => 'gestionar-cliente',
            ], //13

            [
                'nombre'    => 'crear-cliente',
            ], //14
            [
                'nombre'    => 'editar-cliente',
            ], //15
            [
                'nombre'    => 'delete-cliente',
            ], //16
            [
                'nombre'    => 'show-cliente',
            ], //17

            [
                'nombre'    => 'gestionar-servicio',
            ], //18
            [
                'nombre'    => 'crear-servicio',
            ], //19
            [
                'nombre'    => 'editar-servicio',
            ], //20
            [
                'nombre'    => 'delete-servicio',
            ], //21
            [
                'nombre'    => 'show-servicio',
            ], //22
            [
                'nombre'    => 'gestionar-solicitud',
            ], //23
            [
                'nombre'    => 'crear-solicitud',
            ], //24
            [
                'nombre'    => 'editar-solicitud',
            ], //25
            [
                'nombre'    => 'delete-solicitud',
            ], //26
            [
                'nombre'    => 'show-solicitud',
            ], //27
            [
                'nombre'    => 'administrar-pago',
            ], //28
            [
                'nombre'    => 'show-pago',
            ], //29
            [
                'nombre'    => 'gestionar-rol',
            ], //30
            [
                'nombre'    => 'crear-rol',
            ], //31
            [
                'nombre'    => 'editar-rol',
            ], //32
            [
                'nombre'    => 'delete-rol',
            ], //33
            [
                'nombre'    => 'show-rol',
            ], //34
            [
                'nombre'    => 'gestionar-usuario',
            ], //35
            [
                'nombre'    => 'crear-usuario',
            ], //36
            [
                'nombre'    => 'editar-usuario',
            ], //37
            [
                'nombre'    => 'delete-usuario',
            ], //38
            [
                'nombre'    => 'show-usuario',
            ], //39
            [
                'nombre'    => 'paquete-seguridad',
            ], //40
            [
                'nombre'    => 'generar-reporte',
            ], //41
            [
                'nombre'    => 'asignar-permiso',
            ], //42
        ];
    }
}
