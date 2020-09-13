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
            $table->increments('id');
            $table->integer('idusuario')->unsigned()->nullable();
            $table->string('ci')->nullable();
            $table->string('ciudad')->nullable();
            $table->string('direccion')->nullable();
            $table->text('contacto')->nullable();
            $table->enum('estado', ['A', 'N'])->default('A');
            $table->softDeletes();
            $table->timestamps();
            $table->foreign('idusuario')->references('id')->on('users')->ondelete('cascade');
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
