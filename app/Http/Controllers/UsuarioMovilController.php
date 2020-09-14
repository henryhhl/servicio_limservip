<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UsuarioMovilController extends Controller
{
    public function api (){
        $user = DB::table('users')->get();
        return response()->json([
            'users'   => $user
        ]);
    }
}
