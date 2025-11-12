import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DistributorStockItem {
  id: string;
  distributor_name: string;
  distributor_code: string;
  category: string;
  brand: string;
  item_name: string;
  item_code: string;
  case_size: number;
  quantity_cases: number;
  quantity_pcs: number;
  stock_value: number;
  batch: string | null;
  created_at: string;
}

const DistributorStock = () => {
  const [stockData, setStockData] = useState<DistributorStockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const { toast } = useToast();

  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("distributor_stock")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setStockData(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredData = stockData.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Distributor Stock</h1>
          <p className="text-muted-foreground">
            Manage distributor inventory and stock levels
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Stock Entry
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Stock Records</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Type & Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Item Code</TableHead>
                      <TableHead>Case Size</TableHead>
                      <TableHead className="text-right">Cases</TableHead>
                      <TableHead className="text-right">Pcs</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={12} className="text-center py-8">
                          No stock records found
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.distributor_name}
                          </TableCell>
                          <TableCell>{item.distributor_code}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.brand}</TableCell>
                          <TableCell>{item.item_name}</TableCell>
                          <TableCell>{item.item_code}</TableCell>
                          <TableCell>{item.case_size}</TableCell>
                          <TableCell className="text-right">
                            {item.quantity_cases}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.quantity_pcs}
                          </TableCell>
                          <TableCell className="text-right">
                            ₹{item.stock_value.toLocaleString()}
                          </TableCell>
                          <TableCell>{item.batch || "N/A"}</TableCell>
                          <TableCell>
                            {new Date(item.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of{" "}
                  {filteredData.length} entries
                </p>
                
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNum)}
                            isActive={currentPage === pageNum}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DistributorStock;
