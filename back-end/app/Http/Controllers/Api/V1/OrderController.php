<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Actions\Api\V1\StoreOrderAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreOrderItemRequest;
use App\Http\Requests\Api\V1\StoreOrderRequest;
use App\Http\Requests\Api\V1\UpdateOrderRequest;
use App\Http\Resources\V1\OrderResource;
use App\Http\Traits\ApiResponses;
use App\Models\Order;
use App\Models\product;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    Use ApiResponses;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // load both user and items
        $orders = Order::with(['user', 'items'])
            ->latest()
            ->paginate(8);

        return OrderResource::collection($orders);
    }



    /**
     * Store a newly created resource in storage.
     */
//    public function store(
//        StoreOrderItemRequest $requestItem,
//        StoreOrderRequest $requestOrder,
//        StoreOrderAction $action
//    ) {
//        // Execute the business logic (verify stock, reduce stock, calculate total, etc.)
//        $order = $action->execute($requestItem, $requestOrder);
//
//        // Return API response
//        //return new OrderResource($order);
//        return response()->json($order);
//
//
////
////        $order  = new OrderResource(Order::create($request->mappedAttributes()));
////        $items =  $request->input('data.includes.items');
////
////        foreach ($items as $item) {
////            $order->items()->create([
////                'product_id' => $item['product_id'],
////                'quantity'   => $item['quantity'],
////                'price'      => $item['price'],
////            ]);
////        }
////        return new OrderResource($order->load('items'));
//    }
    public function store(
        StoreOrderItemRequest $requestItem,
        StoreOrderRequest $requestOrder,
        StoreOrderAction $action
    ) {
        $order = $action->execute($requestItem, $requestOrder);
        $order->load('items');
        return new OrderResource($order);

    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $order = Order::with(['user', 'items.product'])->findOrFail($id);

        return new OrderResource($order);

    }



    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrderRequest $request, Order $order)
    {
        $validated = $request->validated();

        $order->update([
            'status' => $validated['status'],
        ]);

        $order->load('user', 'items.product');

        return response()->json([
            'message' => 'Order status updated successfully',
            'data' => new OrderResource($order),
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $order_id)
    {
        try {
            $order = Order::findOrFail($order_id);


            $order->delete();

            // Return success with deleted category data
            return $this->success('Order successfully deleted');

        } catch (ModelNotFoundException $exception) {
            return $this->error('Order cannot be found.', 404);
        }
    }
}
