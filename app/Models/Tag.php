<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    protected $fillable = ['name', 'slug', 'is_protected'];

    public function articles()
    {
        return $this->belongsToMany(Article::class);
    }
}
