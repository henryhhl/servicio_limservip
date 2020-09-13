<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDetallePermisoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('detalle_permiso', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('idpermiso')->unsigned();
            $table->integer('idrol')->unsigned();
            $table->enum('estado', ['A', 'N'])->default('A');
            $table->softDeletes();
            $table->timestamps();
            $table->foreign('idpermiso')->references('id')->on('permiso')->ondelete('cascade');
            $table->foreign('idrol')->references('id')->on('rol')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('detalle_permiso');
    }
}
