<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Clase;
use App\Models\ClaseAlumno;
use App\Models\Usuario;
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
            'profesor_id' => 'required|exists:usuarios,id',
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

    public function agregarAlumno(Request $request, $classCode)
    {
        // Validar que el alumno existe
        $request->validate([
            'alumno_id' => 'required|exists:usuarios,id',
        ]);

        // Buscar la clase por el código de grupo
        $clase = Clase::where('codigo_grupo', $classCode)->first();

        // Verificar si la clase existe
        if (!$clase) {
            return response()->json(['error' => 'Clase no encontrada.'], 404);
        }

        // Agregar la relación en la tabla 'clase_alumno'
        $claseAlumno = ClaseAlumno::create([
            'clase_id' => $clase->id,  // Usamos el 'id' de la clase encontrada
            'alumno_id' => $request->alumno_id,
        ]);

        // Obtener la información del alumno para retornarla
        $alumno = Usuario::find($request->alumno_id);

        return response()->json($alumno, 201);
    }


    public function listarAlumnos($claseId)
    {
        // Asegúrate de que la clase existe
        $clase = Clase::find($claseId);

        if (!$clase) {
            return response()->json(['message' => 'Clase no encontrada'], 404);
        }

        // Obtener los alumnos de la clase
        $alumnos = $clase->alumnos; // Supongamos que tienes una relación 'alumnos' en la clase

        return response()->json($alumnos);
    }

    public function show($id)
    {
        $clase = \App\Models\Clase::find($id); // Asegúrate de importar tu modelo Clase

        if (!$clase) {
            return response()->json(['message' => 'Clase no encontrada'], 404);
        }

        return response()->json($clase);
    }
}
