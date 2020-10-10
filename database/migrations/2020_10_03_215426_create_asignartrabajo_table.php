<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAsignartrabajoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('asignartrabajo', function (Blueprint $table) {
            $table->increments('idasignartrabajo');
            $table->integer('fkidusuario')->unsigned();
            $table->integer('fkidsolicituddetalle')->unsigned();
            // $table->enum('estadoproceso', ['A', 'F'])->default('A');
            $table->string('estadoproceso', 1)->default('A');
            $table->date('fecha');
            $table->time('horainicio');
            $table->time('horafin')->nullable();
            // $table->enum('estado', ['A', 'N'])->default('A');
            $table->string('estado', 1)->default('A');
            $table->softDeletes();
            $table->timestamps();
            $table->foreign('fkidusuario')->references('id')->on('users')->ondelete('cascade');
            $table->foreign('fkidsolicituddetalle')->references('idsolicituddetalle')->on('solicituddetalle')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('asignartrabajo');
    }
}
