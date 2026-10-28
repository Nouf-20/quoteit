<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function toggle(Request $request, Quote $quote)
    {
        $quote->likes()->toggle($request->user()->id);

        return back();
    }
}
