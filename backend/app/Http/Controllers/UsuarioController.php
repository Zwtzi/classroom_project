<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    public function index()
    {
        return response()->json(['message' => 'Welcome to the user creation page']);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|max:100',
            'correo' => 'required|email|unique:usuarios,correo',
            'contrasena' => 'required|min:6',
            'tipo' => 'required|in:Alumno,Profesor,Administrador'
        ]);

        $usuario = Usuario::create([
            'nombre' => $request->nombre,
            'correo' => $request->correo,
            'contrasena' => Hash::make($request->contrasena),
            'tipo' => $request->tipo
        ]);

        return response()->json([
            'message' => 'Usuario registrado correctamente',
            'usuario' => $usuario
        ]);
    }

    public function getAlumnos()
    {
        $alumnos = Usuario::where('tipo', 'Alumno')->get(['id', 'nombre', 'correo']);
        return response()->json($alumnos);
    }

}
