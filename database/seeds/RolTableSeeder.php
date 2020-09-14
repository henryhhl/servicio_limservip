<?php

use App\GrupoUsuario;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class RolTableSeeder extends Seeder
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
            GrupoUsuario::create($d);
        }

    }

    private function _get_data() {
        $mytime = Carbon::now('America/La_paz');
        return [
            [
                'nombre'       => 'ADMINISTRADOR',
                'descripcion'  => 'Encargado de todo el funcionamiento del sistema.',
                'estado'       => 'A',
                'delete'       => 'A',
                'fecha'        => $mytime->toDateString(),
                'hora'         => $mytime->toTimeString(),
            ], //1
            [
                'nombre'       => 'SUPERVISOR',
                'descripcion'  => 'Encargado de asignar los trabajos a las solicitudes.',
                'estado'       => 'A',
                'delete'       => 'A',
                'fecha'        => $mytime->toDateString(),
                'hora'         => $mytime->toTimeString(),
            ], //2
            [
                'nombre'       => 'CLIENTE',
                'descripcion'  => 'Persona externa a la empresa.',
                'estado'       => 'A',
                'delete'       => 'A',
                'fecha'        => $mytime->toDateString(),
                'hora'         => $mytime->toTimeString(),
            ], //3
            [
                'nombre'       => 'PERSONAL DE LIMPIEZA',
                'descripcion'  => 'Encargado de realizar los trabajos.',
                'estado'       => 'A',
                'delete'       => 'A',
                'fecha'        => $mytime->toDateString(),
                'hora'         => $mytime->toTimeString(),
            ], //4
        ];
    }

}
