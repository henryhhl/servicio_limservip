<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Servicio extends Model
{
    
    use SoftDeletes;

    protected $table = 'servicio';

    protected $primaryKey = 'idservicio';

    protected $fillable = [
        
    ];

}
