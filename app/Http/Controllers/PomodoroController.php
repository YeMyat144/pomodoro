<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller;

class PomodoroController extends Controller
{
    public function index()
    {
        return view('pomodoro');
    }
}