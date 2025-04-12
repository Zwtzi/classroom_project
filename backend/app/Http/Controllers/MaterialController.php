<?php

namespace App\Http\Controllers;

use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MaterialController extends Controller
{
    // Crear nuevo material
    public function store(Request $request)
    {
        $request->validate([
            'clase_id' => 'required|exists:clases,id',
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'archivo' => 'nullable|file|max:10240' // Máx 10 MB
        ]);

        $rutaArchivo = null;

        if ($request->hasFile('archivo')) {
            $rutaArchivo = $request->file('archivo')->store('materiales', 'public');
        }

        $material = Material::create([
            'clase_id' => $request->clase_id,
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
            'archivo' => $rutaArchivo,
        ]);

        return response()->json($material, 201);
    }

    // Listar materiales por clase
    public function index($clase_id)
    {
        $materiales = Material::where('clase_id', $clase_id)->get();
        return response()->json($materiales);
    }

    // Actualizar material
    public function update(Request $request, $id)
    {
        $material = Material::findOrFail($id);

        $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'archivo' => 'nullable|file|max:10240'
        ]);

        // Si hay nuevo archivo, eliminar el viejo y guardar el nuevo
        if ($request->hasFile('archivo')) {
            if ($material->archivo && Storage::disk('public')->exists($material->archivo)) {
                Storage::disk('public')->delete($material->archivo);
            }
            $material->archivo = $request->file('archivo')->store('materiales', 'public');
        }

        $material->titulo = $request->titulo;
        $material->descripcion = $request->descripcion;
        $material->save();

        return response()->json($material);
    }

    // Eliminar material
    public function destroy($id)
    {
        $material = Material::findOrFail($id);

        if ($material->archivo && Storage::disk('public')->exists($material->archivo)) {
            Storage::disk('public')->delete($material->archivo);
        }

        $material->delete();

        return response()->json(['message' => 'Material eliminado correctamente.']);
    }
}
