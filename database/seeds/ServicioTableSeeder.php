<?php

use Illuminate\Database\Seeder;
use App\Servicio;

class ServicioTableSeeder extends Seeder
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
            Servicio::create($d);
        }
    }

    private function _get_data() {
        return [
            [
                'idcategoria' => 3,
                'nombre'   => 'LAVADO DE ALFOMBRAS',
                'descripcion'  => 'Limpieza a presión con agua y extracción inmediata que lava las fibras desde su base, recomendado por la mayoría de fabricantes de alfombras.',
                'precio'      =>  250.0,
                'estado'      => 'A',
            ], //1
            [
                'idcategoria' => 2,
                'nombre'   => 'DESINFECTADO Y SANITIZADO DE BAÑOS',
                'descripcion'=> 'Limpieza profunda del inodoro, tina, lavamanos, espejo, paredes y piso, dejando el cuarto de baño desinfectado y sanitizado con productos especiales.',
                'precio'      =>  450.0,
                'estado'      => 'A',
            ], //2
            [
                'idcategoria' => 2,
                'nombre'   => 'LIMPIEZA DE VIDRIOS',
                'descripcion'  => 'Limpieza de todo tipo de vidrios con insumos y productos importados que no dejan rastros ni residuos.',
                'precio'      =>  200.0,
                'estado'      => 'A',
            ], //3
                        
        ];
    }
}
