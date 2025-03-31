<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClaseController;
use App\Http\Controllers\ClaseAlumnoController;


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/usuarios', [UsuarioController::class, 'store']);
Route::post('/clases', [ClaseController::class, 'store']);
Route::get('/clases', [ClaseController::class, 'index']);
Route::post('/clases/{claseId}/agregar-alumno', [ClaseController::class, 'agregarAlumno']);
Route::get('/clases/{claseId}/alumnos', [ClaseController::class, 'listarAlumnos']);
Route::get('/alumnos', [UsuarioController::class, 'getAlumnos']);


Route::post('login', [AuthController::class, 'login']);
Route::post('/clase-alumno', [ClaseAlumnoController::class, 'store']); // Agregar alumno a una clase
Route::delete('/clase-alumno/{id}', [ClaseAlumnoController::class, 'destroy']); // Eliminar alumno de una clase