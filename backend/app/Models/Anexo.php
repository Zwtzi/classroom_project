<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Anexo extends Model
{
    use HasFactory;

    protected $table = 'anexos';
    protected $fillable = ['aviso_id', 'ruta_archivo'];

    public function aviso()
    {
        return $this->belongsTo(Aviso::class);
    }
}