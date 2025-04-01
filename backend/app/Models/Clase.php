<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Clase extends Model
{
    use HasFactory;

    protected $table = 'clases';
    protected $fillable = ['nombre', 'descripcion', 'codigo_grupo', 'carrera', 'profesor_id'];

    public function profesor()
    {
        return $this->belongsTo(Usuario::class, 'profesor_id');
    }

    public function tareas()
    {
        return $this->hasMany(Tarea::class);
    }

    public function avisos()
    {
        return $this->hasMany(Aviso::class);
    }

    public function materiales()
    {
        return $this->hasMany(Material::class);
    }

    public function temas()
    {
        return $this->hasMany(Tema::class);
    }

    public function alumnos()
    {
        return $this->belongsToMany(Usuario::class, 'clase_alumno', 'clase_id', 'alumno_id');
    }


}
