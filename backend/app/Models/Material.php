<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    use HasFactory;

    protected $table = 'materiales';
    protected $fillable = ['clase_id', 'titulo', 'descripcion', 'archivo'];

    public function clase()
    {
        return $this->belongsTo(Clase::class);
    }
}
