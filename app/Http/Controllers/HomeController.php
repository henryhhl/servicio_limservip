<?php

namespace App\Http\Controllers;

use App\Ajuste;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //$this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */

    public function get_information() {

        try {
            $session = app('session');
            $token = null;

            if (isset($session)) {
                $token = $session->token();
            }

            $data = Ajuste::where('idusuario', '=', Auth::user()->id)->orderBy('id')->first();

            return response()->json([
                'response' => 1,
                'token'    => $token,
                'usuario'  => Auth::user(),
                'ajuste'   => $data,
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

    public function sesion()
    {
        try {

            $sesion = Auth::guest();

            return response()->json([
                'response' => 1,
                'sesion'   => $sesion,
            ]);

        }catch(\Exception $th) {
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

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        return redirect('/');
    }

    public function index()
    {
        return view('home');
    }
}
