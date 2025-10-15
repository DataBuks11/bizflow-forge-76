import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, DollarSign, IndianRupee } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState<string>("1");
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const { toast } = useToast();

  const handleConvert = async () => {
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('currency-converter', {
        body: { 
          amount: numAmount,
          from: "USD",
          to: "INR"
        }
      });

      if (error) throw error;

      setConvertedAmount(data.converted);
      setRate(data.rate);
      setLastUpdated(new Date(data.date).toLocaleDateString());
      
      toast({
        title: "Conversion Successful",
        description: `$${numAmount} USD = ₹${data.converted.toFixed(2)} INR`,
      });
    } catch (error) {
      console.error('Error converting currency:', error);
      toast({
        title: "Conversion Failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
          Currency Converter
        </h1>
        <p className="text-muted-foreground">Real-time USD to INR conversion</p>
      </div>

      <Card className="mb-6 transition-all duration-300 hover:shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-primary" />
            Convert Currency
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* USD Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              US Dollar (USD)
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount in USD"
              min="0"
              step="0.01"
              className="text-lg"
            />
          </div>

          {/* Convert Button */}
          <Button 
            onClick={handleConvert}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Converting...
              </>
            ) : (
              <>
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                Convert to INR
              </>
            )}
          </Button>

          {/* Result Section */}
          {convertedAmount !== null && (
            <div className="space-y-4 pt-4 border-t border-white/20 dark:border-gray-700/20 animate-fade-in">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-success" />
                  Indian Rupee (INR)
                </label>
                <div className="p-4 rounded-xl backdrop-blur-xl bg-gradient-to-r from-success/10 to-accent/10 border border-success/30">
                  <p className="text-3xl font-bold text-success">
                    ₹{convertedAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              {rate !== null && (
                <div className="p-4 rounded-xl backdrop-blur-xl bg-white/40 dark:bg-gray-800/40 border border-white/30 dark:border-gray-700/30">
                  <p className="text-sm text-muted-foreground mb-1">Exchange Rate</p>
                  <p className="text-lg font-semibold">
                    1 USD = ₹{rate.toFixed(4)} INR
                  </p>
                  {lastUpdated && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Last updated: {lastUpdated}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Conversion Reference */}
      <Card className="transition-all duration-300 hover:shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg">Quick Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 10, 100, 1000].map((value) => (
              <button
                key={value}
                onClick={() => setAmount(value.toString())}
                className="p-3 rounded-xl backdrop-blur-xl bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-700/30 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:scale-105"
              >
                <p className="text-sm text-muted-foreground">USD</p>
                <p className="text-lg font-semibold">${value}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CurrencyConverter;
