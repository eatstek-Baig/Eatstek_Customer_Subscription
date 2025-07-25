<?php

namespace App\Services;

use App\Models\Client;
use App\Models\Subscription;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SubscriptionService
{
    public function createManualSubscripton(
        Client $client,
        bool $isTrial,
        ?float $amount,
        int $validDays,
        ?string $description
    ): Subscription {

        $subscription = $client->subscription()->latest()->first();

        if (!$subscription) {
            $subscription = new Subscription([
                'client_id' => $client->id,
                'amount_paid' => $isTrial ? 0 : $amount,
                'description' => $description,
                'is_trial' => $isTrial,
                'expires_at' => now()->addMinutes($validDays),
                'valid_days' => $validDays,
                'is_active' => true
            ]);
        }

        $subscription->update([
            'amount_paid' => $isTrial ? 0 : $amount,
            'description' => $description,
            'is_trial' => $isTrial,
            'expires_at' => now()->addMinutes($validDays),
            'valid_days' => (int) now()->diffInMinutes(now()->addMinutes($validDays), false),
            'is_active' => true
        ]);

        $client->subscription()->save($subscription);

        //sync with the client 
        $this->syncWithClient($client);

        return $subscription;
    }

    protected function syncWithClient(Client $client)
    {
        try {
            $subscription = $client->subscription;

            if (!$subscription) {
                throw new Exception('Subscription not found');
            }

            $subscribedPayload = [
                'token' => $client->subscription_token,
                'action' => $client->activeSubscription() ? 'activate' : 'deactivate',
                'days' => $subscription->valid_days,
                'amount_paid' => $subscription->amount_paid,
            ];

            $newSubscriptionPayload = [
                'token' => $client->subscription_token,
                'action' => $client->activeSubscription() ? 'activate' : 'deactivate',
                'days' => $subscription->valid_days,
                'amount_paid' => $subscription->amount_paid,
                'is_trial' => $subscription->is_trial,
            ];

            $headers = [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ];

            if (!$subscription->is_trial) {

                // $response = Http::retry(2, 1000, function () use ($client, $subscribedPayload) {
                $innerResponse = Http::withHeaders($headers)->patch("{$client->domain}/api/subscription/update", $subscribedPayload);

                logger($innerResponse->body());

                if (!$innerResponse->successful()) {
                    logger("Subscription update failed: {$innerResponse->body()}");
                }
            }

            // $response = Http::retry(2, 1000, function() use ($client, $newSubscriptionPayload) {
            $response = Http::withHeaders($headers)->post("{$client->domain}/api/subscription/store", $newSubscriptionPayload);

            if (!$response->successful()) {
                logger("failed to sync with the client: {$response->body()}");
            }

        } catch (Exception $ex) {
            return Log::error('Client sync error' . $ex->getMessage());
        }
    }

    //checking the subscription
    public function checkSubscriptionExpiry()
    {

        $subscriptions = Subscription::with('client')->isActive()->get();

        foreach ($subscriptions as $subscription) {

            $remainingMinutes = now()->diffInMinutes($subscription->expires_at, false);

            // Update valid_days continuously
            $update = $subscription->update(['valid_days' => max(0, $remainingMinutes)]);

            // Handle expiration if time is up
            if ($remainingMinutes <= 0) {
                $this->expireSubscription($subscription);
            }
        }
        return $subscriptions->count();
    }

    public function expireSubscription(Subscription $subscription)
    {

        $client = $subscription->client()->first();

        if (!$client) {
            Log::error('No client found for subscription: ' . $subscription->id);
            return;
        }

        $subscription->update([
            'is_active' => false,
            'is_trial' => false,
            'amount_paid' => 0.00,
            'valid_days' => 0,
            // 'valid_days' => now()->diffInMinutes($subscription->expires_at, false) <= 0 ? 0 : now()->diffInMinutes($subscription->expires_at, false),
            'expires_at' => null,
            'description' => 'Subscription expired at ' . now()->toDateTimeString()
        ]);

        $this->syncWithClientForExpiry($client);

        Log::info("Subscription expired for {$subscription->client->name}");
    }

    protected function syncWithClientForExpiry(Client $client)
    {
        try {

            //calling client with 2 retries in case of failure
            $response = Http::patch("{$client->domain}/api/subscription/update", [
                'token' => $client->subscription_token,
                'action' => 'deactivate',
            ]);

            if (!$response->successful()) {
                logger("Error syncing with client: {$client->name}: " . $response->body());
            }

        } catch (Exception $ex) {
            return Log::error('Client sync error' . $ex->getMessage());
        }
    }
}