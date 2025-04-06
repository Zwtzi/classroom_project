<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tema;
use App\Models\Clase;

class TemaController extends Controller
{
    // Obtener todos los temas de una clase usando el código_grupo
    public function index($codigo_grupo)
    {
        $clase = Clase::where('codigo_grupo', $codigo_grupo)->first();

        if (!$clase) {
            return response()->json(['error' => 'Clase no encontrada'], 404);
        }

        $temas = Tema::where('clase_id', $clase->id)->orderBy('created_at', 'desc')->get();

        return response()->json($temas);
    }

    // Guardar un nuevo tema
    public function store(Request $request, $codigo_grupo)
    {
        $clase = Clase::where('codigo_grupo', $codigo_grupo)->first();

        if (!$clase) {
            return response()->json(['error' => 'Clase no encontrada'], 404);
        }

        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
        ]);

        $tema = Tema::create([
            'clase_id' => $clase->id,
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
        ]);

        return response()->json($tema, 201);
    }
}
