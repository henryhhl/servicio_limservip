<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Informacion extends Model
{
    
    use SoftDeletes;

    protected $table = 'informacion';

    protected $primaryKey = 'idinformacion';

    protected $fillable = [
        
    ];
    
}
