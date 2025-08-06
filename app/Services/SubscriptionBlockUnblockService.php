<?php

namespace App\Services;

use App\Models\Client;
use App\Models\Subscription;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SubscriptionBlockUnblockService
{
    public function blockSubscription(
        Client $client,
        ?string $description
    ): Subscription {

        return DB::transaction(function () use ($client, $description){

            $subscription = $client->subscription()->latest()->first();
            
            if (!$this->syncWithClientForBlock($client)) {
                logger('client side syncing failed');
                throw new Exception("Failed to sync block status with client");
            }

            $subscription->update([
                "is_blocked" => true,
                'amount_paid' => 0,
                'is_trial' => false,
                'expires_at' => null,
                'valid_days' => 0,
                'is_active' => false,
                'description' => $description
            ]);
            
            return $subscription;
        });
    }
    public function syncWithClientForBlock(Client $client)
    {

        $response = Http::patch("{$client->domain}/api/subscription/block", [
            'token' => $client->subscription_token,
            'action' => 'block'
        ]);

        $responseData = $response->json();

        if (!$response->successful() || !$responseData['success']) {
            logger("Error syncing with client: {$client->name}: " . $response->body());

            return false;
        }
        return true;
    }
    public function unBlockSubscription(
        Client $client,
        ?string $description
    ): Subscription {

        return DB::transaction(function () use ($client, $description){

            $subscription = $client->subscription()->latest()->first();
            
            if (!$this->syncWithClientForUnBlock($client)) {
                throw new Exception("Failed to sync unblock status with client");
            }

            $subscription->update([
                "is_blocked" => false,
                'description' => $description
            ]);
            
            return $subscription;
        });
    }
    public function syncWithClientForUnBlock(Client $client)
    {

        $response = Http::patch("{$client->domain}/api/subscription/unblock", [
            'token' => $client->subscription_token,
            'action' => 'unblock'
        ]);

        $responseData = $response->json();

        if (!$response->successful() || !$responseData['success']) {
            logger("Error syncing with client: {$client->name}: " . $response->body());

            return false;
        }
        return true;
    }
}