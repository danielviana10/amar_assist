<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run()
    {
        User::firstOrCreate(
            ['email' => 'admin.user@mail.com'],
            [
                'name' => 'Admin',
                'password' => bcrypt('1234'),
                'deleted' => false
            ]
        );
    }
}
