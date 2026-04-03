<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'role',
        'permissions',
        'must_change_password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'must_change_password' => 'boolean',
        'permissions' => 'array',
    ];

    public function hasPermission(string $permission): bool
    {
        $perms = $this->permissions ?? [];
        return is_array($perms) && in_array($permission, $perms, true);
    }

    public function articles(): HasMany
    {
        return $this->hasMany(Article::class, 'author_id');
    }

    public function likedArticles(): BelongsToMany
    {
        return $this->belongsToMany(Article::class, 'article_likes')->withTimestamps();
    }

    public function getRouteKeyName(): string
    {
        return 'username';
    }
}
