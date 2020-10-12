<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSeguimientoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('seguimiento', function (Blueprint $table) {
            $table->increments('idseguimiento');
            $table->integer('fkidusuario')->unsigned();
            $table->integer('fkidasignartrabajo')->unsigned()->nullable();
            $table->string('descripcion', 70);
            $table->text('latitud');
            $table->text('longitud');
            $table->string('direccion', 120);
            $table->date('fecha');
            $table->time('hora');
            $table->softDeletes();
            $table->timestamps();
            $table->foreign('fkidusuario')->references('id')->on('users')->ondelete('cascade');
            $table->foreign('fkidasignartrabajo')->references('idasignardetalle')->on('asignardetalle')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('seguimiento');
    }
}
