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
            $table->increments('idinformacion');
            $table->integer('fkidsolicitud')->unsigned();
            
            $table->text('latitud')->nullable();
            $table->text('longitud')->nullable();

            $table->string('nombre', 45)->nullable();
            $table->string('apellido', 60)->nullable();
            $table->string('pais', 25)->nullable();
            $table->string('ciudad', 55)->nullable();
            $table->string('direccion', 120)->nullable(); //nro casa y nombre de la calle
            $table->string('direccioncompleto', 120)->nullable();
            $table->string('zona', 50)->nullable();
            $table->integer('telefono')->nullable();
            $table->string('email', 75)->nullable();

            $table->string('estado', 1)->default('A');
            $table->softDeletes();
            $table->timestamps();
            $table->foreign('fkidsolicitud')->references('idsolicitud')->on('solicitud')->ondelete('cascade');
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
