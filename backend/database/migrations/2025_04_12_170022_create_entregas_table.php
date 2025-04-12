<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('entregas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('alumno_id')->constrained('usuarios')->onDelete('cascade');
            $table->foreignId('tarea_id')->constrained('tareas')->onDelete('cascade');
            $table->foreignId('clase_id')->constrained('clases')->onDelete('cascade');
            $table->foreignId('profesor_id')->constrained('usuarios')->onDelete('cascade');
            $table->text('comentario')->nullable();
            $table->string('archivo')->nullable(); // Ruta al archivo enviado
            $table->timestamp('entregado_en')->nullable(); // Fecha y hora de entrega
            $table->unsignedTinyInteger('calificacion')->nullable(); // ✅ Sin 'after'
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
        Schema::dropIfExists('entregas');
    }
};
