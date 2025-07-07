<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed|unique:users',
        ]);

        try {

            $user = User::create($validated);
            $auth = JWTAuth::fromUser($user);

            $token = $this->respondWithToken($auth);

            return response()->json([
                'success' => true,
                'data' => $user,
                'token' => $token->original['access_token'],
            ]);

        } catch (Exception $ex) {
            return response()->json([
                'error' => $ex->getMessage(),
                'line' => $ex->getLine(),
                'file' => $ex->getFile(),
            ]);
        }
    }

    public function login(Request $request){

        $validated = $request->validate([
            'email' => 'required|string|max:255',
            'password' => 'required|string', 
        ]);

        try{
            $user = User::where('email', $validated['email'])->orWhere('name', $validated['email'])->first();
            
            if(!$user){
                return response()->json([
                    'success' => false,
                    'error' => 'User not found' 
                ],404);
            }
            
            $credentials = [
                'email' => $validated['email'],
                'password' => $validated['password']
            ];

            if(!$token = JWTAuth::attempt($credentials)){
                return response()->json([
                    'success' => false,
                    'error' => 'Invalid Password'
                ],401);
            }

            return response()->json([
                'success' => true,
                'message' => 'Successfully logged in',
                'user' => $user,
                'token' => $this->respondWithToken($token)->original['access_token'],
            ]);

        }catch(Exception $exception){
            return response()->json([
                'error' => $exception->getMessage(),
                'line' => $exception->getLine(),
                'file' => $exception->getFile(),
            ]);
        }
    }

    public function logout(Request $request){
        
        try{

            if(!(JWTAuth::invalidate(JWTAuth::getToken()))){
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to logout'
                ], 400);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'logged out Successfully!'
            ], 200);

        }catch(Exception $ex){
            return response()->json([
                'error' => $ex->getMessage(),
                'line' => $ex->getLine(),
                'file' => $ex->getFile(),
            ]);
        }
    }

        public function user(Request $request)
    {
        if(!JWTAuth::user()){
            return response()->json([
                'success' => false,
                'message' => 'permission denied' 
            ]);
        }

        return response()->json([
            'success' => true,
            'user' => JWTAuth::user()
        ]);
    }

        public function refresh()
    {
        try {
            $token = JWTAuth::getToken();
            
            if (!JWTAuth::getToken()) {
                return response()->json([
                    'error' => 'Token not provided'
                ], 400);
            }

            $refreshToken = JWTAuth::refresh($token);
            $newToken = $this->respondWithToken($refreshToken)->original['access_token'];
            
            return response()->json([
                'token' => $newToken,
            ]);
        } catch (Exception $ex) {
            return response()->json([
                "error" => $ex->getMessage(),
                "line" => $ex->getLine(),
                "file" => $ex->getFile()
            ], 500);
        }
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL()
        ]);
    }
}
