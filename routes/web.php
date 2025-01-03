<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PomodoroController;

Route::get('/', [PomodoroController::class, 'index']);