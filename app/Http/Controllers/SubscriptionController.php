<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Subscription;
use App\Services\SubscriptionBlockUnblockService;
use App\Services\SubscriptionService;
use Exception;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function registerClient(Request $request)
    {

        try {
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
        } catch (Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine()
            ]);
        }
    }
    public function index()
    {
        try {

            $clients = Client::with([
                'subscription' => function ($query) {
                    $query->latest('expires_at');
                }
            ])->get();

            return response()->json([
                'success' => true,
                'data' => $clients->map(function ($client) {
                    return [
                        'id' => $client->id,
                        'name' => $client->name,
                        'domain' => $client->domain,
                        'subscription' => $client->subscription,
                        'active_subscription' => $client->subscription?->isActive() ?? false
                    ];
                })
            ]);
        } catch (Exception $ex) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong',
                'error' => $ex->getMessage(),
                'file' => $ex->getFile(),
                'line' => $ex->getLine()
            ], 500);
        }
    }

    public function indexExpire()
    {
        try {

            $clients = Client::whereHas(
                'subscription',
                function ($query) {
                    $query->where('is_active', false);
                }
            )
                ->get();

            return response()->json([
                'success' => true,
                'data' => $clients->map(function ($client) {
                    return [
                        'id' => $client->id,
                        'name' => $client->name,
                        'domain' => $client->domain,
                        'subscription' => "Expired",
                        "description" => $client->subscription->description ?? ""
                    ];
                })
            ]);
        } catch (Exception $ex) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong',
                'error' => $ex->getMessage(),
                'file' => $ex->getFile(),
                'line' => $ex->getLine()
            ], 500);
        }
    }
    public function indexBlocked()
    {
        try {

            $clients = Client::whereHas(
                'subscription',
                function ($query) {
                    $query->where('is_blocked', true);
                }
            )
                ->get();

            return response()->json([
                'success' => true,
                'data' => $clients->map(function ($client) {
                    return [
                        'id' => $client->id,
                        'name' => $client->name,
                        'domain' => $client->domain,
                        'subscription' => "Blocked",
                        "description" => $client->subscription->description ?? ""
                    ];
                })
            ]);
        } catch (Exception $ex) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong',
                'error' => $ex->getMessage(),
                'file' => $ex->getFile(),
                'line' => $ex->getLine()
            ], 500);
        }
    }
    public function update(Request $request, SubscriptionService $service)
    {
        try {

            $validated = $request->validate([
                'client_id' => 'required|exists:clients,id',
                'amount_paid' => 'required|numeric|min:0',
                'valid_days' => 'required|integer|min:1',
                'description' => 'nullable|string',
            ]);

            // dd($validated['amount_paid']);
            $client = Client::find($validated['client_id']);

            $subscription = $service->createManualSubscripton(
                $client,
                $validated['amount_paid'] === 0 ? true : false,
                $validated['amount_paid'],
                $validated['valid_days'],
                $validated['description']
            );

            if (!$subscription->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Subscription update failed'
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Subscription extended successfully',
                'data' => $subscription
            ]);
        } catch (Exception $ex) {
            return response()->json([
                'success' => false,
                'message' => 'Subscription Update failed',
                'error' => $ex->getMessage()
            ], 500);
        }
    }

    public function block(Request $request, SubscriptionBlockUnblockService $service)
    {
        try {

            $validated = $request->validate([
                "client_id" => "required|exists:clients,id",
                "description" => "nullable|string"
            ]);

            $client = Client::find($validated['client_id']);

            if (!$client) {
                return response()->json([
                    'success' => false,
                    'message' => 'client not found'
                ], 404);
            }
            if ($client->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => "You can't block the client until his subscription expires"
                ], 403);
            }

            $subscription = $service->blockSubscription(
                $client,
                $validated['description'],
            );

            // logger($subscription);

            if (!$subscription->is_blocked) {
                return response()->json([
                    'success' => false,
                    'message' => 'something went wront. Please check the logs'
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Subscription blocked successfully',
                'data' => $subscription
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Subscription block failed',
                'error' => $e->getMessage(),
                'subscription' => $subscription ?? null
            ], 500);
        }
    }

    public function unblock(Request $request, SubscriptionBlockUnblockService $service)
    {
        try {

            $validated = $request->validate([
                "client_id" => "required|exists:clients,id",
                "description" => "nullable|string"
            ]);

            $client = Client::find($validated['client_id']);

            if (!$client) {
                return response()->json([
                    'success' => false,
                    'message' => 'client not found'
                ], 404);
            }

            $subscription = $service->unBlockSubscription(
                $client,
                $validated['description'],
            );

            return response()->json([
                'success' => true,
                'message' => 'Subscription unblock successfully',
                'data' => $subscription
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Subscription unblock failed',
                'error' => $e->getMessage(),
                'subscription' => $subscription ?? null
            ], 500);
        }
    }
}
