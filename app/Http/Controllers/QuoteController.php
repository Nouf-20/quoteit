<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use Illuminate\Http\Request;

class QuoteController extends Controller
{
    public function index()
    {
        $quotes = Quote::with(['user', 'likes'])
            ->withCount('likes')
            ->latest()
            ->get();

        return view('welcome', compact('quotes'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => ['required', 'string', 'min:3', 'max:155'],
        ]);

        $request->user()->quotes()->create($validated);

        return redirect('/')->with('status', 'Quote shared successfully.');
    }

    public function edit(Quote $quote)
    {
        $this->ensureOwner($quote);

        return view('quotes.edit', compact('quote'));
    }

    public function update(Request $request, Quote $quote)
    {
        $this->ensureOwner($quote);

        $validated = $request->validate([
            'content' => ['required', 'string', 'min:3', 'max:155'],
        ]);

        $quote->update($validated);

        return redirect('/')->with('status', 'Quote updated successfully.');
    }

    public function destroy(Quote $quote)
    {
        $this->ensureOwner($quote);

        $quote->delete();

        return redirect('/')->with('status', 'Quote deleted successfully.');
    }

    private function ensureOwner(Quote $quote): void
    {
        abort_unless($quote->user_id === auth()->id(), 403);
    }
}
