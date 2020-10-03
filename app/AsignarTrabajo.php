<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AsignarTrabajo extends Model
{
    
    use SoftDeletes;

    protected $table = 'asignartrabajo';

    protected $primaryKey = 'id';

    protected $fillable = [
        
    ];
    
}
