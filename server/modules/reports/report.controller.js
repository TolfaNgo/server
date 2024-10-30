const ExcelJS = require("exceljs");
const pool = require("../../../database");
const { format } = require("date-fns");

exports.generateSmallAnimalReport = async (req, res) => {
  const { startDate, endDate } = req.query;

  // Base SQL statement
  let sqlQuery = `
    SELECT 
      species.name AS species,
      COUNT(admission.id) AS count
    FROM 
      tolfa_admission_status AS admission
    JOIN tolfa_species AS species ON admission.species_id = species.id
    JOIN tolfa_rescue_type AS rescue_type ON admission.type_of_rescue_id = rescue_type.id
    WHERE 
      rescue_type.name LIKE 'Small Animal%'
  `;

  // Add date filtering if both startDate and endDate are provided
  if (startDate && endDate) {
    sqlQuery += ` AND admission.created_at BETWEEN ? AND ?`;
  }

  sqlQuery += `
    GROUP BY 
      species.id
    ORDER BY 
      count DESC
  `;

  const params = startDate && endDate ? [startDate, endDate] : [];

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Small Animal Admissions");

  // Define the columns for the data, including the new column for notes
  worksheet.columns = [
    { header: "Species", key: "species", width: 20 },
    { header: "Admissions Count", key: "count", width: 15 },
    { header: "Notes", key: "notes", width: 60 }, // Adjust width if needed
  ];

  // Execute the SQL query
  pool.query(sqlQuery, params, async (err, result) => {
    try {
      if (err) {
        res.status(500).json({
          status: 500,
          message: err,
          success: false,
        });
        return;
      } else if (result && result.length > 0) {
        // Create a summary line for the notes
        const startMonth = startDate
          ? format(new Date(startDate), "MMMM")
          : "All Time";
        const endMonth = endDate
          ? format(new Date(endDate), "MMMM")
          : "All Time";
        let totalNotes = `Between ${startMonth} to ${endMonth} we admitted `;

        // Accumulate counts for the summary
        const speciesCounts = {};
        result.forEach((row) => {
          speciesCounts[row.species] = row.count; // Store counts for each species
          worksheet.addRow(row); // Add individual rows
        });

        // Build the notes summary line
        const notesArray = Object.entries(speciesCounts)
          .map(([species, count]) => `${count} ${species}`)
          .join(", ");
        totalNotes += notesArray + "."; // Append counts to the summary

        // Add a summary row for notes at the end
        worksheet.addRow({ species: "", count: "", notes: totalNotes });

        // Set response headers for Excel download
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        const fileName = `Small_Animal_Report_${startDate || "All_Time"}_${
          endDate || "All_Time"
        }.xlsx`;
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=${fileName}`
        );

        // Write the workbook to the response
        await workbook.xlsx.write(res);
        res.end(); // End the response
      } else {
        // No data found
        res.status(404).json({
          message: "No data found for the given criteria.",
          status: 404,
          success: false,
        });
      }
    } catch (error) {
      console.error("Error generating report:", error);
      res.status(500).json({
        message: "Ops something went wrong",
        status: 500,
        success: false,
      });
    }
  });
};

exports.generateLargeAnimalReport = async (req, res) => {
  const { startDate, endDate } = req.query;

  // Base SQL statement
  let sqlQuery = `
    SELECT 
      species.name AS species,
      COUNT(admission.id) AS count
    FROM 
      tolfa_admission_status AS admission
    JOIN tolfa_species AS species ON admission.species_id = species.id
    JOIN tolfa_rescue_type AS rescue_type ON admission.type_of_rescue_id = rescue_type.id
    WHERE 
      rescue_type.name LIKE 'Large Animal%'
  `;

  // Add date filtering if both startDate and endDate are provided
  if (startDate && endDate) {
    sqlQuery += ` AND admission.created_at BETWEEN ? AND ?`;
  }

  sqlQuery += `
    GROUP BY 
      species.id
    ORDER BY 
      count DESC
  `;

  const params = startDate && endDate ? [startDate, endDate] : [];

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Large Animal Admissions");

  // Define the columns for the data, including the new column for notes
  worksheet.columns = [
    { header: "Species", key: "species", width: 20 },
    { header: "Admissions Count", key: "count", width: 15 },
    { header: "Notes", key: "notes", width: 40 }, // New column for notes
  ];

  // Execute the SQL query
  pool.query(sqlQuery, params, async (err, result) => {
    try {
      if (err) {
        res.status(500).json({
          status: 500,
          message: err,
          success: false,
        });
        return;
      } else if (result && result.length > 0) {
        // Add rows to the worksheet for each result
        result.forEach((row) => {
          // Update the notes field dynamically based on the month of the count
          const startMonth = startDate
            ? format(new Date(startDate), "MMMM")
            : "All Time";
          const endMonth = endDate
            ? format(new Date(endDate), "MMMM")
            : "All Time";

          row.notes = `Between ${startMonth} to ${endMonth} we admitted ${row.count} ${row.species}s`;
          worksheet.addRow(row);
        });

        // Set response headers for Excel download
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        const fileName = `Large_Animal_Report_${startDate || "All_Time"}_${
          endDate || "All_Time"
        }.xlsx`;
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=${fileName}`
        );

        // Write the workbook to the response
        await workbook.xlsx.write(res);
        res.end(); // End the response
      } else {
        // No data found
        res.status(404).json({
          message: "No data found for the given criteria.",
          status: 404,
          success: false,
        });
      }
    } catch (error) {
      console.error("Error generating report:", error);
      res.status(500).json({
        message: "Ops something went wrong",
        status: 500,
        success: false,
      });
    }
  });
};

