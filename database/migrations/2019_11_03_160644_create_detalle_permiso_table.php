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
            $table->increments('idpermisodetalle');
            $table->integer('fkidpermiso')->unsigned();
            $table->integer('fkidrol')->unsigned();
            // $table->enum('estado', ['A', 'N'])->default('A');
            $table->string('estado', 1)->default('A');
            $table->softDeletes();
            $table->timestamps();
            $table->foreign('fkidpermiso')->references('idpermiso')->on('permiso')->ondelete('cascade');
            $table->foreign('fkidrol')->references('idrol')->on('rol')->ondelete('cascade');
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
