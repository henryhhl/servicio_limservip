<?php

use Illuminate\Database\Seeder;
use App\Categoria;

class CategoriaTableSeeder extends Seeder
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
            Categoria::create($d);
        }
    }

    private function _get_data() {
        return [
            [
                
                'descripcion'   => 'industrial',
                'estado'      => 'A',
            ], //1
            [
                'descripcion'   => 'domiciliaria',
                'estado'      => 'A',
            ], //2
            [
                'descripcion'   => 'negocio',
                'estado'      => 'A',
            ], //3
                        
        ];
    }
}
