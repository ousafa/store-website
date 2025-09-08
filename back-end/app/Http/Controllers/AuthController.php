<?php

namespace App\Http\Controllers;

use App\Http\Requests\Api\LoginUserRequest;
use App\Http\Requests\Api\V1\RegisterUserRequest;
use App\Http\Traits\ApiResponses;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    use ApiResponses;

    // Authentication
    public function login(LoginUserRequest $request)
    {
        $credentials = $request->validated();

        if (!Auth::attempt($credentials)) {
            return $this->error('Incorrect Email or Password', 401);
        }

        $user = Auth::user();

        return $this->success(
            'Authenticated',
            [
                'token' => $user->createToken(
                    'API token for ' . $user->email,
                    ['*'],
                    now()->addMonth()
                )->plainTextToken,
                "id" => $user->id
            ]
        );
    }

    public function register(RegisterUserRequest $request)
    {
        $data = $request->validated();

        // Créer utilisateur
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'] ?? 'client',
        ]);

        // Créer un token pour login automatique après register
        $token = $user->createToken(
            'API token for ' . $user->email,
            ['*'],
            now()->addMonth()
        )->plainTextToken;

        return $this->success(
            'User registered successfully',
            [
                'token' => $token,
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            201
        );
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return $this->success('Logged out');
    }
}
