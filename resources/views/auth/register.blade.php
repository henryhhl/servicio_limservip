<!DOCTYPE html>
<html lang="es">
<head>
	<title>Register</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
<!--===============================================================================================-->	
	<link rel="icon" type="image/png" href="{{ asset('/images/icons/favicon.ico') }}"/>
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="{{ asset('/vendor/bootstrap/css/bootstrap.min.css') }}">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="{{ asset('/fonts/font-awesome-4.7.0/css/font-awesome.min.css') }}">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="{{ asset('/fonts/iconic/css/material-design-iconic-font.min.css') }}">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="{{ asset('/vendor/animate/animate.css') }}">
<!--===============================================================================================-->	
	<link rel="stylesheet" type="text/css" href="{{ asset('/vendor/css-hamburgers/hamburgers.min.css') }}">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="{{ asset('/vendor/animsition/css/animsition.min.css') }}">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="{{ asset('/vendor/select2/select2.min.css') }}">
<!--===============================================================================================-->	
	<link rel="stylesheet" type="text/css" href="{{ asset('/vendor/daterangepicker/daterangepicker.css') }}">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="{{ asset('/css/util.css') }}">
	<link rel="stylesheet" type="text/css" href="{{ asset('/css/main.css') }}">
<!--===============================================================================================-->
</head>
<body>
	
	<div class="limiter">
		<div class="container-login100">
			<div class="wrap-login100">

				<form class="login100-form validate-form" method="POST" action="{{ route('register') }}">
					<span class="login100-form-title p-b-26">
						REGISTRO AL SISTEMA
                    </span>
                    
                    @csrf

                    <div class="wrap-input100 validate-input" data-validate = "Campo requerido">
						<input class="input100" type="text" name="nombre">
                        <span class="focus-input100" data-placeholder="Nombre"></span>
                        @if ($errors->has('nombre'))
							<strong style="position: absolute; color: red;
								bottom: -25px; left: 10px; font-size: 10px;">
								ERROR. EL CAMPO NOMBRE REQUERIDO 
							</strong>
                        @endif
					</div>

                    <div class="wrap-input100 validate-input" data-validate = "Campo requerido">
						<input class="input100" type="text" name="apellido">
						<span class="focus-input100" data-placeholder="Apellido"></span>
						@if ($errors->has('apellido'))
							<strong style="position: absolute; color: red;
								bottom: -25px; left: 10px; font-size: 10px;">
								ERROR. EL CAMPO APELLIDO REQUERIDO.
							</strong>
                        @endif
					</div>

					<div class="wrap-input100 validate-input" data-validate = "Campo requerido">
						<input class="input100" type="text" name="usuario">
						<span class="focus-input100" data-placeholder="Usuario"></span>
						@if ($errors->has('usuario'))
							<strong style="position: absolute; color: red;
								bottom: -25px; left: 10px; font-size: 10px;">
								ERROR. EL CAMPO USUARIO REQUERIDO 
							</strong>
                        @endif
					</div>

					<div class="wrap-input100 validate-input" data-validate="ingresar clave">
						<span class="btn-show-pass">
							<i class="zmdi zmdi-eye"></i>
						</span>
						<input class="input100" type="password" name="password">
						<span class="focus-input100" data-placeholder="Clave"></span>
						@if ($errors->has('password'))
							<strong style="position: absolute; color: red;
								bottom: -25px; left: 10px; font-size: 10px;">
								ERROR. EL CAMPO CONTRASEÑA REQUERIDO 
							</strong>
                        @endif
                    </div>
                    
                    <div class="wrap-input100 validate-input" data-validate="ingresar clave">
						<span class="btn-show-pass">
							<i class="zmdi zmdi-eye"></i>
						</span>
						<input class="input100" type="password" name="password_confirmation">
						<span class="focus-input100" data-placeholder="Repetir clave"></span>
					</div>

					<div class="container-login100-form-btn">
						<div class="wrap-login100-form-btn">
							<div class="login100-form-bgbtn"></div>
							<button class="login100-form-btn" type="submit">
								REGISTRAR
							</button>
						</div>
						<a href="{{ route('login') }}">LOGIN</a>
					</div>
				</form>
			</div>
		</div>
    </div>
    
<!--===============================================================================================-->
	<script src="{{ asset('/vendor/jquery/jquery-3.2.1.min.js') }}"></script>
<!--===============================================================================================-->
	<script src="{{ asset('/vendor/animsition/js/animsition.min.js') }}"></script>
<!--===============================================================================================-->
	<script src="{{ asset('/vendor/bootstrap/js/popper.js') }}"></script>
	<script src="{{ asset('/vendor/bootstrap/js/bootstrap.min.js') }}"></script>
<!--===============================================================================================-->
	<script src="{{ asset('/vendor/select2/select2.min.js') }}"></script>
<!--===============================================================================================-->
	<script src="{{ asset('/vendor/daterangepicker/moment.min.js') }}"></script>
	<script src="{{ asset('/vendor/daterangepicker/daterangepicker.js') }}"></script>
<!--===============================================================================================-->
	<script src="{{ asset('/vendor/countdowntime/countdowntime.js') }}"></script>
<!--===============================================================================================-->
    
    <script>
        $('.input100').each(function(){
            $(this).on('blur', function(){
                if($(this).val().trim() != "") {
                    $(this).addClass('has-val');
                }
                else {
                    $(this).removeClass('has-val');
                }
            })    
        })
        var showPass = 0;
        $('.btn-show-pass').on('click', function(){
            if(showPass == 0) {
                $(this).next('input').attr('type','text');
                $(this).find('i').removeClass('zmdi-eye');
                $(this).find('i').addClass('zmdi-eye-off');
                showPass = 1;
            }
            else {
                $(this).next('input').attr('type','password');
                $(this).find('i').addClass('zmdi-eye');
                $(this).find('i').removeClass('zmdi-eye-off');
                showPass = 0;
            }
            
        });
    </script>

</body>
</html>