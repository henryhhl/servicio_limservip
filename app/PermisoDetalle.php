<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PermisoDetalle extends Model
{
    protected $table = 'detalle_permiso';

    protected $primaryKey = 'id';

    protected $fillable = [
        'idpermiso', 'idrol', 'estado',
    ];
}
