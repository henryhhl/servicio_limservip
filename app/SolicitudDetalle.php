<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SolicitudDetalle extends Model
{
    
    use SoftDeletes;

    protected $table = 'solicituddetalle';

    protected $primaryKey = 'id';

    protected $fillable = [
        'idsolicitud', 'idservicio', 'cantidad', 'precio', 'descuento', 'nota', 'estadoproceso', 'estado',
    ];
    
}
