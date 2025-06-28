<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Subscription;
use App\Services\SubscriptionService;
use Exception;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function registerClient(Request $request){
        
        try{

        //validating the request attributes
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'domain' => 'required|string|max:255|unique:clients,domain',
            'trial_days' => 'nullable|integer|min:1|max:30',
        ]);

        //generating the token
        $token = bin2hex(random_bytes(16));

        //creating the new client
        $client = Client::create(
            [
                'name' => $validated['name'],
                'domain' => $validated['domain'],
                'subscription_token' => $token
            ]
        );

        //start automatic trial
        $trialDays = $validated['trial_days'] ?? 15;

        $service = new SubscriptionService();
        $subscription = $service->createManualSubscripton($client, true, 0, $trialDays, 'Automatic Trial on registration');

        return response()->json([
            'success' => true,
            'message' => 'Client registered with trial access',
            'data' => [
                'client' => $client,
                'trial_ends_at' => $subscription->expires_at
            ]
        ]);
        }catch(Exception $exception){
            return response()->json([
                'error' => $exception->getMessage(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine()
            ]);
        }
    }
    public function index()
    {
        $client = Client::with(['subscription' => function ($query) {
            $query->latest();
        }])->get();

        return response()->json([
            'success' => true,
            'data' => $client
        ]);
    }

    public function store(Request $request, SubscriptionService $service){
        
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'amount_paid' => 'required|numeric|min:0',
            'valid_days' => 'required|integar|min:1',
            'description' => 'nullable|string',
            'is_trial' => 'required|boolean',
        ]);

        $client = Client::find($validated['client_id']);

        $subscription = $service->createManualSubscripton(
            $client,
            $validated['is_trial'],
            $validated['amount_paid'],
            $validated['valid_days'],
            $validated['description']);

        return response()->json([
            'success' => true,
            'data' => $subscription
        ]);
    
    }
}
