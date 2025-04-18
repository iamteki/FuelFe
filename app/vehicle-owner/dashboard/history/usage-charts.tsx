// Mock data for the chart
  { month: "Feb", petrol92: 40, petrol95: 15, diesel: 0 },
    <Card className="col-span-3">
              <BarChart data={monthlyUsageData}>
                  tickLine={false}
                  label={{ value: 'Liters', angle: -90, position: 'insideLeft' }}
                  fill="#8884d8" 
          <TabsContent value="diesel" className="pt-4">
                  tickLine={false}
