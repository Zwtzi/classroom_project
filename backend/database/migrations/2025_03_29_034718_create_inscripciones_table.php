<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('inscripciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_alumno')->constrained('usuarios')->onDelete('cascade');
            $table->foreignId('id_curso')->constrained('cursos')->onDelete('cascade');
            $table->date('fecha_inscripcion')->default(now());
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('inscripciones');
    }
};

