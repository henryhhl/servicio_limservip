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
            $table->increments('id');
            $table->integer('idsolicitud')->unsigned()->nullable();
            $table->integer('idasignartrabajo')->unsigned()->nullable();
            $table->integer('idusuarioenviado')->unsigned()->nullable();
            $table->integer('idusuariorecibido')->unsigned()->nullable();
            $table->text('mensaje');
            $table->enum('tipo', ['P', 'A'])->default('P');
            $table->enum('estado', ['A', 'N'])->default('A');
            $table->date('fecha');
            $table->time('hora');
            $table->softDeletes();
            $table->timestamps();
            $table->foreign('idsolicitud')->references('id')->on('solicitud')->ondelete('cascade');
            $table->foreign('idasignartrabajo')->references('id')->on('asignartrabajo')->ondelete('cascade');
            $table->foreign('idusuarioenviado')->references('id')->on('users')->ondelete('cascade');
            $table->foreign('idusuariorecibido')->references('id')->on('users')->ondelete('cascade');
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
