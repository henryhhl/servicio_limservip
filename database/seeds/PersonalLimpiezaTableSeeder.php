<?php

use Illuminate\Database\Seeder;
use App\Personal;

class PersonalLimpiezaTableSeeder extends Seeder
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
            Personal::create($d);
        }
    }

    private function _get_data() {
        return [
            [
                
                'fkidusuario'   => 1,
                'ci' => '9788412',
                'direccion' => 'av. 2 de agosto',
                'ciudad' => 'Santa Cruz',
                'contacto' => '3442785',
                'estado'      => 'A',
            ], //1
            [
                'fkidusuario'   => 2,
                'ci' => '9788423',
                'direccion' => 'av. alemana',
                'ciudad' => 'Santa Cruz',
                'contacto' => '3442345',
                'estado'      => 'A',
            ], //2
            [
                'fkidusuario'   => 5,
                'ci' => '9733210',
                'direccion' => 'av. Trinidad',
                'ciudad' => 'Santa Cruz',
                'contacto' => '63498300',
                'estado'      => 'A',
            ], //2
            [
                'fkidusuario'   => 6,
                'ci' => '971415',
                'direccion' => 'Plan 3000',
                'ciudad' => 'Santa Cruz',
                'contacto' => '63498300',
                'estado'      => 'A',
            ], //2
            [
                'fkidusuario'   => 7,
                'ci' => '974121',
                'direccion' => 'Los Pozos',
                'ciudad' => 'Santa Cruz',
                'contacto' => '63498300',
                'estado'      => 'A',
            ], //2
            [
                'fkidusuario'   => 8,
                'ci' => '974213',
                'direccion' => 'av. Guapilo',
                'ciudad' => 'Santa Cruz',
                'contacto' => '63498300',
                'estado'      => 'A',
            ], //2
                        
        ];
    }
}
