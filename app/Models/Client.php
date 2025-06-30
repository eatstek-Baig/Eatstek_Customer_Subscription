<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Psy\Readline\Hoa\FileLink;

class Client extends Model
{
    protected $fillable = [
        'name',
        'domain',
        'subscription_token'
    ];

    public function subscription(){
        return $this->hasOne(Subscription::class);
    }
    public function activeSubscription()
    {
        return $this->hasOne(Subscription::class)->where('is_active', true)->where('expires_at', '>', now())->first();
    }
}