exports.generateReleasedSmallAnimalReport = async (req, res) => {
  const { startDate, endDate } = req.query;

  // Base SQL statement
  let sqlQuery = `
    SELECT 
      species.name AS species,
      COUNT(admission.id) AS count
    FROM 
      tolfa_admission_status AS admission
    JOIN tolfa_species AS species ON admission.species_id = species.id
    JOIN tolfa_rescue_type AS rescue_type ON admission.type_of_rescue_id = rescue_type.id
    JOIN tolfa_rescue_animal_status AS rescue_status ON admission.id = rescue_status.rescue_id
    JOIN tolfa_animal_status AS animal_status ON rescue_status.status_id = animal_status.id
    WHERE 
      rescue_type.name LIKE 'Small Animal%'
      AND animal_status.name = 'Released'
      AND rescue_status.is_latest = 1
  `;

  // Add date filtering if both startDate and endDate are provided
  if (startDate && endDate) {
    sqlQuery += ` AND admission.created_at BETWEEN ? AND ?`;
  }

  sqlQuery += `
    GROUP BY 
      species.id
    ORDER BY 
      count DESC
  `;

  const params = startDate && endDate ? [startDate, endDate] : [];

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Released Small Animals");

  // Define the columns for the data, including the new column for notes
  worksheet.columns = [
    { header: "Species", key: "species", width: 20 },
    { header: "Released Count", key: "count", width: 15 },
    { header: "Notes", key: "notes", width: 60 }, // Adjust width if needed
  ];

  // Execute the SQL query
  pool.query(sqlQuery, params, async (err, result) => {
    try {
      if (err) {
        res.status(500).json({
          status: 500,
          message: err,
          success: false,
        });
        return;
      } else if (result && result.length > 0) {
        // Create a summary line for the notes
        const startMonth = startDate
          ? format(new Date(startDate), "MMMM")
          : "All Time";
        const endMonth = endDate
          ? format(new Date(endDate), "MMMM")
          : "All Time";
        let totalNotes = `Between ${startMonth} to ${endMonth} we released `;

        // Accumulate counts for the summary
        const speciesCounts = {};
        result.forEach((row) => {
          speciesCounts[row.species] = row.count; // Store counts for each species
          worksheet.addRow(row); // Add individual rows
        });

        // Build the notes summary line
        const notesArray = Object.entries(speciesCounts)
          .map(([species, count]) => `${count} ${species}`)
          .join(", ");
        totalNotes += notesArray + "."; // Append counts to the summary

        // Add a summary row for notes at the end
        worksheet.addRow({ species: "", count: "", notes: totalNotes });

        // Set response headers for Excel download
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        const fileName = `Released_Small_Animal_Report_${
          startDate || "All_Time"
        }_${endDate || "All_Time"}.xlsx`;
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=${fileName}`
        );

        // Write the workbook to the response
        await workbook.xlsx.write(res);
        res.end(); // End the response
      } else {
        // No data found
        res.status(404).json({
          message: "No data found for the given criteria.",
          status: 404,
          success: false,
        });
      }
    } catch (error) {
      console.error("Error generating report:", error);
      res.status(500).json({
        message: "Ops something went wrong",
        status: 500,
        success: false,
      });
    }
  });
};

exports.generateReleasedLargeAnimalReport = async (req, res) => {
  const { startDate, endDate } = req.query;

  // Base SQL statement
  let sqlQuery = `
    SELECT 
      species.name AS species,
      COUNT(admission.id) AS count
    FROM 
      tolfa_admission_status AS admission
    JOIN tolfa_species AS species ON admission.species_id = species.id
    JOIN tolfa_rescue_type AS rescue_type ON admission.type_of_rescue_id = rescue_type.id
    JOIN tolfa_rescue_animal_status AS rescue_status ON admission.id = rescue_status.rescue_id
    JOIN tolfa_animal_status AS animal_status ON rescue_status.status_id = animal_status.id
    WHERE 
      rescue_type.name LIKE 'Large Animal%'
      AND animal_status.name = 'Released'
      AND rescue_status.is_latest = 1
  `;

  // Add date filtering if both startDate and endDate are provided
  if (startDate && endDate) {
    sqlQuery += ` AND admission.created_at BETWEEN ? AND ?`;
  }

  sqlQuery += `
    GROUP BY 
      species.id
    ORDER BY 
      count DESC
  `;

  const params = startDate && endDate ? [startDate, endDate] : [];

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Released Large Animals");

  // Define the columns for the data, including the new column for notes
  worksheet.columns = [
    { header: "Species", key: "species", width: 20 },
    { header: "Released Count", key: "count", width: 15 },
    { header: "Notes", key: "notes", width: 60 }, // Adjust width if needed
  ];

  // Execute the SQL query
  pool.query(sqlQuery, params, async (err, result) => {
    try {
      if (err) {
        res.status(500).json({
          status: 500,
          message: err,
          success: false,
        });
        return;
      } else if (result && result.length > 0) {
        // Create a summary line for the notes
        const startMonth = startDate
          ? format(new Date(startDate), "MMMM")
          : "All Time";
        const endMonth = endDate
          ? format(new Date(endDate), "MMMM")
          : "All Time";
        let totalNotes = `Between ${startMonth} to ${endMonth} we released `;

        // Accumulate counts for the summary
        const speciesCounts = {};
        result.forEach((row) => {
          speciesCounts[row.species] = row.count; // Store counts for each species
          worksheet.addRow(row); // Add individual rows
        });

        // Build the notes summary line
        const notesArray = Object.entries(speciesCounts)
          .map(([species, count]) => `${count} ${species}`)
          .join(", ");
        totalNotes += notesArray + "."; // Append counts to the summary

        // Add a summary row for notes at the end
        worksheet.addRow({ species: "", count: "", notes: totalNotes });

        // Set response headers for Excel download
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        const fileName = `Released_Large_Animal_Report_${
          startDate || "All_Time"
        }_${endDate || "All_Time"}.xlsx`;
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=${fileName}`
        );

        // Write the workbook to the response
        await workbook.xlsx.write(res);
        res.end(); // End the response
      } else {
        // No data found
        res.status(404).json({
          message: "No data found for the given criteria.",
          status: 404,
          success: false,
        });
      }
    } catch (error) {
      console.error("Error generating report:", error);
      res.status(500).json({
        message: "Ops something went wrong",
        status: 500,
        success: false,
      });
    }
  });
};

