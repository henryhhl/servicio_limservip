<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AsignarDetalle extends Model
{
    
    use SoftDeletes;

    protected $table = 'asignardetalle';

    protected $primaryKey = 'idasignardetalle';

    protected $fillable = [
        
    ];

}
