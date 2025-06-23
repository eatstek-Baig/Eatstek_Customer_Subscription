<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    protected $fillable = [
        'amount_paid',
        'valid_days',
        'description',
        'expires_at',
        'is_active'
    ];

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function isExpired()
    {
        return $this->expires_at && now()->gt($this->expires_at);
    }
}
