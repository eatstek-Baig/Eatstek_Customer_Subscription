<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
            Schema::create('subscriptions', function (Blueprint $table) {
                $table->id();
                $table->foreignId('client_id')->constrained('clients');
                $table->decimal('amount_paid', 10, 2)->nullable();
                $table->integer('valid_days');
                $table->text('description')->nullable();
                $table->text('expires_at');
                $table->text('is_active')->default(true);

                $table->boolean('is_trial')->default(false);
                $table->text('trial_ends_at')->nullable();
                
                $table->timestamps();
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
