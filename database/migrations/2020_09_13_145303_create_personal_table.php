<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePersonalTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('personal', function (Blueprint $table) {
            $table->increments('idpersonal');
            $table->integer('fkidusuario')->unsigned()->nullable();
            $table->string('ci', 20)->unique()->nullable();
            $table->string('ciudad', 40)->nullable();
            $table->string('direccion', 70)->nullable();
            $table->text('contacto')->nullable();
            $table->string('estado', 1)->default('A');
            $table->softDeletes();
            $table->timestamps();
            $table->foreign('fkidusuario')->references('id')->on('users')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('personal');
    }
}
