<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\User;
use App\Cliente;

class UsuarioMovilController extends Controller
{
    public function loguear (Request $request){
        $usuario = $request->usuario;
        $password = $request->password;
        $user = DB::table('cliente as cli')
                ->leftJoin('users as user', 'cli.idusuario', '=', 'user.id')
                ->select('user.id', 'user.nombre', 'user.apellido', 'user.nacimiento','user.usuario' ,'cli.nit', 'cli.contacto', 
                    'user.imagen', 'user.email', 'user.password','cli.estado', 'user.tipo', 'user.genero'
                )
                ->where('cli.estado', '=', 'A')
                ->where( 'user.usuario', '=', $usuario )
                ->get();
        if(count($user) == 0){
            $user = [];   
        }else{
            if (!(Hash::check($password, $user[0]->password))){
                $user = [];
            }else{
                foreach($user as $ser){
                    if(!(is_null($ser->imagen))){
                        $pos = strpos($ser->imagen, ',');
                        $nuevo = substr($ser->imagen,$pos+1,strlen($ser->imagen)-1);
                        $ser->imagen = $nuevo;
                    }
                }
            }
        }
               
        return response()->json([
            'data'   => $user
        ]);
    }
    
    public function registrar(Request $request)
    {
        try {
            DB::beginTransaction();

            $nombre = $request->input('nombre');
            $apellido = $request->input('apellido');
            $nit = $request->input('nit');
            $email = $request->input('email');
            $contacto = $request->input('contacto');
            $foto = $request->input('foto');
            $usuario = $request->input('usuario');
            $password = $request->input('password');

            $value = User::where('usuario', '=', $usuario)->get();

            if (sizeof($value) > 0) {
                DB::rollBack();
                return response()->json([
                    'data' => [],
                ]);
            }


            $user = new User();
            $user->nombre = $nombre;
            $user->apellido = $apellido;
            $user->email = $email;
            $user->usuario = $usuario;
            $user->imagen = $foto;
            $user->password = bcrypt($password);
            $user->save();

            $cliente = new Cliente();
            $cliente->idusuario = $user->id;
            $cliente->nit = $nit;
            $cliente->contacto = $contacto;
            $cliente->save();

            DB::commit();
            
            $ultimoU=DB::table('users')->orderBy('id','desc')->first();
            //dd($ultimoU);
            return response()->json([
                'data'      => [$ultimoU],
            ]);

        }catch(\Exception $th) {
            DB::rollBack();
            return response()->json([
                'data' => [],
            ]);
        }
    }
}
