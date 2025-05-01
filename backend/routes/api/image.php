<?php

use App\Http\Controllers\ProductImageController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::controller(ProductImageController::class)->prefix('images')->group(function () {
        Route::get('/', 'index');
        Route::put('/{image}', 'update');
        Route::delete('/{image}', 'destroy');
    });
});