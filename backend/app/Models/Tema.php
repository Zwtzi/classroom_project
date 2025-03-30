<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tema extends Model
{
    use HasFactory;

    protected $table = 'temas';
    protected $fillable = ['clase_id', 'nombre', 'descripcion'];

    public function clase()
    {
        return $this->belongsTo(Clase::class);
    }
}
