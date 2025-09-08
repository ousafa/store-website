<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => 'order_items',
            'attributes' => [
                'product_id' => $this->product_id,
                'quantity' => $this->quantity,
                'price' => $this->price,
            ],
            'relationships' => [
                'order' => [
                    'data' => [
                        'type' => 'order',
                        'id' => $this->order->id,
                    ],
                    'links' =>[
                        // optional: 'self' => route('orders.items', $this->id)
                    ]
                ]
            ],
            'includes' => [
                'product' => $this->whenLoaded('product') ? new ProductResource($this->product) : null,
            ],


        ];
    }
}
