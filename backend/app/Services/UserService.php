<?php

namespace App\Services;

use App\Models\User;

class UserService
{

    public function createUser(array $data): User
{
    return User::create([
        'name' => $data['name'],
        'email' => $data['email'],
        'password' => bcrypt($data['password']),
        'deleted' => false
    ]);
}
}
