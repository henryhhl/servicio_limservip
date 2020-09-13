<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVisitasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('visitas', function (Blueprint $table) {
            $table->increments('id');
            $table->text('inicio')->nullable();

            $table->text('usuario')->nullable();
            $table->text('usuariocreate')->nullable();
            $table->text('usuarioedit')->nullable();
            $table->text('usuarioshow')->nullable();

            $table->text('grupousuario')->nullable();
            $table->text('grupousuariocreate')->nullable();
            $table->text('grupousuarioedit')->nullable();
            $table->text('grupousuarioshow')->nullable();

            $table->text('asignarpermiso')->nullable();

            $table->text('mantenimiento')->nullable();
            $table->text('mantenimientocreate')->nullable();
            $table->text('mantenimientoshow')->nullable();

            $table->text('cliente')->nullable();
            $table->text('clientecreate')->nullable();
            $table->text('clienteedit')->nullable();
            $table->text('clienteshow')->nullable();

            $table->text('mecanico')->nullable();
            $table->text('mecanicocreate')->nullable();
            $table->text('mecanicoedit')->nullable();
            $table->text('mecanicoshow')->nullable();

            $table->text('vehiculo')->nullable();
            $table->text('vehiculocreate')->nullable();
            $table->text('vehiculoedit')->nullable();
            $table->text('vehiculoshow')->nullable();
            
            $table->text('vehiculotipocreate')->nullable();
            $table->text('vehiculotipoedit')->nullable();
            $table->text('vehiculotiposhow')->nullable();

            $table->text('marcacreate')->nullable();
            $table->text('marcaedit')->nullable();
            $table->text('marcashow')->nullable();

            $table->text('modelocreate')->nullable();
            $table->text('modeloedit')->nullable();
            $table->text('modeloshow')->nullable();

            $table->text('colorcreate')->nullable();
            $table->text('coloredit')->nullable();
            $table->text('colorshow')->nullable();

            $table->text('yearcreate')->nullable();
            $table->text('yearedit')->nullable();
            $table->text('yearshow')->nullable();

            $table->text('producto')->nullable();
            $table->text('productocreate')->nullable();
            $table->text('productoedit')->nullable();
            $table->text('productoshow')->nullable();

            $table->text('categoriacreate')->nullable();
            $table->text('categoriaedit')->nullable();
            $table->text('categoriashow')->nullable();

            $table->text('articulocreate')->nullable();
            $table->text('articuloedit')->nullable();
            $table->text('articuloshow')->nullable();

            $table->text('promocion')->nullable();
            $table->text('promocioncreate')->nullable();
            $table->text('promocionedit')->nullable();
            $table->text('promocionshow')->nullable();

            $table->text('reportemantenimiento')->nullable();

            $table->text('ajuste')->nullable();
            $table->text('perfil')->nullable();

            $table->text('totalvisita')->nullable();
            $table->date('fecha')->nullable();
            $table->time('hora')->nullable();

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('visitas');
    }
}