exports.generateAdmittedByWhoReport = async (req, res) => {
  const { startDate, endDate } = req.query;

  // Base SQL query with two cases based on whether admission was by TOLFA or caregiver
  let sqlQuery = `
    SELECT 
      admission.id AS admission_id,
      CASE 
        WHEN admission.rescue_by_tolfa = 1 THEN 'TOLFA Team'
        ELSE 'Caregiver'
      END AS admitted_by,
      CASE 
        WHEN admission.rescue_by_tolfa = 1 THEN tolfa_user.name
        ELSE caregiver.name
      END AS rescuer_name,
      CASE 
        WHEN admission.rescue_by_tolfa = 1 THEN tolfa_user.phone_no
        ELSE caregiver.mob_no
      END AS rescuer_contact
    FROM 
      tolfa_admission_status AS admission
    LEFT JOIN rescued_by_tolfa_x_team AS tolfa_team ON admission.id = tolfa_team.rescue_id
    LEFT JOIN tolfa_user AS tolfa_user ON tolfa_team.name_id = tolfa_user.id
    LEFT JOIN tolfa_rescue_x_care_people AS care_mapping ON admission.id = care_mapping.rescue_id
    LEFT JOIN tolfa_care_people AS caregiver ON care_mapping.care_people_id = caregiver.id
    WHERE 1=1
  `;

  // Add date filtering if both startDate and endDate are provided
  if (startDate && endDate) {
    sqlQuery += ` AND admission.created_at BETWEEN ? AND ?`;
  }

  sqlQuery += `
    ORDER BY 
      admitted_by DESC, rescuer_name ASC
  `;

  const params = startDate && endDate ? [startDate, endDate] : [];

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Admitted By Who");

  // Define the columns for the data, including a notes column
  worksheet.columns = [
    { header: "Admission ID", key: "admission_id", width: 15 },
    { header: "Admitted By", key: "admitted_by", width: 20 },
    { header: "Rescuer Name", key: "rescuer_name", width: 20 },
    { header: "Rescuer Contact", key: "rescuer_contact", width: 15 },
  ];

  // Execute the SQL query
  pool.query(sqlQuery, params, async (err, result) => {
    try {
      if (err) {
        res.status(500).json({
          status: 500,
          message: err,
          success: false,
        });
        return;
      } else if (result && result.length > 0) {
        // Add individual rows to the worksheet
        result.forEach((row) => {
          worksheet.addRow(row);
        });

        // Set response headers for Excel download
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        const fileName = `Admitted_By_Who_Report_${startDate || "All_Time"}_${
          endDate || "All_Time"
        }.xlsx`;
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=${fileName}`
        );

        // Write the workbook to the response
        await workbook.xlsx.write(res);
        res.end(); // End the response
      } else {
        // No data found
        res.status(404).json({
          message: "No data found for the given criteria.",
          status: 404,
          success: false,
        });
      }
    } catch (error) {
      console.error("Error generating report:", error);
      res.status(500).json({
        message: "Ops something went wrong",
        status: 500,
        success: false,
      });
    }
  });
};

exports.generateCaregiverReport = async (req, res) => {
  const { startDate, endDate } = req.query;

  // SQL query to get total admissions and those with caregivers per species
  let sqlQuery = `
    SELECT 
      species.name AS species,
      COUNT(admission.id) AS total_admissions,
      COUNT(care_mapping.care_people_id) AS with_caregiver
    FROM 
      tolfa_admission_status AS admission
    JOIN tolfa_species AS species ON admission.species_id = species.id
    LEFT JOIN tolfa_rescue_x_care_people AS care_mapping ON admission.id = care_mapping.rescue_id
    WHERE 1=1
  `;

  // Add date filtering if both startDate and endDate are provided
  if (startDate && endDate) {
    sqlQuery += ` AND admission.created_at BETWEEN ? AND ?`;
  }

  sqlQuery += `
    GROUP BY 
      species.id
    ORDER BY 
      total_admissions DESC
  `;

  const params = startDate && endDate ? [startDate, endDate] : [];

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Caregiver Report");

  // Define columns for the worksheet
  worksheet.columns = [
    { header: "Species", key: "species", width: 20 },
    { header: "Total Admissions", key: "total_admissions", width: 20 },
    { header: "With Caregiver", key: "with_caregiver", width: 20 },
    { header: "Summary", key: "summary", width: 50 }, // Added summary column
  ];

  // Execute the SQL query
  pool.query(sqlQuery, params, async (err, result) => {
    try {
      if (err) {
        res.status(500).json({
          status: 500,
          message: err,
          success: false,
        });
        return;
      } else if (result && result.length > 0) {
        // Add rows to the worksheet with summary
        result.forEach((row) => {
          row.summary = `Out of ${row.total_admissions} admitted ${row.species}(s), ${row.with_caregiver} have caregivers`;
          worksheet.addRow(row);
        });

        // Set response headers for Excel download
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        const fileName = `Caregiver_Report_${startDate || "All_Time"}_${
          endDate || "All_Time"
        }.xlsx`;
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=${fileName}`
        );

        // Write the workbook to the response
        await workbook.xlsx.write(res);
        res.end(); // End the response
      } else {
        // No data found
        res.status(404).json({
          message: "No data found for the given criteria.",
          status: 404,
          success: false,
        });
      }
    } catch (error) {
      console.error("Error generating report:", error);
      res.status(500).json({
        message: "Ops something went wrong",
        status: 500,
        success: false,
      });
    }
  });
};

