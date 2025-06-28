<?php

namespace App\Console\Commands;

use App\Models\Subscription;
use App\Services\SubscriptionService;
use Illuminate\Console\Command;

class CheckSubscriptions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'subscriptions:check-expired';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Deactivate Expired Subscriptions';

    /**
     * Execute the console command.
     */
    public function handle(SubscriptionService $service)
    {
        // Handle trial expirations
        // $expiredTrials = Subscription::where('is_trial', true)
        // ->where('expires_at', '<=', now())->where('is_active', true)->get();
        
        // foreach($expiredTrials as $subs){
        //     $subs->update(['is_active' => false]);
        //     $subs->update(['is_trial' => false]);
        //     $this->info("Deactivated Trial for {$subs->client->name}");
        // }

        // Handle paid subscription expirations
        // $expiredPaid = Subscription::where('is_trial', false)
        // ->where('is_active', true)->where('expires_at', '<=', now())->get();
        
        // foreach($expiredPaid as $subs){
        //     $subs->update(['is_active '=> false]);
        //     $this->info("Deactivated Subscription for {$subs->client->name}");
        // }
        // $this->info("Deactivated: {$expiredTrials->count()} trials + {$expiredPaid->count()} paid subscriptions.");
    
        $count = $service->checkSubscriptionExpiry();
        $this->info('Deactivated: ' . $count . ' expired subscriptions.');

    }
}
