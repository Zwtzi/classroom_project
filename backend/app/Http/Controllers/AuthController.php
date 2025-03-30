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

        $usuario = Usuario::where('correo', $request->correo)->first();

        // Verificar si el usuario existe y la contraseña es correcta
        if ($usuario && Hash::check($request->contrasena, $usuario->contrasena)) {
            // Devolver el tipo de usuario
            return response()->json([
                'tipo' => $usuario->tipo
            ]);
        }

        // Si las credenciales son incorrectas
        return response()->json(['error' => 'Credenciales incorrectas'], 401);
    }
}
