<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SolicitudDetalle extends Model
{
    
    use SoftDeletes;

    protected $table = 'solicituddetalle';

    protected $primaryKey = 'idsolicituddetalle';

    protected $fillable = [
        
    ];
    
}
