<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInformacionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('informacion', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('idsolicitud')->unsigned();
            $table->text('latitud')->nullable();
            $table->text('longitud')->nullable();

            $table->text('nombre')->nullable();
            $table->text('apellido')->nullable();
            $table->text('pais')->nullable();
            $table->text('ciudad')->nullable();
            $table->text('direccion')->nullable(); //nro casa y nombre de la calle
            $table->text('calle')->nullable();
            $table->text('numero')->nullable();
            $table->text('telefono')->nullable();
            $table->text('email')->nullable();

            $table->enum('estado', ['A', 'N'])->default('A');
            $table->softDeletes();
            $table->timestamps();
            $table->foreign('idsolicitud')->references('id')->on('solicitud')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('informacion');
    }
}
