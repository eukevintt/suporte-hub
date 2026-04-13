<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Link extends Model
{
    protected $fillable = [
        'name',
        'url',
        'description',
        'link_type_id',
    ];

    public function type()
    {
        return $this->belongsTo(LinkType::class, 'link_type_id');
    }
}
