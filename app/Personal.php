<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Personal extends Model
{
    
    use SoftDeletes;

    protected $table = 'personal';

    protected $primaryKey = 'id';

    protected $fillable = [
        'idusuario', 'ci', 'ciudad', 'direccion', 'contacto', 'estado',
    ];
    
}
