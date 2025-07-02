import { useMemo, useEffect } from "react";
import SellerDetailReport from "./components/SellerDetailReport";
import "./App.css";
import {
  client,
  useConfig,
  useElementData,
  useElementColumns,
} from "@sigmacomputing/plugin";

// Configure the editor panel
client.config.configureEditorPanel([
  // Main data source
  { name: "sellerDetailSource", type: "element" },
  // Code detail source
  { name: "codeDetailSource", type: "element" },
  
  // Report configuration
  { name: "reportDate", type: "text", defaultValue: new Date().toLocaleString() },
  { name: "pageNumber", type: "text", defaultValue: "1" },
  
  // Column mappings for seller detail
  { name: "runNumber", type: "column", source: "sellerDetailSource", allowMultiple: false },
  { name: "stockNumber", type: "column", source: "sellerDetailSource", allowMultiple: false },
  { name: "vin", type: "column", source: "sellerDetailSource", allowMultiple: false },
  { name: "year", type: "column", source: "sellerDetailSource", allowMultiple: false },
  { name: "make", type: "column", source: "sellerDetailSource", allowMultiple: false },
  { name: "model", type: "column", source: "sellerDetailSource", allowMultiple: false },
  { name: "mileage", type: "column", source: "sellerDetailSource", allowMultiple: false },
  { name: "color", type: "column", source: "sellerDetailSource", allowMultiple: false },
  { name: "saleAmount", type: "column", source: "sellerDetailSource", allowMultiple: false },
  { name: "saleDate", type: "column", source: "sellerDetailSource", allowMultiple: false },
  { name: "checkNumber", type: "column", source: "sellerDetailSource", allowMultiple: false },
  { name: "titleStatus", type: "column", source: "sellerDetailSource", allowMultiple: false },
  { name: "buyerName", type: "column", source: "sellerDetailSource", allowMultiple: false },
  { name: "buyerAddress", type: "column", source: "sellerDetailSource", allowMultiple: false },
  { name: "buyerCity", type: "column", source: "sellerDetailSource", allowMultiple: false },
  { name: "buyerState", type: "column", source: "sellerDetailSource", allowMultiple: false },
  { name: "buyerZip", type: "column", source: "sellerDetailSource", allowMultiple: false },
  { name: "sellerName", type: "column", source: "sellerDetailSource", allowMultiple: false },
  { name: "auctionCode", type: "column", source: "sellerDetailSource", allowMultiple: false },
  
  // Column mappings for code detail
  { name: "codeRunNumber", type: "column", source: "codeDetailSource", allowMultiple: false },
  { name: "codeDate", type: "column", source: "codeDetailSource", allowMultiple: false },
  { name: "codeDescription", type: "column", source: "codeDetailSource", allowMultiple: false },
  { name: "codeAmount", type: "column", source: "codeDetailSource", allowMultiple: false },
]);

// Types for the data structure
interface LineItem {
  date: string;
  description: string;
  amount: number;
}

interface Vehicle {
  runNumber: string;
  stockNumber: string;
  mileage: number;
  year: number;
  make: string;
  model: string;
  color: string;
  saleAmount: number;
  vin: string;
  saleDate: string;
  checkNumber: string;
  titleStatus: string;
  buyerName: string;
  buyerAddress: string;
  buyerCity: string;
  buyerState: string;
  buyerZip: string;
  lineItems: LineItem[];
  totalCharges: number;
  netProceeds: number;
}

interface ReportData {
  sellerName: string;
  saleDateRange: string;
  auctionHouse: string;
  vehicles: Vehicle[];
  totalSales: number;
  totalCharges: number;
  totalNetProceeds: number;
  vehicleCount: number;
  pageNumber: number;
  reportDate: string;
}

