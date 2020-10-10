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
            $table->string('colorheader', 25)->nullable();
            $table->string('colorsidebar', 25)->nullable();
            $table->string('colorfooter', 25)->nullable();
            $table->string('colorplantilla',25)->nullable();
            $table->string('colorgeneral', 25)->nullable();
            $table->string('sizetext', 20)->nullable();
            $table->string('fontfamilytext', 20)->nullable();
            $table->string('fontweighttext', 20)->nullable();
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
