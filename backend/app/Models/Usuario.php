<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Usuario extends Authenticatable
{
    use HasFactory;

    protected $table = 'usuarios';
    protected $fillable = ['nombre', 'correo', 'contrasena', 'tipo'];

    protected $hidden = ['contrasena'];

    public function clases()
    {
        return $this->hasMany(Clase::class, 'profesor_id');
    }

    public function clasesComoAlumno()
    {
        return $this->belongsToMany(Clase::class, 'clase_alumno', 'alumno_id', 'clase_id');
    }


}
