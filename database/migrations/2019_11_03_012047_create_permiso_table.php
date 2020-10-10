<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePermisoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('permiso', function (Blueprint $table) {
            $table->increments('idpermiso');
            $table->integer('fkidpermiso')->unsigned()->nullable();
            $table->string('nombre', 70);
            // $table->enum('estado', ['A', 'N'])->default('A');
            $table->string('estado', 1)->default('A');
            $table->softDeletes();
            $table->timestamps();
            $table->foreign('fkidpermiso')->references('idpermiso')->on('permiso')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('permiso');
    }
}
