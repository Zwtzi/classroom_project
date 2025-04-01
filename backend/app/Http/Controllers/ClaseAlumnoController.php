<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ClaseAlumno;
use App\Models\Usuario;
use App\Models\Clase;
use Illuminate\Database\QueryException;

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

        try {
            $claseAlumno = ClaseAlumno::create([
                'clase_id' => $request->clase_id,
                'alumno_id' => $request->alumno_id,
            ]);

            return response()->json(['message' => 'Alumno agregado a la clase', 'data' => $claseAlumno], 201);
        } catch (QueryException $e) {
            if ($e->errorInfo[1] == 1062) { // Restricción única en MySQL
                return response()->json(['message' => 'Este alumno ya está inscrito en esta clase'], 400);
            }

            return response()->json(['message' => 'Error al agregar alumno'], 500);
        }
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

    /**
     * Obtener las clases en las que está inscrito un alumno.
     */
    public function clasesPorAlumno($alumnoId)
    {
        $alumno = Usuario::with('clasesComoAlumno')->find($alumnoId);

        if (!$alumno) {
            return response()->json(['message' => 'Alumno no encontrado'], 404);
        }

        return response()->json($alumno->clasesComoAlumno);
    }




}
