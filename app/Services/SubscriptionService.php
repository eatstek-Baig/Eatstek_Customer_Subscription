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
        //safely handle existing active subscription
        if($activeSub = $client->activeSubscription()){

            $activeSub->update(['is_active' => false]);
        }

        $subscription = new Subscription([
            'client_id' => $client->id,
            'amount_paid' => $isTrial ? 0 : $amount,
            'valid_days' => $validDays,
            'description' => $description,
            'is_trial' => $isTrial,
            'expires_at' => now()->addDays($validDays),
            'is_active' => true
        ]);

        $client->subscriptions()->save($subscription);

        //sync with the client 
        $this->syncWithClient($client);

        return $subscription;
    }

    protected function syncWithClient(Client $client) {

        $subscription = $client->activeSubscription();

        if(!$subscription){
            Log::error('No active subscription found for client: ' . $client->name);
            return;
        }

        try{
            $response = Http::post("{$client->domain}/api/subscription/update", [
                'token' => $client->subscription_token,
                'action' => 'activate',
                'days' => $subscription->valid_days,
                'amount_paid' => $subscription->amount_paid,
                'is_trial' => $subscription->is_trial,
            ]);

            if(!$response->successful()){
                dump("Error syncing with client: {$client->name}: " . $response->body());
            }

        }catch(Exception $ex){
            return Log::error('Client sync error' . $ex->getMessage());
        }
    }

    //checking the subscription
    public function checkSubscriptionExpiry(){

        $subscriptions = Subscription::checkSubsctiptions();

        foreach($subscriptions as $subscription){
            $this->expireSubscription($subscription);
        }
        return $subscriptions->count();
    }

    public function expireSubscription(Subscription $subscription){
        
        $client = Subscription::client()->first();

        if(!$client){
            Log::error('No client found for subscription: ' . $subscription->id);
            return;
        }

        $subscription->update([
            'is_active' => false,
            'is_trial' => false
        ]);

        $this->syncWithClient($client);

        Log::info("Subscription expired for {$subscription->client->name}");
    }
}