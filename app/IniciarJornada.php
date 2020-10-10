<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class IniciarJornada extends Model
{

    use SoftDeletes;

    protected $table = 'iniciarjornada';

    protected $primaryKey = 'idiniciarjornada';

    protected $fillable = [
        
    ];

}
