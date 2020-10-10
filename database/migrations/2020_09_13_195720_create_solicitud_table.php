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
            $table->increments('idsolicitud');
            $table->integer('fkidcliente')->unsigned()->nullable();
            $table->integer('fkidusuario')->unsigned()->nullable();
            $table->decimal('montototal', 12, 2);
            $table->text('nota')->nullable();
            // $table->enum('estadoproceso', ['P', 'E', 'F', 'C', 'N'])->default('P');
            $table->string('estado', 1)->default('A');
            $table->string('estadoproceso', 1)->default('P');
            $table->date('fecha')->nullable();
            $table->time('hora')->nullable();
            $table->softDeletes();
            $table->timestamps();
            $table->foreign('fkidcliente')->references('idcliente')->on('cliente')->ondelete('cascade');
            $table->foreign('fkidusuario')->references('id')->on('users')->ondelete('cascade');
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
