<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class InitialUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
    $users = [
        ['email' => 'superadmin@suportehub.local', 'role' => 'superadmin'],
        ['email' => 'admin@suportehub.local', 'role' => 'admin'],
    ];

    foreach ($users as $data) {
        $password = Str::random(12);

        User::updateOrCreate(
            ['email' => $data['email']],
            [
                'name' => $data['role'],
                'password' => Hash::make($password),
                'role' => $data['role'],
                'must_change_password' => true,
            ]
        );

        $this->command->info("{$data['email']} | senha: {$password}");
    }
    }
}
