<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Ajuste extends Model
{
    protected $table = 'ajuste';

    protected $primaryKey = 'id';

    protected $fillable = [
        'idusuario', 'colorheader', 'colorsidebar', 'sizetext', 'fontfamilytext', 'fontweighttext',
    ];
}
