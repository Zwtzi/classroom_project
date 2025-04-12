<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Material;
use App\Models\Clase;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class MaterialController extends Controller
{
    // Mostrar los materiales de una clase específica
    public function index($claseId)
    {
        return Material::where('clase_id', $claseId)->get();
    }

    // Guardar un nuevo material
    public function store(Request $request, $claseNombre)
    {
        // Validar los campos del formulario
        $validator = Validator::make($request->all(), [
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'archivo' => 'nullable|file|mimes:pdf,jpeg,jpg,png|max:10240', // archivo máximo de 10MB y tipos específicos
        ]);

        // Si la validación falla, devolver un error
        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'details' => $validator->errors()
            ], 422);
        }

        // Buscar la clase por nombre
        $clase = Clase::where('codigo_grupo', $claseNombre)->first();

        // Si no se encuentra la clase, devolver un error
        if (!$clase) {
            return response()->json([
                'error' => 'Clase no encontrada'
            ], 404);
        }

        $rutaArchivo = null;

        // Verificar si hay un archivo y guardarlo
        if ($request->hasFile('archivo')) {
            try {
                // Almacenar el archivo en el directorio 'materiales' dentro de 'public'
                $rutaArchivo = $request->file('archivo')->store('materiales', 'public');
            } catch (\Exception $e) {
                return response()->json([
                    'error' => 'File upload failed',
                    'message' => $e->getMessage()
                ], 500);
            }
        }

        // Crear el material en la base de datos
        $material = Material::create([
            'clase_id' => $clase->id, // Usar el id de la clase encontrada
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
            'archivo' => $rutaArchivo,
        ]);

        // Responder con el material creado, incluyendo la URL del archivo
        return response()->json([
            'id' => $material->id,
            'titulo' => $material->titulo,
            'descripcion' => $material->descripcion,
            'archivo' => $rutaArchivo ? Storage::url($rutaArchivo) : null // Genera la URL accesible públicamente
        ], 201);
    }
}
