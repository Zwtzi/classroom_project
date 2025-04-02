<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClaseController;
use App\Http\Controllers\ClaseAlumnoController;
use App\Http\Controllers\AvisoController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/usuarios', [UsuarioController::class, 'store']);
Route::post('/clases', [ClaseController::class, 'store']);
Route::get('/clases', [ClaseController::class, 'index']);

Route::post('/clases/{claseId}/agregaralumno',  [ClaseController::class, 'agregarAlumno']);

Route::get('/clases/{claseId}/alumnos', [ClaseController::class, 'listarAlumnos']);
Route::get('/alumnos', [UsuarioController::class, 'getAlumnos']);

Route::get('/clases/{claseId}/alumnos', [ClaseController::class, 'listarAlumnos']);

Route::post('login', [AuthController::class, 'login']);
Route::post('/clasealumno', [ClaseAlumnoController::class, 'store']); // Agregar alumno a una clase
Route::delete('/clasealumno/{id}', [ClaseAlumnoController::class, 'destroy']); // Eliminar alumno de una clase
Route::get('/alumnos/{alumnoId}/clases', [ClaseAlumnoController::class, 'clasesPorAlumno']);

Route::get('/clases/{clase_id}/avisos', [AvisoController::class, 'index']); // Obtener avisos
Route::post('/clases/{clase_id}/avisos', [AvisoController::class, 'store']); // Crear avisos con anexos
