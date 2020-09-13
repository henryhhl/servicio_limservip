<?php

use App\GrupoUsuarioDetalle;
use Illuminate\Database\Seeder;

class RolDetalleTableSeeder extends Seeder
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
            GrupoUsuarioDetalle::create($d);
        }
    }

    private function _get_data() {
        return [
            [
                'idusuario'   => 1,
                'idrol'       => 1,
                'estado'      => 'A',
            ], //1
            [
                'idusuario'   => 2,
                'idrol'       => 1,
                'estado'      => 'A',
            ], //2
            [
                'idusuario'   => 3,
                'idrol'       => 2,
                'estado'      => 'A',
            ], //3
            [
                'idusuario'   => 4,
                'idrol'       => 2,
                'estado'      => 'A',
            ], //4
        ];
    }

}
