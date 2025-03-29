<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('materiales', function (Blueprint $table) {
            $table->id();
            $table->string('titulo', 255);
            $table->text('descripcion')->nullable();
            $table->string('url', 255)->nullable();
            $table->foreignId('id_curso')->constrained('cursos')->onDelete('cascade');
            $table->timestamp('fecha_publicacion')->default(now());
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('materiales');
    }
};
