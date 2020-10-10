<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pago extends Model
{
    
    use SoftDeletes;

    protected $table = 'pago';

    protected $primaryKey = 'idpago';

    protected $fillable = [
        
    ];
    
}
