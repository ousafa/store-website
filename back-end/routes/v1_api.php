<?php

use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')
    ->middleware('auth:sanctum')
    ->group(function () {
        // Products
        Route::apiResource('products', ProductController::class)->except(['update']);
        Route::put('products/{product}', [ProductController::class, 'replace']);
        Route::patch('products/{product}', [ProductController::class, 'update']);


        // Categories
        Route::apiResource('categories', CategoryController::class)->except(['update']);
        Route::put('categories/{category}', [CategoryController::class, 'replace']);
        Route::patch('categories/{category}', [CategoryController::class, 'update']);

        // Users
        Route::apiResource('users', UserController::class) ;


        // Orders
        Route::apiResource('/orders', OrderController::class);



    });
