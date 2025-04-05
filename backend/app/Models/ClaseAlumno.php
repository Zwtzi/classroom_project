<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClaseAlumno extends Model
{
    use HasFactory;

    protected $table = 'clase_alumno';

    protected $fillable = [
        'clase_id',
        'alumno_id',
    ];

    public function clase()
    {
        return $this->belongsTo(Clase::class, 'clase_id');
    }

    public function alumno()
    {
        return $this->belongsTo(Usuario::class, 'alumno_id'); // Si el modelo de usuarios es "User"
    }
}
