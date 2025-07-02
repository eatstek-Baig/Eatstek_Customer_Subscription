<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\SubscriptionController;
use Illuminate\Support\Facades\Route;

Route::post('/client/register', [SubscriptionController::class, 'registerClient']);
Route::get('/client/status', [SubscriptionController::class, 'index']);
Route::patch('/client/update', [SubscriptionController::class, 'update']);

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});