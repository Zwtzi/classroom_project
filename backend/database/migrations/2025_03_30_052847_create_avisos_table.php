<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAvisosTable extends Migration
{
    public function up()
    {
        Schema::create('avisos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('clase_id'); // Relación con la clase
            $table->text('contenido');
            $table->timestamps();

            $table->foreign('clase_id')->references('id')->on('clases')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('avisos');
    }
}
