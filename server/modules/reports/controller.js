const {
  RescueAnimalStatus,
  ABCStatus,
  Status,
  Condition,
  BodyScore,
} = require("./model/reports.model");
const ExcelJS = require("exceljs");
const pool = require("../../../database");

// Function to fetch data and generate Excel report
const getAnimalStatusReport = async (req, res) => {
  try {
    // Fetching data with associations
    const results = await RescueAnimalStatus.findAll({
      include: [
        { model: ABCStatus, as: "abcStatus" }, // Include tolfa_abc_status
        { model: Status, as: "status" }, // Include tolfa_status
        { model: Condition, as: "condition" }, // Include tolfa_condition
        { model: BodyScore, as: "bodyScore" }, // Include tolfa_body_score
      ],
      order: [["created_at", "ASC"]], // Sort by created_at date
    });

    // Create an Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Animal Status Report");

    // Add headers
    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Rescue ID", key: "rescue_id", width: 10 },
      { header: "ABC Status", key: "abc_status", width: 20 },
      { header: "Tattoo Number", key: "tattoo_number", width: 20 },
      { header: "Condition", key: "condition", width: 20 },
      { header: "Body Score", key: "body_score", width: 15 },
      { header: "Caregiver Name", key: "caregiver_name", width: 25 },
      { header: "Caregiver Number", key: "caregiver_number", width: 20 },
      { header: "Problem", key: "problem", width: 30 },
      { header: "Problem Type", key: "problem_type", width: 30 },
      { header: "Symptoms", key: "symptoms", width: 30 },
      { header: "Is Latest", key: "is_latest", width: 10 },
      { header: "Created At", key: "created_at", width: 20 },
      { header: "Updated At", key: "updated_at", width: 20 },
    ];

    // Add data rows
    results.forEach((result) => {
      worksheet.addRow({
        id: result.id,
        rescue_id: result.rescue_id,
        abc_status: result.abcStatus ? result.abcStatus.name : "N/A",
        tattoo_number: result.tattoo_number,
        condition: result.condition ? result.condition.name : "N/A",
        body_score: result.bodyScore ? result.bodyScore.name : "N/A",
        caregiver_name: result.caregiver_name,
        caregiver_number: result.caregiver_number,
        problem: result.problem,
        problem_type: result.problem_type,
        symptoms: result.symptoms,
        is_latest: result.is_latest ? "Yes" : "No",
        created_at: result.created_at,
        updated_at: result.updated_at,
      });
    });

    // Write the Excel file to response
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=AnimalStatusReport.xlsx"
    );

    // Send Excel file in response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating report");
  }
};

module.exports = { getAnimalStatusReport };
