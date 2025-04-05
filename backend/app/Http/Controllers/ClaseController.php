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
        $request->validate([
            'alumno_id' => 'required|exists:usuarios,id',
        ]);

        $claseAlumno = ClaseAlumno::create([
            'clase_id' => $claseId,
            'alumno_id' => $request->alumno_id,
        ]);

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




}
