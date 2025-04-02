<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('anexos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('aviso_id')->constrained('avisos')->onDelete('cascade');
            $table->string('ruta_archivo')->nullable();
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('anexos');
    }
};
