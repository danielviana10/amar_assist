<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::controller(ProductController::class)->prefix('products')->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::get('/{product}', 'show');
        Route::put('/{product}', 'update');
        Route::post('/{product}/image', 'addImages');
        Route::patch('/{product}/status', 'updateStatus');
    });
});