function App() {
  const config = useConfig();
  const sellerDetailData = useElementData(config.sellerDetailSource);
  const codeDetailData = useElementData(config.codeDetailSource);
  
  // Get configuration values
  const reportDate = (client.config.getKey as any)("reportDate") as string;
  const pageNumber = (client.config.getKey as any)("pageNumber") as string;

  // No need to load html2pdf.js via script tag anymore since we're importing it as a module

  const reportData = useMemo<ReportData | null>(() => {
    if (!sellerDetailData || !codeDetailData || !config.runNumber || !config.codeRunNumber) {
      return null;
    }

    // Helper function to parse dates consistently
    const parseDate = (dateValue: any): Date | null => {
      if (!dateValue) return null;
      
      try {
        if (typeof dateValue === 'number') {
          // Timestamp - create date in UTC
          return new Date(dateValue);
        } else if (dateValue instanceof Date) {
          return dateValue;
        } else if (typeof dateValue === 'string') {
          // If it's YYYY-MM-DD format, parse as UTC
          if (dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const [year, month, day] = dateValue.split('-').map(Number);
            return new Date(Date.UTC(year, month - 1, day));
          }
          return new Date(dateValue);
        }
      } catch (e) {
        console.error('Date parsing error:', e);
      }
      return null;
    };

    // Helper function to format date as MM/DD/YY using UTC values
    const formatDate = (dateValue: any): string => {
      const date = parseDate(dateValue);
      if (!date || isNaN(date.getTime())) return '';
      
      // Use UTC methods to avoid timezone issues
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      const year = String(date.getUTCFullYear()).slice(-2);
      return `${month}/${day}/${year}`;
    };

    // Alternative: If dates are still off, try local date formatting
    const formatDateLocal = (dateValue: any): string => {
      const date = parseDate(dateValue);
      if (!date || isNaN(date.getTime())) return '';
      
      // Use local methods
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      return `${month}/${day}/${year}`;
    };

    // Get seller name and auction code from the first row (they should be the same for all rows)
    const sellerName = sellerDetailData[config.sellerName]?.[0] || 'Unknown Seller';
    const auctionHouse = sellerDetailData[config.auctionCode]?.[0] || 'Unknown Auction';

    // Calculate date range from both seller detail and code detail dates
    const allDates: Date[] = [];
    
    // Collect sale dates from seller detail
    if (config.saleDate && sellerDetailData[config.saleDate]) {
      sellerDetailData[config.saleDate].forEach((dateValue: any) => {
        const date = parseDate(dateValue);
        if (date && !isNaN(date.getTime())) {
          allDates.push(date);
        }
      });
    }
    
    // Collect charge dates from code detail
    if (config.codeDate && codeDetailData[config.codeDate]) {
      codeDetailData[config.codeDate].forEach((dateValue: any) => {
        const date = parseDate(dateValue);
        if (date && !isNaN(date.getTime())) {
          allDates.push(date);
        }
      });
    }

    // Calculate min and max dates
    let saleDateRange = '';
    if (allDates.length > 0) {
      const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
      const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
      saleDateRange = `${formatDate(minDate)} - ${formatDate(maxDate)}`;
    }

    // Create a map of line items by run number
    const lineItemsByRunNumber = new Map<string, LineItem[]>();
    
    if (config.codeRunNumber && codeDetailData[config.codeRunNumber]) {
      const runNumbers = codeDetailData[config.codeRunNumber];
      const dates = codeDetailData[config.codeDate] || [];
      const descriptions = codeDetailData[config.codeDescription] || [];
      const amounts = codeDetailData[config.codeAmount] || [];
      
      runNumbers.forEach((runNumber: string, index: number) => {
        // Debug: log the raw date value to see what format we're receiving
        if (index < 3) { // Only log first few to avoid spam
          console.log('Code date raw value:', dates[index], 'Type:', typeof dates[index]);
        }
        
        const lineItem: LineItem = {
          date: formatDate(dates[index]),
          description: descriptions[index] || '',
          amount: Number(amounts[index]) || 0
        };
        
        if (!lineItemsByRunNumber.has(runNumber)) {
          lineItemsByRunNumber.set(runNumber, []);
        }
        lineItemsByRunNumber.get(runNumber)!.push(lineItem);
      });
    }

    // Process seller detail data
    const vehicles: Vehicle[] = [];
    let totalSales = 0;
    let totalCharges = 0;
    
    const numRows = sellerDetailData[config.runNumber]?.length || 0;
    
    for (let i = 0; i < numRows; i++) {
      const runNumber = String(sellerDetailData[config.runNumber]?.[i] || '');
      const saleAmount = Number(sellerDetailData[config.saleAmount]?.[i]) || 0;
      const lineItems = lineItemsByRunNumber.get(runNumber) || [];
      const vehicleCharges = lineItems.reduce((sum, item) => sum + item.amount, 0);
      
      const vehicle: Vehicle = {
        runNumber,
        stockNumber: String(sellerDetailData[config.stockNumber]?.[i] || ''),
        mileage: Number(sellerDetailData[config.mileage]?.[i]) || 0,
        year: Number(sellerDetailData[config.year]?.[i]) || 0,
        make: String(sellerDetailData[config.make]?.[i] || ''),
        model: String(sellerDetailData[config.model]?.[i] || ''),
        color: String(sellerDetailData[config.color]?.[i] || ''),
        saleAmount,
        vin: String(sellerDetailData[config.vin]?.[i] || ''),
        saleDate: formatDate(sellerDetailData[config.saleDate]?.[i]),
        checkNumber: String(sellerDetailData[config.checkNumber]?.[i] || ''),
        titleStatus: String(sellerDetailData[config.titleStatus]?.[i] || ''),
        buyerName: String(sellerDetailData[config.buyerName]?.[i] || ''),
        buyerAddress: String(sellerDetailData[config.buyerAddress]?.[i] || ''),
        buyerCity: String(sellerDetailData[config.buyerCity]?.[i] || ''),
        buyerState: String(sellerDetailData[config.buyerState]?.[i] || ''),
        buyerZip: String(sellerDetailData[config.buyerZip]?.[i] || ''),
        lineItems,
        totalCharges: vehicleCharges,
        netProceeds: saleAmount - vehicleCharges
      };
      
      vehicles.push(vehicle);
      totalSales += saleAmount;
      totalCharges += vehicleCharges;
    }
    
    return {
      sellerName,
      saleDateRange,
      auctionHouse,
      vehicles,
      totalSales,
      totalCharges,
      totalNetProceeds: totalSales - totalCharges,
      vehicleCount: vehicles.length,
      pageNumber: Number(pageNumber) || 1,
      reportDate
    };
  }, [sellerDetailData, codeDetailData, config, reportDate, pageNumber]);

  if (!reportData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg mb-2">Waiting for data...</p>
          <p className="text-sm text-gray-600">Please configure the data sources in the plugin settings.</p>
        </div>
      </div>
    );
  }

  return <SellerDetailReport data={reportData} />;
}

export default App;