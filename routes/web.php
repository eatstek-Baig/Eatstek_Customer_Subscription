<?php

use App\Http\Controllers\SubscriptionController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

    // Route::get('/subscriptions', [SubscriptionController::class, 'index']);
    // Route::post('/subscriptions', [SubscriptionController::class, 'store']);
    // Route::post('/client/register', [SubscriptionController::class, 'registerClient']);