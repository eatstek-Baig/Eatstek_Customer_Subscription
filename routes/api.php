<?php

use App\Http\Controllers\SubscriptionController;
use Illuminate\Support\Facades\Route;

Route::post('/client/register', [SubscriptionController::class, 'registerClient']);
Route::get('/client/status', [SubscriptionController::class, 'index']);