<?php

namespace App\Models;

use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    protected $fillable = [
        'amount_paid',
        'valid_days',
        'description',
        'expires_at',
        'is_trial',
        'is_active',
        'is_blocked'
    ];

    protected $dates = [
        'expires_at'];

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function isExpired()
    {
        return $this->expires_at && now()->gt($this->expires_at);
    }

    public function scopeIsActive($query){
        return $query->where('is_active', true);
    }
/**
 * Scope a query to only include active subscriptions.
 * @param  \Illuminate\Database\Eloquent\Builder  $query
 */
    public function scopeCheckSubscriptions(Builder $query) {
        return $query->where('is_active', true)->where('expires_at', '<=', now());
    }
}
