<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNotificacionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notificacion', function (Blueprint $table) {
            $table->increments('idnotificacion');
            $table->integer('fkidsolicitud')->unsigned()->nullable();
            $table->integer('fkidasignartrabajo')->unsigned()->nullable();
            $table->integer('fkidusuarioenviado')->unsigned()->nullable();
            $table->integer('fkidusuariorecibido')->unsigned()->nullable();
            $table->string('mensaje', 120);
            $table->string('tipo', 1)->default('P');
            $table->string('estado', 1)->default('A');
            // $table->enum('tipo', ['P', 'A'])->default('P');
            // $table->enum('estado', ['A', 'N'])->default('A');
            $table->date('fecha');
            $table->time('hora');
            $table->softDeletes();
            $table->timestamps();
            $table->foreign('fkidsolicitud')->references('idsolicitud')->on('solicitud')->ondelete('cascade');
            $table->foreign('fkidasignartrabajo')->references('idasignartrabajo')->on('asignartrabajo')->ondelete('cascade');
            $table->foreign('fkidusuarioenviado')->references('id')->on('users')->ondelete('cascade');
            $table->foreign('fkidusuariorecibido')->references('id')->on('users')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('notificacion');
    }
}
