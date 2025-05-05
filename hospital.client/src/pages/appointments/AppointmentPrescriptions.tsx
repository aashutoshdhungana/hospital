import { useParams } from "react-router-dom"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import axios from "axios"
import { RxType, Medication } from "./MedicationTable"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"


const AppointmentPrescriptions = () => {
    const { id } = useParams()
    const [medicationsRowData, setMedicationsRowData] = useState<Medication[]>([])
    const [rxOptions, setRxOptions] = useState<RxType[]>([]);
    const getMedications = async () => {
        try {
            let response = await axios.get(`/api/appointment/${id}/medications`)
            let data = response.data as Medication[]
            setMedicationsRowData(data)
        } catch {
            toast.error('Failed to load medication data')
            setMedicationsRowData([])
        }
    }
    const getRxName = (id: number) => {
        const match = rxOptions.find(rx => rx.id === id);
        return match ? match.name : id.toString();
    };
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    useEffect(() => {
        const getRxDropdown = async () => {
            try {
                let response = await axios.get('/api/RxInfo');
                let data = response.data as RxType[]
                setRxOptions(data)
            } catch {
                toast.error('Failed to load Rx options')
                setRxOptions([])
            }
        }
        getRxDropdown()
        getMedications()
    }, [id])
    return (
        <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-semibold">Medication</Label>
          <Button
                onClick={(e) => {
                    e.preventDefault();
                    const printTable = document.getElementById('print-table');
                    if (!printTable) return;

                    const printWindow = window.open('', '', 'width=900,height=650');
                    if (printWindow) {
                        printWindow.document.writeln(`
                            <html>
                            <head>
                                <title>Medication List</title>
                                <style>
                                    body { font-family: Arial, sans-serif; padding: 20px; }
                                    table { width: 100%; border-collapse: collapse; }
                                    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                                    th { background-color: #f5f5f5; }
                                </style>
                            </head>
                            <body>
                                <h2>Medications for Appointment ${id}</h2>
                                ${printTable.innerHTML}
                            </body>
                            </html>
                        `);
                        printWindow.document.close();
                        printWindow.focus();
                        printWindow.print();
                        printWindow.close();
                    }
                }}
            >
                Print
        </Button>

        </div>
  
        <div className="border rounded-md overflow-x-auto" id="print-table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rx Name</TableHead>
                <TableHead>Application Type</TableHead>
                <TableHead>Times Per Day</TableHead>
                <TableHead>Duration (Days)</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicationsRowData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
                    No medication data available
                  </TableCell>
                </TableRow>
              ) : (
                medicationsRowData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{getRxName(item.rxId)}</TableCell>
                    <TableCell>{item.applicationType}</TableCell>
                    <TableCell>{item.timesPerDay}</TableCell>
                    <TableCell>{item.durationInDays}</TableCell>
                    <TableCell>{formatDate(item.startDate)}</TableCell>
                    <TableCell>{item.remarks || '-'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    )
}

export default AppointmentPrescriptions;