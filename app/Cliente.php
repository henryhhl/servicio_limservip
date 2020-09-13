<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Cliente extends Model
{

    use SoftDeletes;

    protected $table = 'cliente';

    protected $primaryKey = 'id';

    protected $fillable = [
        'idusuario', 'nit', 'contacto', 'estado',
    ];
    
}
