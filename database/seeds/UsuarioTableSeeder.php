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

            [
                'nombre'      => 'Jandira',
                'apellido'    => 'Vargas Rojas',
                'usuario'     => 'jandi',
                'password'    => bcrypt('123123'),
            ], //5
            [
                'nombre'      => 'Brayan Vera',
                'apellido'    => 'Vera Laime',
                'usuario'     => 'brayan',
                'password'    => bcrypt('123123'),
            ], //6
            [
                'nombre'      => 'Ruben',
                'apellido'    => 'Aguirre Lazarte',
                'usuario'     => 'ruben',
                'password'    => bcrypt('123123'),
            ], //7
            [
                'nombre'      => 'Rolando',
                'apellido'    => 'Mendez Cruz',
                'usuario'     => 'rolando',
                'password'    => bcrypt('123123'),
            ], //8
        ];
    }

}
