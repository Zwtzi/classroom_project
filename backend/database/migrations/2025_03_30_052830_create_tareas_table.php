<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTareasTable extends Migration
{
    public function up()
    {
        Schema::create('tareas', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->text('instrucciones');
            $table->unsignedBigInteger('clase_id'); // Relación con la clase
            $table->dateTime('fecha_limite');
            $table->timestamps();

            $table->foreign('clase_id')->references('id')->on('clases')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('tareas');
    }
}
