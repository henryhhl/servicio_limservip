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
                'nombre'       => 'VENDEDOR',
                'descripcion'  => 'Encargado de realizar el ventas y servicios del sistema.',
                'estado'       => 'A',
                'delete'       => 'A',
                'fecha'        => $mytime->toDateString(),
                'hora'         => $mytime->toTimeString(),
            ], //2
        ];
    }

}
