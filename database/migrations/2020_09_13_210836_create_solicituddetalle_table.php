<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSolicituddetalleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('solicituddetalle', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('idsolicitud')->unsigned();
            $table->integer('idservicio')->unsigned();
            $table->integer('cantidad');
            $table->decimal('precio', 12, 2);
            $table->decimal('descuento', 12, 2);
            $table->text('nota')->nullable();
            $table->enum('estadoproceso', ['P', 'E', 'F', 'C', 'N'])->default('P');
            $table->enum('estado', ['A', 'N'])->default('A');
            $table->softDeletes();
            $table->timestamps();
            $table->foreign('idsolicitud')->references('id')->on('solicitud')->ondelete('cascade');
            $table->foreign('idservicio')->references('id')->on('servicio')->ondelete('cascade');
            // P = pendiente
            // E = En Proceso
            // F = Finalizado
            // C = Cancelado
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
        Schema::dropIfExists('solicituddetalle');
    }
}
