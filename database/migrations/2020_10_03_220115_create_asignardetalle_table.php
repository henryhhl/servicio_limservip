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
            $table->increments('idasignardetalle');
            $table->integer('fkidpersonal')->unsigned();
            $table->integer('fkidasignartrabajo')->unsigned();
            // $table->enum('estadoproceso', ['A', 'F'])->default('A');
            $table->string('estadoproceso', 1)->default('A');
            $table->string('esencargado', 1)->default('F');
            // $table->enum('esencargado', ['V', 'F'])->default('F');
            $table->date('fecha');
            $table->time('horainicio');
            $table->time('horafin')->nullable();
            // $table->enum('estado', ['A', 'N'])->default('A');
            $table->string('estado', 1)->default('A');
            $table->softDeletes();
            $table->timestamps();
            $table->foreign('fkidpersonal')->references('idpersonal')->on('personal')->ondelete('cascade');
            $table->foreign('fkidasignartrabajo')->references('idasignartrabajo')->on('asignartrabajo')->ondelete('cascade');
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
