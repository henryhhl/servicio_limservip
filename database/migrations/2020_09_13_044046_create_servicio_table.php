<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateServicioTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('servicio', function (Blueprint $table) {
            $table->increments('idservicio');
            $table->integer('fkidcategoria')->unsigned()->nullable();
            $table->string('nombre', 70);
            $table->text('descripcion')->nullable();
            $table->longText('imagen')->nullable();
            $table->decimal('precio', 12, 2);
            $table->string('estado', 1)->default('A');
            $table->softDeletes();
            $table->timestamps();
            $table->foreign('fkidcategoria')->references('idcategoria')->on('categoria')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('servicio');
    }
}
