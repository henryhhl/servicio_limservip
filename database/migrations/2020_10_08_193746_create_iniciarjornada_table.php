<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateIniciarjornadaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('iniciarjornada', function (Blueprint $table) {
            $table->increments('idiniciarjornada');
            $table->integer('fkidusuario')->unsigned();
            $table->string('descripcion');
            $table->date('fecha');
            $table->time('hora');
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidusuario')->references('id')->on('users')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('iniciarjornada');
    }
}
