import React, { useRef, useEffect, useState } from "react"

// Types for the data structure
interface LineItem {
  date: string
  description: string
  amount: number
}

interface Vehicle {
  runNumber: string
  stockNumber: string
  mileage: number
  year: number
  make: string
  model: string
  color: string
  saleAmount: number
  vin: string
  saleDate: string
  checkNumber: string
  titleStatus: string
  buyerName: string
  buyerAddress: string
  buyerCity: string
  buyerState: string
  buyerZip: string
  lineItems: LineItem[]
  totalCharges: number
  netProceeds: number
}

interface ReportData {
  sellerName: string
  saleDateRange: string
  auctionHouse: string
  vehicles: Vehicle[]
  totalSales: number
  totalCharges: number
  totalNetProceeds: number
  vehicleCount: number
  pageNumber: number
  reportDate: string
}

// Header component
const ReportHeader: React.FC<{ data: ReportData; pageNumber: number }> = ({ data, pageNumber }) => (
  <div className="report-header" style={{ textAlign: "center", marginBottom: "24px" }}>
    <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px", fontFamily: "Courier, monospace" }}>
      {data.auctionHouse}
    </div>
    <div style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px", fontFamily: "Courier, monospace" }}>
      Seller Detail for {data.sellerName}
    </div>
    <div style={{ fontSize: "16px", marginBottom: "16px", fontFamily: "Courier, monospace" }}>
      Sale Date: {data.saleDateRange}
    </div>
    <hr style={{ borderTop: "2px solid black", marginBottom: "24px" }} />
  </div>
)

