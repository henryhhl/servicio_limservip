<?php

use App\User;
use Illuminate\Database\Seeder;

class UsuarioTableSeeder extends Seeder
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
            User::create($d);
        }
    }

    private function _get_data() {
        return [
            [
                'nombre'      => 'admin',
                'apellido'    => 'administra',
                'usuario'     => 'admin',
                'password'    => bcrypt('123123'),
            ], //1
            [
                'nombre'      => 'Henry',
                'apellido'    => 'Huarachi Laime',
                'usuario'     => 'henry',
                'password'    => bcrypt('123123'),
            ], //2
            [
                'nombre'      => 'Juan Carlos',
                'apellido'    => 'Mamani Huayta',
                'usuario'     => 'juan',
                'password'    => bcrypt('123123'),
            ], //3
            [
                'nombre'      => 'Jose Rebeka',
                'apellido'    => 'Guerrero Lazarte',
                'usuario'     => 'rebeka',
                'password'    => bcrypt('123123'),
            ], //4
        ];
    }

}
