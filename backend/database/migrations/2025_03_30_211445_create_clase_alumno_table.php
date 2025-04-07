<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClaseAlumnoTable extends Migration
{
    public function up()
    {
        Schema::create('clase_alumno', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('clase_id');
            $table->unsignedBigInteger('alumno_id');
            $table->timestamps();

            $table->foreign('clase_id')->references('id')->on('clases')->onDelete('cascade');
            $table->foreign('alumno_id')->references('id')->on('usuarios')->onDelete('cascade');

            // Agregar restricción única para evitar registros duplicados
            $table->unique(['clase_id', 'alumno_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('clase_alumno');
    }
}
