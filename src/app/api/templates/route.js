import path from 'path';
import fs from 'fs';

export const GET = ((req, res, next) => {
  // Get the path to the Excel template file
  const filePath = path.join(process.cwd(), 'public/static/templates/', 'Onshift_Employee_Template.xlsx');

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Set appropriate headers for downloading
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Onshift_Employee_Template.xlsx');

    // Send the file as a download response
    fs.createReadStream(filePath).pipe(res);
  } else {
    // File not found, send an error response
    res.status(404).end();
  }
});