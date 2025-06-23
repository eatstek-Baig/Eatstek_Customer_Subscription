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

    public function subscriptions()
    {
        return $this->hasOne(Subscription::class, 'client_id');
    }
}
