<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tarea extends Model
{
    use HasFactory;

    protected $table = 'tareas';
    protected $fillable = ['titulo', 'instrucciones', 'clase_id', 'fecha_limite'];

    public function clase()
    {
        return $this->belongsTo(Clase::class);
    }
}
