<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Aviso;
use App\Models\Anexo;
use Illuminate\Support\Facades\Storage;

class AvisoController extends Controller
{
    // Obtener avisos de una clase
    public function index($codigo_grupo)
    {
        // Buscar la clase por el código de grupo
        $clase = \App\Models\Clase::where('codigo_grupo', $codigo_grupo)->first();

        if (!$clase) {
            return response()->json(['error' => 'Clase no encontrada'], 404);
        }

        // Obtener avisos de la clase encontrada
        $avisos = Aviso::where('clase_id', $clase->id)
            ->with('anexos')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($avisos);
    }


    // Crear un aviso con anexos
    public function store(Request $request, $codigo_grupo)
    {
        // Depuración: Verifica los datos recibidos
        \Log::info('Datos recibidos:', $request->all());
        \Log::info('Archivos recibidos:', $request->file());

        // Buscar la clase por el código de grupo
        $clase = \App\Models\Clase::where('codigo_grupo', $codigo_grupo)->first();

        if (!$clase) {
            return response()->json(['error' => 'Clase no encontrada'], 404);
        }

        // Validación de datos
        $request->validate([
            'contenido' => 'required|string',
            'anexos' => 'nullable|array',
            'anexos.*' => 'file|mimes:jpg,jpeg,png,pdf|max:2048'
        ]);

        // Crear el aviso
        $aviso = Aviso::create([
            'clase_id' => $clase->id,
            'contenido' => $request->contenido
        ]);

        // Guardar los archivos si existen
        if ($request->hasFile('anexos')) {
            foreach ($request->file('anexos') as $archivo) {
                if (!$archivo->isValid()) {
                    return response()->json(['error' => 'El archivo no es válido'], 400);
                }

                // Guardar el archivo en storage/app/public/anexos y obtener la ruta
                $ruta = $archivo->store('anexos', 'public'); 

                if (!$ruta) {
                    return response()->json(['error' => 'Error al guardar el archivo'], 500);
                }

                // Guardar la ruta en la base de datos
                Anexo::create([
                    'aviso_id' => $aviso->id,
                    'ruta_archivo' => $ruta
                ]);
            }
        }

        return response()->json($aviso->load('anexos'));
    }



}
