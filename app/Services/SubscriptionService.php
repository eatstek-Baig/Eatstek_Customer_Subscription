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

        if(!$subscription){
            $subscription = new Subscription([
                'client_id' => $client->id
            ]);
        }

        $subscription->update([
            'amount_paid' => $isTrial ? 0 : $amount,
            'description' => $description,
            'is_trial' => $isTrial,
            'expires_at' => now()->addMinutes($validDays),
            'valid_days' => (int)now()->diffInMinutes(now()->addMinutes($validDays), false),
            'is_active' => true
        ]);

        $client->subscription()->save($subscription);

        logger('difference in minutes: ' . now()->diffInMinutes($subscription->expires_at, false));

        //sync with the client 
        $this->syncWithClient($client);

        return $subscription;
    }

    protected function syncWithClient(Client $client)
    {
        try {
            $subscription = $client->subscription;

            logger('subscription: ');
            logger($subscription->toArray());

            if(!$subscription){
                throw new Exception('Subscription not found');
            }

            if (!$subscription->is_trial) {

                $response = Http::patch("{$client->domain}/api/subscription/update", [
                    'token' => $client->subscription_token,
                    'action' => $client->activeSubscription() ? 'activate' : 'deactivate',
                    'days' => $subscription->valid_days,
                    'amount_paid' => $subscription->amount_paid,
                ]);

                logger($response->successful());

                if (!$response->successful()) {
                    logger("Error syncing with client: {$client->name}: " . $response->body());
                }
            }

            $response = Http::post("{$client->domain}/api/subscription/store", [
                'token' => $client->subscription_token,
                'action' => $client->activeSubscription() ? 'activate' : 'deactivate',
                'days' => $subscription->valid_days,
                'amount_paid' => $subscription->amount_paid,
                'is_trial' => $subscription->is_trial,
            ]);

            if (!$response->successful()) {
                logger("Error syncing with client: {$client->name}: " . $response->body());
            }

        } catch (Exception $ex) {
            return Log::error('Client sync error' . $ex->getMessage());
        }
    }

    //checking the subscription
    public function checkSubscriptionExpiry()
    {

        $subscriptions = Subscription::with('client')->checkSubscriptions()->get();

        foreach ($subscriptions as $subscription) {
            $this->expireSubscription($subscription);
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
            'valid_days' => now()->diffInMinutes($subscription->expires_at, false) < 0 ? 0 : now()->diffInMinutes($subscription->expires_at, false),
            'expires_at' => null,
            'description' => 'Subscription has been expired',
        ]);

        $this->syncWithClientForExpiry($client);

        Log::info("Subscription expired for {$subscription->client->name}");
    }

    protected function syncWithClientForExpiry(Client $client)
    {
        try {
            $response = Http::patch("{$client->domain}/api/subscription/update", [
                'token' => $client->subscription_token,
                'action' => $client->activeSubscription() ? 'activate' : 'deactivate',
            ]);

            if (!$response->successful()) {
                dump("Error syncing with client: {$client->name}: " . $response->body());
            }

        } catch (Exception $ex) {
            return Log::error('Client sync error' . $ex->getMessage());
        }
    }
}