const AGE_MAPPING = {
  1: "New Born",
  2: "Young - Under 6 months",
  3: "Juvenile 6+ Months",
  4: "Adult",
  5: "Old",
};

const SEX_MAPPING = {
  1: "Male",
  2: "Female",
};

exports.generateInjuryReport = async (req, res) => {
  const { injury, speciesId, sex } = req.query;

  // Base SQL query to count admissions with detailed information
  let sqlQuery = `
    SELECT 
      COUNT(admission.id) AS count,
      admission.sex,
      admission.age,
      breed.name AS breed_name,
      rescue.problem
    FROM 
      tolfa_admission_status AS admission
    JOIN 
      tolfa_rescue_animal_status AS rescue ON admission.id = rescue.rescue_id
    JOIN 
      tolfa_animal_breed AS breed ON admission.breed_id = breed.id
    WHERE 
      rescue.is_latest = 1
  `;

  // Initialize parameters array
  const params = [];

  // Build the query based on input parameters
  if (injury) {
    sqlQuery += ` AND rescue.problem LIKE ?`;
    params.push(`%${injury}%`);
  }
  if (speciesId) {
    sqlQuery += ` AND admission.species_id = ?`;
    params.push(speciesId);
  }
  if (sex) {
    sqlQuery += ` AND admission.sex = ?`;
    params.push(sex);
  }

  // Group by sex, age, breed name, and problem
  sqlQuery += ` GROUP BY admission.sex, admission.age, breed.name, rescue.problem`;

  // Base SQL query for injury details
  const injuryDetailsQuery = `
    SELECT 
      admission.id AS admission_id,
      admission.sex,
      admission.age,
      breed.name AS breed_name,
      rescue.problem,
      rescue.alt_problem,
      rescue.injury_location,
      rescue.symptoms
    FROM 
      tolfa_admission_status AS admission
    JOIN 
      tolfa_rescue_animal_status AS rescue ON admission.id = rescue.rescue_id
    JOIN 
      tolfa_animal_breed AS breed ON admission.breed_id = breed.id
    WHERE 
      rescue.is_latest = 1
  `;

  // Create Excel workbook and worksheets
  const workbook = new ExcelJS.Workbook();
  const summarySheet = workbook.addWorksheet("Injury Report");
  const detailsSheet = workbook.addWorksheet("Injury Details");

  // Define columns for the summary worksheet
  summarySheet.columns = [
    { header: "Count", key: "count", width: 10 },
    { header: "Sex", key: "sex", width: 10 },
    { header: "Age", key: "age", width: 30 },
    { header: "Breed", key: "breed_name", width: 25 },
    { header: "Problem", key: "problem", width: 30 },
  ];

  // Define columns for the details worksheet
  detailsSheet.columns = [
    { header: "Admission ID", key: "admission_id", width: 15 },
    { header: "Sex", key: "sex", width: 10 },
    { header: "Age", key: "age", width: 30 },
    { header: "Breed", key: "breed_name", width: 25 },
    { header: "Problem", key: "problem", width: 30 },
    { header: "Alternative Problem", key: "alt_problem", width: 30 },
    { header: "Injury Location", key: "injury_location", width: 30 },
    { header: "Symptoms", key: "symptoms", width: 50 },
  ];

  // Execute the summary SQL query
  pool.query(sqlQuery, params, async (err, summaryResult) => {
    try {
      if (err) {
        res.status(500).json({
          status: 500,
          message: err,
          success: false,
        });
        return;
      } else if (summaryResult && summaryResult.length > 0) {
        // Map the result to include human-readable labels for summary
        const formattedSummaryResult = summaryResult.map((row) => ({
          count: row.count,
          sex: SEX_MAPPING[row.sex] || "Unknown",
          age: AGE_MAPPING[row.age] || "Unknown",
          breed_name: row.breed_name,
          problem: row.problem,
        }));

        // Add each row of formatted summary results to the summary worksheet
        formattedSummaryResult.forEach((row) => summarySheet.addRow(row));
      }

      // Execute the injury details SQL query
      pool.query(injuryDetailsQuery, async (err, detailsResult) => {
        if (err) {
          res.status(500).json({
            status: 500,
            message: err,
            success: false,
          });
          return;
        } else if (detailsResult && detailsResult.length > 0) {
          // Map the result to include human-readable labels for details
          const formattedDetailsResult = detailsResult.map((row) => ({
            admission_id: row.admission_id,
            sex: SEX_MAPPING[row.sex] || "Unknown",
            age: AGE_MAPPING[row.age] || "Unknown",
            breed_name: row.breed_name,
            problem: row.problem,
            alt_problem: row.alt_problem,
            injury_location: row.injury_location,
            symptoms: row.symptoms,
          }));

          // Add each row of formatted details results to the details worksheet
          formattedDetailsResult.forEach((row) => detailsSheet.addRow(row));
        }

        // Set response headers for Excel download
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        const fileName = `Injury_Report_${injury || "All"}_${
          speciesId || "All"
        }_${sex || "All"}.xlsx`;
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=${fileName}`
        );

        // Write the workbook to the response
        await workbook.xlsx.write(res);
        res.end(); // End the response
      });
    } catch (error) {
      console.error("Error generating report:", error);
      res.status(500).json({
        message: "Ops something went wrong",
        status: 500,
        success: false,
      });
    }
  });
};

exports.generateAreaReport = async (req, res) => {
  const { area, illness } = req.query;

  // Base SQL query to count admissions by area
  let areaCountQuery = `
    SELECT 
      COUNT(admission.id) AS count,
      area.name AS area_name
    FROM 
      tolfa_admission_status AS admission
    JOIN 
      tolfa_rescue_animal_status AS rescue ON admission.id = rescue.rescue_id
    JOIN 
      tolfa_city_area AS area ON admission.area_id = area.id
    WHERE 
      rescue.is_latest = 1
    GROUP BY area.name
  `;

  // SQL query to count admissions with a specific illness from the area
  let illnessCountQuery = `
    SELECT 
      COUNT(admission.id) AS count,
      area.name AS area_name
    FROM 
      tolfa_admission_status AS admission
    JOIN 
      tolfa_rescue_animal_status AS rescue ON admission.id = rescue.rescue_id
    JOIN 
      tolfa_city_area AS area ON admission.area_id = area.id
    WHERE 
      rescue.problem LIKE ? AND rescue.is_latest = 1
    GROUP BY area.name
  `;

  // Create Excel workbook and worksheets
  const workbook = new ExcelJS.Workbook();
  const summarySheet = workbook.addWorksheet("Area Report");

  // Define columns for the summary worksheet
  summarySheet.columns = [
    { header: "Count", key: "count", width: 10 },
    { header: "Area", key: "area_name", width: 25 },
  ];

  // Execute the total count query for all areas
  pool.query(areaCountQuery, async (err, areaResult) => {
    try {
      if (err) {
        res.status(500).json({
          status: 500,
          message: err,
          success: false,
        });
        return;
      }

      // Add area count results to the summary worksheet
      if (areaResult && areaResult.length > 0) {
        areaResult.forEach((row) => {
          summarySheet.addRow({
            count: row.count,
            area_name: row.area_name,
          });
        });
      }

      // Execute the illness count query if illness is specified
      if (illness) {
        const illnessParams = [`%${illness}%`];
        pool.query(illnessCountQuery, illnessParams, (err, illnessResult) => {
          if (err) {
            res.status(500).json({
              status: 500,
              message: err,
              success: false,
            });
            return;
          }

          // Add illness count results to the summary worksheet
          if (illnessResult && illnessResult.length > 0) {
            illnessResult.forEach((row) => {
              summarySheet.addRow({
                count: row.count,
                area_name: `${illness} Admissions from ${row.area_name}`,
              });
            });
          }

          // Set response headers for Excel download
          res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          );
          const fileName = `Area_Report_${illness || "All"}.xlsx`;
          res.setHeader(
            "Content-Disposition",
            `attachment; filename=${fileName}`
          );

          // Write the workbook to the response
          workbook.xlsx.write(res).then(() => {
            res.end(); // End the response
          });
        });
      } else {
        // Set response headers for Excel download
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        const fileName = `Area_Report_All_Areas.xlsx`;
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=${fileName}`
        );

        // Write the workbook to the response
        workbook.xlsx.write(res).then(() => {
          res.end(); // End the response
        });
      }
    } catch (error) {
      console.error("Error generating area report:", error);
      res.status(500).json({
        message: "Ops something went wrong",
        status: 500,
        success: false,
      });
    }
  });
};
