<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tarea;
use App\Models\Clase;
use App\Models\Tema;
use App\Models\Aviso;  // Importamos el modelo Aviso

class TareaController extends Controller
{
    // Mostrar todas las tareas de una clase (agrupadas o no por tema)
    public function index($codigo_grupo)
    {
        $clase = Clase::where('codigo_grupo', $codigo_grupo)->first();

        if (!$clase) {
            return response()->json(['error' => 'Clase no encontrada'], 404);
        }

        $tareas = Tarea::where('clase_id', $clase->id)->with('tema')->orderBy('created_at', 'desc')->get();

        return response()->json($tareas);
    }

    // Crear nueva tarea con tema opcional
    public function store(Request $request, $codigo_grupo)
    {
        $clase = \App\Models\Clase::where('codigo_grupo', $codigo_grupo)->first();

        if (!$clase) {
            return response()->json(['error' => 'Clase no encontrada'], 404);
        }

        $request->validate([
            'titulo' => 'required|string|max:255',
            'instrucciones' => 'required|string',
            'fecha_limite' => 'required|date',
            'tema_id' => 'required|exists:temas,id'
        ]);

        // Verificamos que el tema pertenezca a la clase
        $tema = \App\Models\Tema::where('id', $request->tema_id)
            ->where('clase_id', $clase->id)
            ->first();

        if (!$tema) {
            return response()->json(['error' => 'El tema no pertenece a esta clase'], 400);
        }

        // Crear la tarea
        $tarea = \App\Models\Tarea::create([
            'titulo' => $request->titulo,
            'instrucciones' => $request->instrucciones,
            'fecha_limite' => $request->fecha_limite,
            'clase_id' => $clase->id,
            'tema_id' => $tema->id
        ]);

        // Crear un aviso relacionado con la tarea
        Aviso::create([
            'clase_id' => $clase->id,
            'contenido' => 'Nueva tarea publicada: ' . $tarea->titulo,
        ]);

        return response()->json($tarea, 201);
    }
}
