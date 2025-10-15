import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount = 1, from = "USD", to = "INR" } = await req.json();

    console.log(`Converting ${amount} ${from} to ${to}`);

    // Using frankfurter.app API (free, no API key required)
    const response = await fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`
    );

    if (!response.ok) {
      throw new Error(`Currency API error: ${response.status}`);
    }

    const data = await response.json();
    
    console.log('Conversion result:', data);

    return new Response(
      JSON.stringify({
        amount,
        from,
        to,
        rate: data.rates[to] / amount,
        converted: data.rates[to],
        date: data.date
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in currency-converter function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
