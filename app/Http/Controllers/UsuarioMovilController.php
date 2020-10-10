<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\User;
use App\Notificacion;
use App\Cliente;

class UsuarioMovilController extends Controller
{
    public function loguear (Request $request){
        $usuario = $request->usuario;
        $password = $request->password;
        $user = DB::table('cliente as cli')
                ->leftJoin('users as user', 'cli.fkidusuario', '=', 'user.id')
                ->select('user.id', 'user.nombre', 'user.apellido', 'user.nacimiento','user.usuario' ,'cli.nit', 'cli.contacto', 
                    'user.imagen', 'user.email', 'user.password','cli.estado', 'user.tipo', 'user.genero', 'user.nombre as noti'
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

                    $obj = new Notificacion();
                    $notificacion = $obj->get_notificacion($ser->id);

                    $ser->noti = $notificacion;
                    
                }
                
            }
        }
               
        return response()->json([
            'data'   => $user
        ]);
    }
    
    public function get_notificacionMovil(Request $request) {

        try {
            $nickname= $request->nickname;
            $idusuario= $request->idusuario;
            $bandera = '';

            if (file_exists( public_path() . '/notificacion/' . $nickname . '_movil' . '.txt' )) {

                $archivo = fopen(public_path() . '/notificacion/' . $nickname . '_movil' . '.txt', 'r');
                while ($linea = fgets($archivo)) {
                    $bandera .= $linea;
                }
                $bandera = preg_replace("/[\r\n|\n|\r]+/", "", $bandera);
                fclose($archivo);

            } else {
                $archivo = fopen( public_path() . '/notificacion/' . $nickname . '_movil' . '.txt', 'w+');
                if ( fwrite( $archivo, '' ) ) {
                    fclose( $archivo );
                }
            }
            $bandera = $bandera == '' ? [] : json_decode($bandera);

            $archivo = fopen( public_path() . '/notificacion/' . $nickname . '_movil' . '.txt', 'w+');
            if ( fwrite( $archivo, '' ) ) {
                fclose( $archivo );
            }

            $notificacion = [];
            if (sizeof($bandera) > 0) {
                $obj = new Notificacion();
                $notificacion = $obj->get_notificacion( $idusuario );
            }

            return response()->json([
                
                'notificacion' => $notificacion,
            ]);
            
        } catch(\Exception $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Error al procesar la solicitud',
                'error' => [
                    'file'    => $th->getFile(),
                    'line'    => $th->getLine(),
                    'message' => $th->getMessage()
                ]
            ]);
        } 
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
                    [],
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
            $cliente->fkidusuario = $user->id;
            $cliente->nit = $nit;
            $cliente->contacto = $contacto;
            $cliente->save();

            DB::commit();
            
            $ultimoU=DB::table('cliente as cli')
            ->leftJoin('users as user', 'cli.fkidusuario', '=', 'user.id')
            ->select('user.id', 'user.nombre', 'user.apellido', 'user.nacimiento','user.usuario' ,'cli.nit', 'cli.contacto', 
                'user.imagen', 'user.email', 'user.password','cli.estado', 'user.tipo', 'user.genero'
            )
            ->where('cli.estado', '=', 'A')
            ->where( 'user.id', '=', $user->id )
            ->get();
            
            foreach($ultimoU as $ser){
                if(!(is_null($ser->imagen))){
                    $pos = strpos($ser->imagen, ',');
                    $nuevo = substr($ser->imagen,$pos+1,strlen($ser->imagen)-1);
                    $ser->imagen = $nuevo;
                }
            }
            
            
            //dd($ultimoU);
            return response()->json([
                $ultimoU[0],
            ]);

        }catch(\Exception $th) {
            DB::rollBack();
            return response()->json([
                [],
            ]);
        }
    }
}
