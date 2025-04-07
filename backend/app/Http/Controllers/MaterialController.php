<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Material;
use App\Models\Clase;
use Illuminate\Support\Facades\Storage;

class MaterialController extends Controller
{
    public function index($claseId)
    {
        return Material::where('clase_id', $claseId)->get();
    }

    public function store(Request $request, $claseId)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'archivo' => 'nullable|file|max:10240', // max 10MB
        ]);

        $rutaArchivo = null;

        if ($request->hasFile('archivo')) {
            $rutaArchivo = $request->file('archivo')->store('materiales', 'public');
        }

        $material = Material::create([
            'clase_id' => $claseId,
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
            'archivo' => $rutaArchivo,
        ]);

        return response()->json($material, 201);
    }
}
