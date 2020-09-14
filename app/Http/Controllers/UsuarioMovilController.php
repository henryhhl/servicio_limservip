<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsuarioMovilController extends Controller
{
    public function loguear (Request $request){
        $usuario = $request->usuario;
        $password = $request->password;
        $user = DB::table('users')
                ->where( 'usuario', '=', $usuario )
                ->get();
        if(count($user) == 0){
            $user = 'error';   
        }else{
            if (!(Hash::check($password, $user[0]->password))){
                $user = 'error';
            }
        }
               
        return response()->json([
            'users'   => $user
        ]);
    }
}
