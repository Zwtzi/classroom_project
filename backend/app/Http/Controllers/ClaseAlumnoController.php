<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ClaseAlumno;

class ClaseAlumnoController extends Controller
{
    /**
     * Agregar un alumno a una clase.
     */
    public function store(Request $request)
    {
        $request->validate([
            'clase_id' => 'required|exists:clases,id',
            'alumno_id' => 'required|exists:usuarios,id',
        ]);

        $claseAlumno = ClaseAlumno::create([
            'clase_id' => $request->clase_id,
            'alumno_id' => $request->alumno_id,
        ]);

        return response()->json(['message' => 'Alumno agregado a la clase', 'data' => $claseAlumno], 201);
    }

    /**
     * Eliminar un alumno de una clase.
     */
    public function destroy($id)
    {
        $claseAlumno = ClaseAlumno::find($id);

        if (!$claseAlumno) {
            return response()->json(['message' => 'Registro no encontrado'], 404);
        }

        $claseAlumno->delete();

        return response()->json(['message' => 'Alumno eliminado de la clase']);
    }
}
