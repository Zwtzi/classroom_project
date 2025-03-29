<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('entregas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_tarea')->constrained('tareas')->onDelete('cascade');
            $table->foreignId('id_alumno')->constrained('usuarios')->onDelete('cascade');
            $table->string('archivo_url', 255);
            $table->timestamp('fecha_entrega')->default(now());
            $table->decimal('calificacion', 5, 2)->nullable();
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('entregas');
    }
};
