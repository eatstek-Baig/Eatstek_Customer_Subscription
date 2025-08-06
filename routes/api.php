<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\SubscriptionController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:api')->group(function () { 

    Route::get('/client/index', [SubscriptionController::class, 'index']);
    Route::get('/client/index-expired', [SubscriptionController::class, 'indexExpire']);
    Route::get('/client/index-blocked', [SubscriptionController::class, 'indexBlocked']);

    Route::post('/client/register', [SubscriptionController::class, 'registerClient']);
    Route::patch('/client/update', [SubscriptionController::class, 'update']);
    Route::patch('/client/block', [SubscriptionController::class, 'block']);

    Route::patch('/client/unblock', [SubscriptionController::class, 'unblock']);
});

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::middleware('auth:api')->get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
});