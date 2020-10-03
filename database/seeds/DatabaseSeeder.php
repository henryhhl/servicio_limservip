<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(PermisoTableSeeder::class);
        $this->call(UsuarioTableSeeder::class);
        $this->call(RolTableSeeder::class);
        $this->call(RolDetalleTableSeeder::class);
        $this->call(AsignarPermisoTableSeeder::class);
        $this->call(PersonalLimpiezaTableSeeder::class);
        $this->call(ClienteTableSeeder::class);
        $this->call(CategoriaTableSeeder::class);
        $this->call(ServicioTableSeeder::class);
    }
}
