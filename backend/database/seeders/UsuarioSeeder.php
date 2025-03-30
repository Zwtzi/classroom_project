<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;

class UsuarioSeeder extends Seeder
{
    public function run()
    {
        // Crear un Administrador
        Usuario::create([
            'nombre' => 'Administrador',
            'correo' => 'admin@dominio.com',
            'contrasena' => Hash::make('admin123'),
            'tipo' => 'Administrador',
        ]);

        // Crear un Profesor
        Usuario::create([
            'nombre' => 'Profesor',
            'correo' => 'profesor@dominio.com',
            'contrasena' => Hash::make('profesor123'),
            'tipo' => 'Profesor',
        ]);

        // Crear un Alumno
        Usuario::create([
            'nombre' => 'Alumno',
            'correo' => 'alumno@dominio.com',
            'contrasena' => Hash::make('alumno123'),
            'tipo' => 'Alumno',
        ]);
    }
}
