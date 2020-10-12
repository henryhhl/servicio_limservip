<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Seguimiento extends Model
{
    
    use SoftDeletes;

    protected $table = 'seguimiento';

    protected $primaryKey = 'idseguimiento';

    protected $fillable = [
        
    ];
    
}
