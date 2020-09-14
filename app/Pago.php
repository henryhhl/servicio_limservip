<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pago extends Model
{
    
    use SoftDeletes;

    protected $table = 'solicituddetalle';

    protected $primaryKey = 'id';

    protected $fillable = [
        'idsolicitud', 'montopagado', 'tipopago', 'fecha', 'hora', 'estado',
    ];
    
}
