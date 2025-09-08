<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray( Request $request) : array
    {
        return [
            'id' => $this->id,
            'type' => 'orders',
            'attributes' => [
                'user_id' => $this->user_id,
                'status' => $this->status,
                'total' => $this->total,
                'created_at' => $this->created_at,
                'updated_at' => $this->updated_at,
            ],
            'relationships' => [
                'items' => $this->items->map(fn($item) => [
                    'type' => 'order_items',
                    'id' => $item->id
                ])
            ],
            'includes' => [
                'user' => new UserResource($this->whenLoaded('user')),
                'items' => OrderItemResource::collection($this->whenLoaded('items')),
            ]
        ];
    }

}
