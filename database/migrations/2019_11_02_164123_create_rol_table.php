<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRolTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rol', function (Blueprint $table) {
            $table->increments('idrol');
            $table->string('nombre', 45);
            $table->string('descripcion', 120)->nullable();
            // $table->enum('estado', ['A', 'N'])->default('A');
            $table->string('estado', 1)->default('A');
            $table->string('delete', 1)->default('N');
            // $table->enum('delete', ['A', 'N'])->default('N');
            $table->date('fecha');
            $table->time('hora');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rol');
    }
}
