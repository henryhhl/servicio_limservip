<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSolicitudTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('solicitud', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('idcliente')->unsigned()->nullable();
            $table->integer('idusuario')->unsigned()->nullable();
            $table->decimal('montototal', 12, 2);
            $table->text('nota')->nullable();
            $table->enum('estadoproceso', ['P', 'E', 'F', 'C', 'N'])->default('P');
            $table->enum('estado', ['A', 'N'])->default('A');
            $table->date('fecha')->nullable();
            $table->time('hora')->nullable();
            $table->softDeletes();
            $table->timestamps();
            $table->foreign('idcliente')->references('id')->on('cliente')->ondelete('cascade');
            $table->foreign('idusuario')->references('id')->on('users')->ondelete('cascade');
            // P = pendiente  *
            // E = En Proceso *
            // F = Finalizado
            // C = Cancelar ? Mientras no haya sido seleccionado el personal Cliente
            // N = Fallido
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('solicitud');
    }
}
