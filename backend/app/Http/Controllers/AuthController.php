<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Validar las credenciales
        $request->validate([
            'correo' => 'required|email',
            'contrasena' => 'required|min:6',
        ]);

        // Buscar al usuario por correo
        $usuario = Usuario::where('correo', $request->correo)->first();

        // Verificar si el usuario existe y la contraseña es correcta
        if ($usuario && Hash::check($request->contrasena, $usuario->contrasena)) {
            // Devolver todos los datos del usuario
            return response()->json([
                'id' => $usuario->id,
                'nombre' => $usuario->nombre,
                'correo' => $usuario->correo,
                'tipo' => $usuario->tipo,
                'created_at' => $usuario->created_at,
                'updated_at' => $usuario->updated_at
            ]);
        }

        // Si las credenciales son incorrectas
        return response()->json(['error' => 'Credenciales incorrectas'], 401);
    }
}