// Updated VehicleEntry component
const VehicleEntry: React.FC<{ vehicle: Vehicle; isLast?: boolean }> = ({ vehicle, isLast }) => (
  <div className="vehicle-entry" style={{ marginBottom: isLast ? "0" : "24px", fontFamily: "Courier, monospace" }}>
    {/* Vehicle header table */}
    <div style={{ marginBottom: "12px" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid black" }}>
            <th style={{ textAlign: "left", width: "16%", padding: "4px", fontSize: "14px", fontWeight: "normal" }}>
              Sale Date<br />Stock #
            </th>
            <th style={{ textAlign: "left", width: "16%", padding: "4px", fontSize: "14px", fontWeight: "normal" }}>
              Run #<br />Color
            </th>
            <th style={{ textAlign: "left", width: "25%", padding: "4px", fontSize: "14px", fontWeight: "normal" }}>
              VIN<br />Mileage
            </th>
            <th style={{ textAlign: "left", width: "27%", padding: "4px", fontSize: "14px", fontWeight: "normal" }}>
              Vehicle<br />
            </th>
            <th style={{ textAlign: "right", width: "16%", padding: "4px", fontSize: "14px", fontWeight: "normal" }}>
              Sale Amount:<br />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: "4px", fontSize: "14px", verticalAlign: "top" }}>
              <div style={{ fontWeight: "bold" }}>{vehicle.saleDate}</div>
              <div>{vehicle.stockNumber}</div>
            </td>
            <td style={{ padding: "4px", fontSize: "14px", verticalAlign: "top" }}>
              <div style={{ fontWeight: "bold" }}>{vehicle.runNumber}</div>
              <div>{vehicle.color}</div>
            </td>
            <td style={{ padding: "4px", fontSize: "14px", verticalAlign: "top" }}>
              <div style={{ fontWeight: "bold" }}>{vehicle.vin}</div>
              <div>{vehicle.mileage.toLocaleString()}</div>
            </td>
            <td style={{ padding: "4px", fontSize: "14px", verticalAlign: "top" }}>
              <div style={{ fontWeight: "bold" }}>
                {vehicle.year} {vehicle.make} {vehicle.model}
              </div>
            </td>
            <td style={{ padding: "4px", textAlign: "right", fontSize: "14px", verticalAlign: "top" }}>
              <div style={{ fontWeight: "bold" }}>
                ${vehicle.saleAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    {/* Additional info line */}
    <div style={{ fontSize: "14px", marginBottom: "8px", fontFamily: "Courier, monospace" }}>
      <span>{vehicle.vin.slice(-6)} - </span>
    </div>

    {/* Check and title status */}
    <div style={{ fontSize: "14px", marginBottom: "12px", fontFamily: "Courier, monospace" }}>
      <span>Check #: </span>
      {vehicle.checkNumber}
      <span style={{ marginLeft: "32px" }}>Title Status: </span>
      {vehicle.titleStatus}
    </div>

    {/* Main content area */}
    <div style={{ display: "flex", fontSize: "14px", fontFamily: "Courier, monospace" }}>
      <div style={{ width: "58%", paddingRight: "24px" }}>
        <div style={{ marginBottom: "4px", fontWeight: "bold" }}>Buyer:</div>
        <div style={{ marginBottom: "16px" }}>
          <div>{vehicle.buyerName}</div>
          <div>{vehicle.buyerAddress}</div>
          <div>
            {vehicle.buyerCity}, {vehicle.buyerState} {vehicle.buyerZip}
          </div>
        </div>
      </div>
      <div style={{ width: "42%" }}>
        {/* Line items with monospace table for alignment */}
        {vehicle.lineItems.length > 0 && (
          <>
            <table style={{ width: "100%", fontFamily: "Courier, monospace", fontSize: "14px", borderCollapse: "collapse" }}>
              <tbody>
                {vehicle.lineItems.map((item, index) => (
                  <tr key={index}>
                    <td style={{ width: "30%", padding: "2px 0" }}>{item.date}</td>
                    <td style={{ width: "45%", padding: "2px 0" }}>{item.description}</td>
                    <td style={{ width: "25%", padding: "2px 0", textAlign: "right" }}>${item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals section */}
            <div style={{ borderTop: "1px solid black", marginTop: "8px", paddingTop: "8px" }}>
              <table style={{ width: "100%", fontFamily: "Courier, monospace", fontSize: "14px" }}>
                <tbody>
                  <tr>
                    <td style={{ textAlign: "right", paddingRight: "10px" }}>Total Charges:</td>
                    <td style={{ width: "25%", textAlign: "right" }}>${vehicle.totalCharges.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "right", paddingRight: "10px" }}>Net Proceeds:</td>
                    <td style={{ width: "25%", textAlign: "right" }}>${vehicle.netProceeds.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>

    {/* Bottom separator - only if not last vehicle on page */}
    {!isLast && <hr style={{ borderTop: "2px solid black", marginTop: "16px" }} />}
  </div>
)

// Updated Footer component
const ReportFooter: React.FC<{ data: ReportData; pageNumber: number; isLastPage?: boolean }> = ({ 
  data, 
  pageNumber, 
  isLastPage 
}) => (
  <div className="report-footer" style={{ fontFamily: "Courier, monospace" }}>
    {/* Summary totals - only show on last page */}
    {isLastPage && (
      <>
        <hr style={{ borderTop: "2px solid black", marginBottom: "16px", marginTop: "16px" }} />
        <div style={{ marginBottom: "16px", fontSize: "14px" }}>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            {/* Left column - Vehicle Count */}
            <div style={{ width: "33%" }}>
              <div>Vehicle Count: {data.vehicleCount}</div>
            </div>
            
            {/* Middle column - Values */}
            <div style={{ width: "34%", textAlign: "right", paddingRight: "20px" }}>
              <div>${data.totalSales.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <div>${data.totalCharges.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <div>${data.totalNetProceeds.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            
            {/* Right column - Labels */}
            <div style={{ width: "33%", textAlign: "right" }}>
              <div>Total Sale</div>
              <div>Total Charges:</div>
              <div>Net Proceeds:</div>
            </div>
          </div>
        </div>
      </>
    )}

    {/* Page footer */}
    <div style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center", 
      fontSize: "12px", 
      color: "#666", 
      borderTop: "1px solid #999", 
      paddingTop: "8px",
      fontFamily: "Courier, monospace"
    }}>
      <div>{data.reportDate}</div>
      <div>Page: {pageNumber}</div>
    </div>
  </div>
)

// Carousel navigation component
const CarouselNavigation: React.FC<{
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}> = ({ currentPage, totalPages, onPageChange }) => (
  <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    padding: "20px",
    backgroundColor: "#f5f5f5",
    borderTop: "1px solid #ddd"
  }}>
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 0}
      style={{
        padding: "8px 16px",
        fontSize: "14px",
        backgroundColor: currentPage === 0 ? "#ccc" : "#007bff",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: currentPage === 0 ? "not-allowed" : "pointer",
        transition: "background-color 0.2s"
      }}
    >
      Previous
    </button>
    
    <span style={{ fontSize: "14px", fontWeight: "500" }}>
      Page {currentPage + 1} of {totalPages}
    </span>
    
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages - 1}
      style={{
        padding: "8px 16px",
        fontSize: "14px",
        backgroundColor: currentPage === totalPages - 1 ? "#ccc" : "#007bff",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: currentPage === totalPages - 1 ? "not-allowed" : "pointer",
        transition: "background-color 0.2s"
      }}
    >
      Next
    </button>
  </div>
)

// Main report component
const SellerDetailReport: React.FC<{ data: ReportData }> = ({ data }) => {
  const reportRef = useRef<HTMLDivElement>(null)
  const [pages, setPages] = useState<Vehicle[][]>([])
  const [isExporting, setIsExporting] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const measureRef = useRef<HTMLDivElement>(null)

  // More accurate vehicle height estimation
  const estimateVehicleHeight = (vehicle: Vehicle): number => {
    // Base components:
    // Table header: ~80px
    // Table content: ~60px
    // VIN line: ~30px
    // Check/Title line: ~35px
    // Buyer info: ~100px
    // Separator: ~40px
    
    let height = 245 // Base height reduced to allow more vehicles per page
    
    // Add height for line items if they exist
    if (vehicle.lineItems.length > 0) {
      // Each line item ~22px + totals section ~60px
      height += (vehicle.lineItems.length * 22) + 60
    }
    
    return height
  }

  // Calculate dynamic pagination based on actual rendering
  useEffect(() => {
    // Constants for page layout (in pixels at 96 DPI)
    const PAGE_HEIGHT = 11 * 96 // 11 inches
    const MARGIN_TOP = 0.5 * 96 // 0.5 inch
    const MARGIN_BOTTOM = 0.5 * 96 // 0.5 inch
    const HEADER_HEIGHT = 140 // Measured header height
    const FOOTER_HEIGHT = 50 // Footer without summary
    const SUMMARY_HEIGHT = 100 // Summary section on last page (reduced)
    
    const pageArray: Vehicle[][] = []
    let currentPageVehicles: Vehicle[] = []
    let currentPageHeight = 0
    
    // Calculate available content height - increased to fit more
    const baseAvailableHeight = PAGE_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM - HEADER_HEIGHT - FOOTER_HEIGHT - 20 // Added buffer
    
    data.vehicles.forEach((vehicle, index) => {
      const vehicleHeight = estimateVehicleHeight(vehicle)
      const isLastVehicle = index === data.vehicles.length - 1
      
      // Check if adding this vehicle would exceed available height
      if (currentPageHeight + vehicleHeight > baseAvailableHeight && currentPageVehicles.length > 0) {
        // Start a new page
        pageArray.push(currentPageVehicles)
        currentPageVehicles = [vehicle]
        currentPageHeight = vehicleHeight
      } else {
        // Add to current page
        currentPageVehicles.push(vehicle)
        currentPageHeight += vehicleHeight
      }
      
      // Handle the last vehicle
      if (isLastVehicle && currentPageVehicles.length > 0) {
        // Check if we need to account for summary on last page
        const availableHeightLastPage = baseAvailableHeight - SUMMARY_HEIGHT
        
        if (currentPageHeight > availableHeightLastPage && currentPageVehicles.length > 1) {
          // Move last vehicle to new page to make room for summary
          const lastVehicle = currentPageVehicles.pop()!
          pageArray.push(currentPageVehicles)
          pageArray.push([lastVehicle])
        } else {
          pageArray.push(currentPageVehicles)
        }
      }
    })
    
    setPages(pageArray)
    setCurrentPage(0)
  }, [data.vehicles])

  // Handle page navigation
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < pages.length) {
      setCurrentPage(newPage)
    }
  }

  // Updated handleExportPDF function with proper formatting
  const handleExportPDF = async () => {
    setIsExporting(true)
    
    try {
      // Import html2pdf.js
      const html2pdf = (await import('html2pdf.js')).default
      
      // Create the export container
      const exportDiv = document.createElement('div')
      exportDiv.style.fontFamily = 'Courier New, Courier, monospace'
      exportDiv.style.fontSize = '12px'
      exportDiv.style.lineHeight = '1.4'
      exportDiv.style.color = 'black'
      
      let htmlContent = ''
      
      // Process each page
      pages.forEach((pageVehicles, pageNum) => {
        const isLastPage = pageNum === pages.length - 1
        
        // Page container - removed fixed height, just set width and padding
        htmlContent += `<div style="width: 8.5in; padding: 0.5in; box-sizing: border-box; background: white; ${pageNum > 0 ? 'page-break-before: always;' : ''}">`
        
        // Header
        htmlContent += `
          <div style="text-align: center; margin-bottom: 20px; font-family: 'Courier New', Courier, monospace;">
            <div style="font-size: 24px; font-weight: bold;">${data.auctionHouse}</div>
            <div style="font-size: 20px; font-weight: bold; margin-top: 5px;">Seller Detail for ${data.sellerName}</div>
            <div style="font-size: 16px; margin-top: 5px;">Sale Date: ${data.saleDateRange}</div>
          </div>
          <hr style="border: none; border-top: 2px solid black; margin: 20px 0;">
        `
        
        // Content container
        htmlContent += `<div>`
        
        // Vehicles
        pageVehicles.forEach((vehicle, vIndex) => {
          const isLastVehicleOnPage = vIndex === pageVehicles.length - 1
          
          // Vehicle header
          htmlContent += `
            <div style="margin-bottom: ${(isLastVehicleOnPage && !isLastPage) ? '0' : '24px'}; font-family: 'Courier New', Courier, monospace;">
              <table style="width: 100%; border-collapse: collapse; table-layout: fixed;">
                <thead>
                  <tr style="border-bottom: 2px solid black;">
                    <th style="text-align: left; width: 16%; padding: 4px; font-size: 14px; font-weight: normal;">Sale Date<br>Stock #</th>
                    <th style="text-align: left; width: 16%; padding: 4px; font-size: 14px; font-weight: normal;">Run #<br>Color</th>
                    <th style="text-align: left; width: 25%; padding: 4px; font-size: 14px; font-weight: normal;">VIN<br>Mileage</th>
                    <th style="text-align: left; width: 27%; padding: 4px; font-size: 14px; font-weight: normal;">Vehicle</th>
                    <th style="text-align: right; width: 16%; padding: 4px; font-size: 14px; font-weight: normal;">Sale Amount:</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="padding: 4px; font-size: 14px; vertical-align: top;">
                      <div style="font-weight: bold;">${vehicle.saleDate}</div>
                      <div>${vehicle.stockNumber}</div>
                    </td>
                    <td style="padding: 4px; font-size: 14px; vertical-align: top;">
                      <div style="font-weight: bold;">${vehicle.runNumber}</div>
                      <div>${vehicle.color}</div>
                    </td>
                    <td style="padding: 4px; font-size: 14px; vertical-align: top;">
                      <div style="font-weight: bold;">${vehicle.vin}</div>
                      <div>${vehicle.mileage.toLocaleString()}</div>
                    </td>
                    <td style="padding: 4px; font-size: 14px; vertical-align: top;">
                      <div style="font-weight: bold;">${vehicle.year} ${vehicle.make} ${vehicle.model}</div>
                    </td>
                    <td style="padding: 4px; text-align: right; font-size: 14px; vertical-align: top;">
                      <div style="font-weight: bold;">$${vehicle.saleAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
          `
          
          // VIN suffix and check info
          htmlContent += `
            <div style="font-size: 14px; margin: 8px 0 5px 0; font-family: 'Courier New', Courier, monospace;">${vehicle.vin.slice(-6)} -</div>
            <div style="font-size: 14px; margin-bottom: 10px; font-family: 'Courier New', Courier, monospace;">Check #: ${vehicle.checkNumber}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Title Status: ${vehicle.titleStatus}</div>
          `
          
          // Two column layout
          htmlContent += `<table style="width: 100%; font-size: 14px; font-family: 'Courier New', Courier, monospace;"><tr>`
          
          // Buyer column
          htmlContent += `
            <td style="width: 58%; padding-right: 24px; vertical-align: top;">
              <div style="font-weight: bold; margin-bottom: 4px;">Buyer:</div>
              <div style="margin-bottom: 16px;">
                <div>${vehicle.buyerName}</div>
                <div>${vehicle.buyerAddress}</div>
                <div>${vehicle.buyerCity}, ${vehicle.buyerState} ${vehicle.buyerZip}</div>
              </div>
            </td>
          `
          
          // Charges column
          htmlContent += `<td style="width: 42%; vertical-align: top;">`
          
          if (vehicle.lineItems.length > 0) {
            htmlContent += `<table style="width: 100%; font-size: 14px; font-family: 'Courier New', Courier, monospace; border-collapse: collapse;">`
            vehicle.lineItems.forEach(item => {
              htmlContent += `
                <tr>
                  <td style="width: 30%; padding: 2px 0;">${item.date}</td>
                  <td style="width: 45%; padding: 2px 0;">${item.description}</td>
                  <td style="width: 25%; padding: 2px 0; text-align: right;">$${item.amount.toFixed(2)}</td>
                </tr>
              `
            })
            htmlContent += `</table>`
            
            // Totals
            htmlContent += `
              <div style="border-top: 1px solid black; margin-top: 8px; padding-top: 8px;">
                <table style="width: 100%; font-size: 14px; font-family: 'Courier New', Courier, monospace;">
                  <tr>
                    <td style="text-align: right; padding-right: 10px;">Total Charges:</td>
                    <td style="width: 25%; text-align: right;">$${vehicle.totalCharges.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style="text-align: right; padding-right: 10px;">Net Proceeds:</td>
                    <td style="width: 25%; text-align: right;">$${vehicle.netProceeds.toFixed(2)}</td>
                  </tr>
                </table>
              </div>
            `
          }
          
          htmlContent += `</td></tr></table>`
          
          // Separator if not last vehicle on page or if it's the last page
          if (!isLastVehicleOnPage || isLastPage) {
            htmlContent += `<hr style="border: none; border-top: 2px solid black; margin: 16px 0;">`
          }
          
          htmlContent += `</div>`
        })
        
        htmlContent += `</div>` // End content container
        
        // Footer
        htmlContent += `<div style="margin-top: 20px; font-family: 'Courier New', Courier, monospace;">`
        
        // Summary on last page
        if (isLastPage) {
          htmlContent += `
            <div style="margin-bottom: 16px; font-size: 14px;">
              <table style="width: 100%;">
                <tr>
                  <td style="width: 33%;">Vehicle Count: ${data.vehicleCount}</td>
                  <td style="width: 34%; text-align: right; padding-right: 20px;">
                    $${data.totalSales.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<br>
                    $${data.totalCharges.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<br>
                    $${data.totalNetProceeds.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td style="width: 33%; text-align: right;">
                    Total Sale<br>
                    Total Charges:<br>
                    Net Proceeds:
                  </td>
                </tr>
              </table>
            </div>
          `
        }
        
        // Page info
        htmlContent += `
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #666; border-top: 1px solid #999; padding-top: 8px;">
            <div>${data.reportDate}</div>
            <div>Page: ${pageNum + 1}</div>
          </div>
        </div>`
        
        htmlContent += `</div>` // End page
      })
      
      exportDiv.innerHTML = htmlContent
      document.body.appendChild(exportDiv)
      
      const options = {
        margin: 0,
        filename: `seller-detail-${data.sellerName.replace(/\s+/g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        },
        jsPDF: { 
          unit: 'in', 
          format: 'letter', 
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      }
      
      await html2pdf().set(options).from(exportDiv).save()
      
      document.body.removeChild(exportDiv)
      console.log('PDF generated successfully')
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert(`Error generating PDF: ${error.message}`)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "100vh",
      overflow: "hidden"
    }}>
      {/* Hidden measurement div */}
      <div ref={measureRef} style={{ position: 'absolute', visibility: 'hidden', width: '7.5in' }} />
      
      {/* Export button */}
      <div className="no-print" style={{ 
        position: "absolute", 
        top: "16px", 
        right: "16px", 
        zIndex: 1000
      }}>
        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          style={{
            backgroundColor: isExporting ? "#6c757d" : "#007bff",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "4px",
            cursor: isExporting ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
          }}
        >
          {isExporting ? 'Generating PDF...' : 'Export to PDF'}
        </button>
      </div>

      {/* Carousel container */}
      <div style={{ 
        flex: 1,
        overflow: "auto",
        backgroundColor: "#f0f0f0",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "20px 0"
      }}>
        <div ref={reportRef} style={{ backgroundColor: "white" }}>
          {pages.length > 0 && (
            <div
              className="report-page"
              style={{
                fontFamily: "Courier, monospace",
                width: "8.5in",
                height: "11in",
                padding: "0.5in",
                backgroundColor: "white",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
                overflow: "hidden"
              }}
            >
              {/* Header - appears on every page */}
              <ReportHeader data={data} pageNumber={currentPage + 1} />

              {/* Vehicle entries for current page - with explicit height */}
              <div style={{ 
                flex: 1, 
                overflow: "hidden",
                display: "flex",
                flexDirection: "column"
              }}>
                {pages[currentPage]?.map((vehicle, index) => (
                  <VehicleEntry 
                    key={`${currentPage}-${index}`} 
                    vehicle={vehicle} 
                    isLast={index === pages[currentPage].length - 1 && currentPage !== pages.length - 1}
                  />
                ))}
              </div>

              {/* Footer - fixed at bottom */}
              <div style={{ marginTop: "auto", flexShrink: 0 }}>
                <ReportFooter 
                  data={data} 
                  pageNumber={currentPage + 1} 
                  isLastPage={currentPage === pages.length - 1}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Carousel navigation */}
      {pages.length > 1 && (
        <CarouselNavigation
          currentPage={currentPage}
          totalPages={pages.length}
          onPageChange={handlePageChange}
        />
      )}

      {/* Print styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          .report-page {
            page-break-after: always;
            page-break-inside: avoid;
            margin: 0 !important;
            box-shadow: none !important;
          }
          
          .report-page:last-child {
            page-break-after: auto;
          }
          
          .vehicle-entry {
            page-break-inside: avoid;
          }
        }
        
        @page {
          size: letter;
          margin: 0.5in;
        }
      `}</style>
    </div>
  )
}

export default SellerDetailReport