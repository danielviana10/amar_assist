<?php

use App\Http\Controllers\ProductImageController;
use Illuminate\Support\Facades\Route;


Route::middleware('custom_auth')->group(function () {
    Route::controller(ProductImageController::class)->prefix('images')->group(function () {
        Route::get('/{product}', 'index');
        Route::post('/{product}', 'addImages');
        Route::delete('/{image}', 'destroy');
    });
});