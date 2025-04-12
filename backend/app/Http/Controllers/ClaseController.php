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
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'codigo_grupo' => 'required|string|max:50',
            'carrera' => 'required|string|max:255',
            'profesor_id' => 'required|exists:usuarios,id',
        ]);

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
        $clases = Clase::all();
        return response()->json($clases);
    }

    public function agregarAlumno(Request $request, $claseId)
    {
        $request->validate([
            'alumno_id' => 'required|exists:usuarios,id',
        ]);

        // Buscar la clase por ID (ya que el parámetro se llama claseId)
        $clase = Clase::find($claseId);

        if (!$clase) {
            return response()->json(['error' => 'Clase no encontrada.'], 404);
        }

        // Verificar si el alumno ya está inscrito para evitar duplicados
        $existe = ClaseAlumno::where('clase_id', $clase->id)
                             ->where('alumno_id', $request->alumno_id)
                             ->exists();

        if ($existe) {
            return response()->json(['error' => 'El alumno ya está inscrito en esta clase.'], 409);
        }

        // Crear la relación clase-alumno
        ClaseAlumno::create([
            'clase_id' => $clase->id,
            'alumno_id' => $request->alumno_id,
        ]);

        $alumno = Usuario::find($request->alumno_id);

        return response()->json($alumno, 201);
    }

    public function listarAlumnos($claseId)
    {
        $clase = Clase::find($claseId);

        if (!$clase) {
            return response()->json(['message' => 'Clase no encontrada'], 404);
        }

        // Asegúrate de tener la relación definida en el modelo Clase: public function alumnos()
        $alumnos = $clase->alumnos;

        return response()->json($alumnos);
    }

    public function show($id)
    {
        $clase = Clase::find($id);

        if (!$clase) {
            return response()->json(['message' => 'Clase no encontrada'], 404);
        }

        return response()->json($clase);
    }
}
