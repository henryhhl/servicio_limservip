<?php

use Illuminate\Database\Seeder;
use App\Cliente;

class ClienteTableSeeder extends Seeder
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
            Cliente::create($d);
        }
    }

    private function _get_data() {
        return [
            [
                
                'idusuario'   => 3,
                'nit' => '588315',
                'contacto' => '63498300',
                'estado'      => 'A',
            ], //1
            [
                'idusuario'   => 4,
                'nit' => '624582',
                'contacto' => '72189600',
                'estado'      => 'A',
            ], //2
                        
        ];
    }
}
