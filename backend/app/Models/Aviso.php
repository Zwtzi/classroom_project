<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Aviso extends Model
{
    use HasFactory;

    protected $table = 'avisos';
    protected $fillable = ['clase_id', 'contenido'];

    public function clase()
    {
        return $this->belongsTo(Clase::class);
    }

    public function anexos()
    {
        return $this->hasMany(Anexo::class);
    }
}
