<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Clase;

class ClaseController extends Controller
{
    public function store(Request $request)
    {
        // Validar los datos antes de guardarlos
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'codigo_grupo' => 'required|string|max:50',
            'carrera' => 'required|string|max:255',
            'profesor_id' => 'required|exists:usuarios,id', // Asegurar que el profesor existe
        ]);

        // Crear la nueva clase
        $clase = Clase::create([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'codigo_grupo' => $request->codigo_grupo,
            'carrera' => $request->carrera,
            'profesor_id' => $request->profesor_id,
        ]);

        return response()->json([
            'message' => 'Clase creada con éxito',
            'clase' => $clase
        ], 201);
    }

    public function index()
    {
        $clases = Clase::all(); // Recupera todas las clases
        return response()->json($clases);
    }

    public function agregarAlumno(Request $request, $claseId)
    {
        // Encuentra la clase
        $clase = Clase::findOrFail($claseId);

        // Busca el alumno por nombre o ID
        $alumno = Usuario::where('tipo', 'Alumno')
            ->where(function ($query) use ($request) {
                $query->where('nombre', $request->nombre)
                    ->orWhere('id', $request->id);
            })
            ->first();

        // Verifica si el alumno fue encontrado
        if (!$alumno) {
            \Log::info('Alumno no encontrado', ['nombre' => $request->nombre, 'id' => $request->id]);
            return response()->json(['message' => 'Alumno no encontrado'], 404);
        }

        // Verifica si el alumno ya está inscrito
        if ($clase->alumnos()->where('alumno_id', $alumno->id)->exists()) {
            return response()->json(['message' => 'El alumno ya está inscrito'], 400);
        }

        // Intenta agregar al alumno
        $clase->alumnos()->attach($alumno->id);

        // Verifica si el alumno fue agregado correctamente
        $alumnosInscritos = $clase->alumnos()->get();

        return response()->json([
            'message' => 'Alumno agregado correctamente',
            'alumnos_inscritos' => $alumnosInscritos
        ]);
    }



    public function listarAlumnos($claseId)
    {
        $clase = Clase::findOrFail($claseId);
        return response()->json($clase->alumnos);
    }


}
