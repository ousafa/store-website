<?php

namespace App\Http\Actions\Api\V1;

use App\Http\Requests\Api\V1\StoreOrderItemRequest;
use App\Http\Requests\Api\V1\StoreOrderRequest;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StoreOrderAction
{
    public function execute(StoreOrderItemRequest $requestItem, StoreOrderRequest $requestOrder){
        $items = $requestItem->mappedAttributes(); // array of items
        $orderData = $requestOrder->mappedAttributes(); // user_id, status

        $response = response()->json($items);
        $itemsresponse = $response->original['items'];

        // 1. Check stock availability
        foreach ($itemsresponse as $item) {

            $product = Product::find($item['product_id']);


            if (!$product) {

                throw ValidationException::withMessages([
                    'product_id' => "Le produit avec l'ID {$item['product_id']} n'existe pas."
                ]);
            }
            if ($product->stock < $item['quantity']) {
                throw ValidationException::withMessages([
                    'stock' => "Le produit '{$product->name}' n'a pas assez de stock. Disponible : {$product->stock}"
                ]);
            }
        }

        // 2. Use transaction to avoid partial updates
        return DB::transaction(function () use ($orderData, $itemsresponse) {

            // 3. Calculate total
            $total = collect($itemsresponse)->sum(fn($item) => $item['quantity'] * $item['price']);
            $orderData['total'] = $total;

            // 4. Create the order
            $order = Order::create($orderData);

            // 5. Create order items and reduce stock
            foreach ($itemsresponse as $item) {
                $order->items()->create($item);

                $product = Product::find($item['product_id']);
                $product->decrement('stock', $item['quantity']);
            }

            return $order->load('items');
        });
    }
}
