<?php

namespace App\Http\Controllers;

use App\Models\Entrega;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EntregaController extends Controller
{
    // Mostrar todas las entregas
    public function index()
    {
        return Entrega::with(['alumno', 'tarea', 'clase', 'profesor'])->get();
    }

    // Registrar una nueva entrega
    public function store(Request $request)
    {
        $request->validate([
            'alumno_id' => 'required|exists:usuarios,id',
            'tarea_id' => 'required|exists:tareas,id',
            'clase_id' => 'required|exists:clases,id',
            'profesor_id' => 'required|exists:usuarios,id',
            'archivo' => 'nullable|string',
            'comentario' => 'nullable|string',
            'entregado_en' => 'nullable|date',
            'calificacion' => 'nullable|integer|min:0|max:100',
        ]);

        $entrega = Entrega::create($request->all());

        return response()->json($entrega, 201);
    }

    // Mostrar una entrega específica
    public function show($id)
    {
        return Entrega::with(['alumno', 'tarea', 'clase', 'profesor'])->findOrFail($id);
    }

    // Actualizar calificación o datos
    public function update(Request $request, $id)
    {
        $request->validate([
            'calificacion' => 'required|integer|min:0|max:100',
        ]);

        $entrega = Entrega::findOrFail($id);
        $entrega->calificacion = $request->input('calificacion');
        $entrega->save();

        return response()->json(['message' => 'Calificación actualizada correctamente', 'data' => $entrega], 200);
    }

    // Eliminar entrega (si se desea permitir)
    public function destroy($id)
    {
        $entrega = Entrega::findOrFail($id);
        $entrega->delete();

        return response()->json(['message' => 'Entrega eliminada.']);
    }

    public function subirArchivo(Request $request, $id)
    {
        $entrega = Entrega::findOrFail($id);

        // Verificar que la tarea aún esté en plazo
        if ($entrega->tarea && $entrega->tarea->fecha_limite < now()) {
            return response()->json(['error' => 'La fecha límite ya pasó. No puedes entregar.'], 403);
        }

        $request->validate([
            'archivo' => 'required|file|mimes:pdf,doc,docx,zip,rar,txt|max:20480', // 20MB máx
        ]);

        $archivo = $request->file('archivo');
        $ruta = $archivo->store('entregas', 'public');

        $entrega->archivo = $ruta;
        $entrega->entregado_en = now();
        $entrega->save();

        return response()->json([
            'message' => 'Archivo subido correctamente',
            'archivo' => $ruta
        ]);
    }

    public function entregaPorAlumnoYTarea(Request $request)
    {
        \Log::info('🚨 Parámetros recibidos en entregaPorAlumnoYTarea:', $request->all());

        $alumno_id = $request->query('alumno_id');
        $tarea_id = $request->query('tarea_id');

        $request->validate([
            'alumno_id' => 'required|exists:usuarios,id',
            'tarea_id' => 'required|exists:tareas,id',
        ]);

        $entrega = Entrega::where('alumno_id', $alumno_id)
                        ->where('tarea_id', $tarea_id)
                        ->first();

        if (!$entrega) {
            return response()->json(['error' => 'Entrega no encontrada'], 404);
        }

        return response()->json($entrega);
    }

}
