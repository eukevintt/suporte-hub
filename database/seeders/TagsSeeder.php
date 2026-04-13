<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Tag;
use Illuminate\Support\Str;

class TagsSeeder extends Seeder
{
    public function run(): void
    {
        $tags = [
            ['name' => 'Comum', 'protected' => true],
            ['name' => 'Incomum', 'protected' => true],
            ['name' => 'DNS', 'protected' => true],
            ['name' => 'Email', 'protected' => true],
            ['name' => 'SSL', 'protected' => true],
            ['name' => 'Migração', 'protected' => true],
            ['name' => 'Backup', 'protected' => true],
            ['name' => 'WordPress', 'protected' => false],
            ['name' => 'Básico', 'protected' => true],
            ['name' => 'Avançado', 'protected' => true],
            ['name' => 'Onboarding', 'protected' => true],
        ];

        foreach ($tags as $tag) {
            Tag::updateOrCreate(
                ['slug' => Str::slug($tag['name'])],
                [
                    'name' => $tag['name'],
                    'is_protected' => $tag['protected'],
                ]
            );
        }
    }
}
