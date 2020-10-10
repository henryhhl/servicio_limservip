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
                'fkidusuario'   => 1,
                'fkidrol'       => 1,
                'estado'      => 'A',
            ], //1
            [
                'fkidusuario'   => 2,
                'fkidrol'       => 1,
                'estado'      => 'A',
            ], //2
            [
                'fkidusuario'   => 3,
                'fkidrol'       => 3,
                'estado'      => 'A',
            ], //3
            [
                'fkidusuario'   => 4,
                'fkidrol'       => 3,
                'estado'      => 'A',
            ], //4
            [
                'fkidusuario'   => 5,
                'fkidrol'       => 4,
                'estado'      => 'A',
            ], //5
            [
                'fkidusuario'   => 6,
                'fkidrol'       => 4,
                'estado'      => 'A',
            ], //6
            [
                'fkidusuario'   => 7,
                'fkidrol'       => 4,
                'estado'      => 'A',
            ], //7
            [
                'fkidusuario'   => 8,
                'fkidrol'       => 2,
                'estado'      => 'A',
            ], //7
        ];
    }

}
