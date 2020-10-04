<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAsignardetalleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('asignardetalle', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('idpersonal')->unsigned();
            $table->integer('idasignartrabajo')->unsigned();
            $table->enum('estadoproceso', ['A', 'F'])->default('A');
            $table->enum('esencargado', ['V', 'F'])->default('F');
            $table->date('fecha');
            $table->time('horainicio');
            $table->time('horafin')->nullable();
            $table->enum('estado', ['A', 'N'])->default('A');
            $table->softDeletes();
            $table->timestamps();
            $table->foreign('idpersonal')->references('id')->on('personal')->ondelete('cascade');
            $table->foreign('idasignartrabajo')->references('id')->on('asignartrabajo')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('asignardetalle');
    }
}
