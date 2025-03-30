<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMaterialesTable extends Migration
{
    public function up()
    {
        Schema::create('materiales', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('clase_id'); // Relación con la clase
            $table->string('titulo');
            $table->text('descripcion')->nullable();
            $table->string('archivo')->nullable(); // Ruta del archivo
            $table->timestamps();

            $table->foreign('clase_id')->references('id')->on('clases')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('materiales');
    }
}
