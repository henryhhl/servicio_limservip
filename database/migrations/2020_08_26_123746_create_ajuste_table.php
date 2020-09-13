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
            $table->increments('id');
            $table->integer('idusuario')->unsigned();
            $table->text('colorheader')->nullable();
            $table->text('colorsidebar')->nullable();
            $table->text('colorfooter')->nullable();
            $table->text('colorplantilla')->nullable();
            $table->text('colorgeneral')->nullable();
            $table->text('sizetext')->nullable();
            $table->text('fontfamilytext')->nullable();
            $table->text('fontweighttext')->nullable();
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
        Schema::dropIfExists('ajuste');
    }
}
