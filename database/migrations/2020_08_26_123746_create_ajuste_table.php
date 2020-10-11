<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAjusteTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ajuste', function (Blueprint $table) {
            $table->increments('idajuste');
            $table->integer('fkidusuario')->unsigned();
            $table->string('colorheader', 40)->nullable();
            $table->string('colorsidebar', 40)->nullable();
            $table->string('colorfooter', 40)->nullable();
            $table->string('colorplantilla',40)->nullable();
            $table->string('colorgeneral', 40)->nullable();
            $table->string('sizetext', 35)->nullable();
            $table->string('fontfamilytext', 35)->nullable();
            $table->string('fontweighttext', 35)->nullable();
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
        Schema::dropIfExists('ajuste');
    }
}
