<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entrega extends Model
{
    use HasFactory;

    protected $fillable = [
        'alumno_id',
        'tarea_id',
        'clase_id',
        'profesor_id',
        'comentario',
        'archivo',
        'entregado_en',
        'calificacion',
    ];

    // Relaciones
    public function alumno()
    {
        return $this->belongsTo(Usuario::class, 'alumno_id');
    }

    public function tarea()
    {
        return $this->belongsTo(Tarea::class);
    }

    public function clase()
    {
        return $this->belongsTo(Clase::class);
    }

    public function profesor()
    {
        return $this->belongsTo(Usuario::class, 'profesor_id');
    }
}
