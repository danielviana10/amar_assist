<?php

use App\Http\Controllers\ProductImageController;
use Illuminate\Support\Facades\Route;


Route::middleware('custom_auth')->group(function () {
    Route::controller(ProductImageController::class)->prefix('images')->group(function () {
        Route::get('/product/{product}', 'index');
        Route::put('/{image}', 'update');
        Route::delete('/{image}', 'destroy');
    });
});