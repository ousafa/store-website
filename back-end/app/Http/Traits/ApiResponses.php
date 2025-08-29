<?php

namespace App\Http\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponses
{

    // Success Response
    protected function success($message = 'success',$data = [], $code = 200): JsonResponse
    {
        return response()->json([
            'code' => $code,
            'message' => $message,
            'payload' => $data,
        ], $code);
    }

    // Error Response
    protected function error($message = 'error', $code = 400): JsonResponse
    {
        return response()->json([
            'code' => $code,
            'message' => $message,
        ],$code);
    }


}


