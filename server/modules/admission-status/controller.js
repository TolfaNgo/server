const pool = require("../../../database");
const moment = require("moment");
const TABLE_NAME = "tolfa_animal_status";

exports.get = async (req, res) => {
  const statement = `
  SELECT
    tas.id AS rescue_no,
    tas.type_of_rescue_id,
    tas.species_id,
    tas.state_id,
    tas.city_id,
    tas.area_id,
    tas.rescue_address,
    tas.rescue_by_tolfa,
    tas.animal_name,
    tas.sex,
    tas.age,
    tas.main_color_id,
    tas.second_color_id,
    tas.thirdcolor_id,
    tas.id_features,
    tas.breed_id,
    tas.animal_image,
    tas.created_at AS admission_created_at,
    tas.active AS admission_active,
    tas.created_by AS admission_created_by,
    
    rs.id AS rescue_status_id,
    rs.status_id,
    rs.abc_status,
    rs.tattoo_number,
    rs.condition_value,
    rs.body_score,
    rs.caregiver_name,
    rs.caregiver_number,
    rs.problem,
    rs.problem_type,
    rs.symptoms,
    rs.injury_location,
    rs.alt_problem,
    rs.alt_problem_type,
    rs.alt_symptoms,
    rs.alt_injury_location,
    rs.cause_of_problem,
    rs.rassi_no,
    rs.created_at AS status_created_at,
    rs.updated_at AS status_updated_at,
    rs.created_by AS status_created_by,
    rs.updated_by AS status_updated_by,
    rs.is_latest AS status_is_latest,
    
    rxc.id AS rescue_care_people_id,
    rxc.care_people_id,
    
    tcp.id AS care_people_id,
    tcp.name AS care_people_name,
    tcp.mob_no AS care_people_mob_no,
    tcp.alt_mob_no AS care_people_alt_mob_no,
    tcp.address AS care_people_address,
    tcp.created_at AS care_people_created_at,
    tcp.updated_at AS care_people_updated_at,
    tcp.created_by AS care_people_created_by,
    tcp.updated_by AS care_people_updated_by,
    
    tu.id AS user_id,
    tu.name AS user_name,
    tu.email,
    tu.phone_no,
    tu.active,
    tu.created_at AS user_created_at,
    tu.updated_at AS user_updated_at,
    tu.created_by AS user_created_by,
    tu.updated_by AS user_updated_by,
    
    GROUP_CONCAT(DISTINCT tu_rbtx.name) AS rescued_by_team_user_names,
    
    trl.id AS rescue_location_id,
    trl.tolfa_area_id,
    trl.tolfa_block_id,
    trl.created_at AS location_created_at,
    trl.updated_at AS location_updated_at,
    trl.created_by AS location_created_by,
    trl.updated_by AS location_updated_by,
    trl.is_latest AS location_is_latest,
    
    tbn.id AS block_id,
    tbn.name AS block_name,
    tbn.area_id AS block_area_id,
    tbn.created_by AS block_created_by,
    tbn.updated_by AS block_updated_by,
    tbn.created_at AS block_created_at,
    tbn.updated_at AS block_updated_at,
    tbn.active AS block_active,
    
    tspec.id AS species_id,
    tspec.name AS species_name,
    tspec.created_by AS species_created_by,
    tspec.updated_by AS species_updated_by,
    tspec.created_at AS species_created_at,
    tspec.updated_at AS species_updated_at,
    tspec.active AS species_active,
    
    tstate.id AS state_id,
    tstate.name AS state_name,
    tstate.updated_by AS state_updated_by,
    tstate.created_by AS state_created_by,
    tstate.updated_at AS state_updated_at,
    tstate.created_at AS state_created_at,
    tstate.active AS state_active,
    
    tanimal.id AS animal_status_id,
    tanimal.name AS animal_status_name,
    tanimal.created_by AS animal_status_created_by,
    tanimal.updated_by AS animal_status_updated_by,
    tanimal.created_at AS animal_status_created_at,
    tanimal.updated_at AS animal_status_updated_at,
    tanimal.active AS animal_status_active,
    
    ttype.id AS rescue_type_id,
    ttype.name AS rescue_type_name,
    ttype.created_by AS rescue_type_created_by,
    ttype.updated_by AS rescue_type_updated_by,
    ttype.created_at AS rescue_type_created_at,
    ttype.updated_at AS rescue_type_updated_at,
    ttype.active AS rescue_type_active,
    
    tcity.id AS city_id,
    tcity.name AS city_name,
    tcity.state_id AS city_state_id,
    tcity.updated_by AS city_updated_by,
    tcity.created_by AS city_created_by,
    tcity.updated_at AS city_updated_at,
    tcity.created_at AS city_created_at,
    tcity.active AS city_active,
    
    tarea.id AS area_id,
    tarea.name AS area_name,
    tarea.city_id AS area_city_id,
    tarea.updated_by AS area_updated_by,
    tarea.created_by AS area_created_by,
    tarea.updated_at AS area_updated_at,
    tarea.created_at AS area_created_at,
    tarea.active AS area_active,
    
    tbreed.id AS breed_id,
    tbreed.name AS breed_name,
    tbreed.species_id AS breed_species_id,
    tbreed.created_by AS breed_created_by,
    tbreed.updated_by AS breed_updated_by,
    tbreed.created_at AS breed_created_at,
    tbreed.updated_at AS breed_updated_at,
    tbreed.active AS breed_active,

    ta.name as tolfa_area_name
    
  FROM
    tolfa_admission_status tas
    LEFT JOIN tolfa_rescue_animal_status rs ON tas.id = rs.rescue_id AND rs.is_latest = 1
    
    LEFT JOIN tolfa_rescue_x_care_people rxc ON rs.rescue_id = rxc.rescue_id
    LEFT JOIN tolfa_care_people tcp ON rxc.care_people_id = tcp.id 
    
    LEFT JOIN tolfa_user tu ON rs.created_by = tu.id
    LEFT JOIN rescued_by_tolfa_x_team rbtx ON rs.rescue_id = rbtx.rescue_id 
    LEFT JOIN tolfa_user tu_rbtx ON rbtx.name_id = tu_rbtx.id
    
    LEFT JOIN tolfa_rescue_location trl ON rs.rescue_id = trl.rescue_id AND trl.is_latest = 1
    LEFT JOIN tolfa_species tspec ON tas.species_id = tspec.id
    LEFT JOIN tolfa_state tstate ON tas.state_id = tstate.id
    LEFT JOIN tolfa_animal_status tanimal ON rs.status_id = tanimal.id
    LEFT JOIN tolfa_rescue_type ttype ON tas.type_of_rescue_id = ttype.id
    LEFT JOIN tolfa_city tcity ON tas.city_id = tcity.id
    LEFT JOIN tolfa_city_area tarea ON tas.area_id = tarea.id
    LEFT JOIN tolfa_animal_breed tbreed ON tas.breed_id = tbreed.id
    LEFT JOIN tolfa_block_number tbn ON trl.tolfa_block_id = tbn.id
    LEFT JOIN tolfa_area ta ON trl.tolfa_area_id = ta.id
  GROUP BY tas.id
`;

  // Rest of the code...

  pool.query(statement, (err, result, fields) => {
    try {
      if (err) {
        res.status(500).json({
          status: 500,
          message: err,
          success: false,
        });
        return;
      } else if (result) {
        res.status(200).json({
          message: "Animal status data",
          status: 200,
          success: true,
          data: result,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Ops something went wrong",
        status: 500,
        success: false,
      });
    }
  });
};

exports.historyLogsTolfaLocation = async (req, res) => {
  try {
    const { rescue_id } = req.params;

    const statement = `SELECT 
    trl.*, 
    ta.name AS area_name,
    tbn.name AS block_name
    FROM tolfa_rescue_location trl
    LEFT JOIN tolfa_area ta ON trl.tolfa_area_id = ta.id
    LEFT JOIN tolfa_block_number tbn ON trl.tolfa_block_id = tbn.id
    WHERE trl.rescue_id = ${rescue_id}
    ORDER BY trl.updated_at DESC;`;

    pool.query(statement, (err, result, fields) => {
      try {
        if (err) {
          res.status(500).json({
            status: 500,
            message: err,
            success: false,
          });
          return;
        } else if (result) {
          res.status(200).json({
            message: "data fetch successfully",
            status: 200,
            success: true,
            data: result,
          });
        }
      } catch (error) {
        res.status(500).json({
          message: "Ops something went wrong",
          status: 500,
          success: false,
        });
      }
    });
  } catch (error) {
    console.log("err", error);
    res.status(500).json({
      message: "Ops something went wrong",
      status: 500,
      success: false,
    });
  }
};

exports.updateRescueLocation = async (req, res) => {
  pool.getConnection(async function (err, connection) {
    if (err) throw err; // not connected!

    try {
      const {
        rescue_id,
        tolfa_area_id,
        tolfa_block_id,
        created_by,
        // Add other columns here
      } = req.body;

      /**
       * @startTransaction
       */
      connection.beginTransaction();

      // trans
      const updateResponse = await updateTolfaLocationLastestKey(connection, {
        rescue_id,
      });

      const insertUpdateTolfaLocationResponse = insertUpdateTolfaLocation(
        connection,
        { tolfa_area_id, tolfa_block_id, rescue_id, created_by }
      );
      connection.commit();

      res.status(201).json({
        message: "Tolfa location updated successfully",
        success: true,
      });
    } catch (error) {
      console.error(error);
      connection.rollback();
      res.status(500).json({
        message: "Oops! Something went wrong",
        success: false,
      });
    }
  });
};

const updateTolfaLocationLastestKey = async (connection, data) => {
  const { rescue_id } = data;
  try {
    const updateStatement = `UPDATE tolfa_rescue_location SET is_latest = 0 WHERE rescue_id = ${rescue_id}`;

    return new Promise((resolve, reject) => {
      connection.query(updateStatement, (err, data) => {
        if (err) {
          console.log("rollback");
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

const insertUpdateTolfaLocation = async (connection, data) => {
  try {
    const { tolfa_area_id, tolfa_block_id, rescue_id, created_by } = data;
    const tolfaLocationDetailStatement = `INSERT INTO tolfa_rescue_location (rescue_id, tolfa_area_id, tolfa_block_id, created_at, updated_at, created_by, updated_by, is_latest)
    VALUES (
      ${rescue_id}, 
      ${tolfa_area_id}, 
      ${tolfa_block_id},  
      '${moment().format("YYYY-MM-DD HH:mm:ss")}',  
      '${moment().format("YYYY-MM-DD HH:mm:ss")}', 
      ${created_by}, 
      ${created_by}, 
      1
      );`;

    return new Promise((resolve, reject) => {
      connection.query(tolfaLocationDetailStatement, (err, data) => {
        if (err) {
          console.log("rollback");
          reject(err);
        } else {
          console.log("data", data.insertId);
          resolve(data.insertId);
        }
      });
    });
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

exports.create = async (req, res) => {
  pool.getConnection(async function (err, connection) {
    if (err) throw err; // not connected!

    try {
      /**
       * @startTransaction
       */
      connection.beginTransaction();

      const { body } = req;

      const {
        type_of_rescue_id,
        species_id,
        status_id,
        state_id,
        city_id,
        area_id,
        rescue_address,
        rescue_by_tolfa,
        animal_name,
        sex,
        age,
        main_color_id,
        second_color_id,
        thirdcolor_id,
        id_features,
        breed_id,
        // animal_image,
        file_name,
        created_at,
        active,
        created_by,
      } = body;

      /**
       * @step1
       * @logic - 1st step shold give rescue_id in return
       * @MainTable
       */

      const rescue_id = await insertAdmissionDetail(connection, {
        type_of_rescue_id,
        species_id,
        state_id,
        city_id,
        area_id,
        rescue_address,
        rescue_by_tolfa,
        animal_name,
        sex,
        age,
        main_color_id,
        second_color_id,
        thirdcolor_id,
        id_features,
        breed_id,
        file_name,
        created_at,
        active,
        created_by,
      });

      /**
       * @mapping_tolfa_x_care_people
       */

      /**
       * @if_rescue_by_tolfa
       * @else_care_people
       */

      if (JSON.parse(rescue_by_tolfa)) {
        console.log("body.tolfa_team", body.tolfa_team.split(","));
        const nameIds = body.tolfa_team.split(",");
        console.log("split(',')", nameIds);
        const values = nameIds
          .map((nameId) => `(${rescue_id}, ${nameId})`)
          .join(", ");

        await mapTolfaTeam(connection, { values });
      } else {
        const care_people_id = body.care_people_id;
        await mapCarePeople(connection, { rescue_id, care_people_id });
      }

      /**
       * @tolfa_location_table
       */
      const { tolfa_area_id, tolfa_block_id } = body.tolfa_location;
      await tolfaLocationTable(connection, {
        tolfa_area_id,
        tolfa_block_id,
        rescue_id,
        created_by,
      });

      const {
        abc_status,
        tattoo_number,
        condition_value,
        body_score,
        caregiver_name,
        caregiver_number,
        problem,
        problem_type,
        symptoms,
        injury_location,
        alt_problem,
        alt_problem_type,
        alt_symptoms,
        alt_injury_location,
        cause_of_problem,
        rassi_no,
      } = body.rescue_animal_status;

      await tolfaRescueAnimalStatus(connection, {
        status_id,
        rescue_id,
        abc_status,
        tattoo_number,
        condition_value,
        body_score,
        caregiver_name,
        caregiver_number,
        problem,
        problem_type,
        symptoms,
        injury_location,
        alt_problem,
        alt_problem_type,
        alt_symptoms,
        alt_injury_location,
        cause_of_problem,
        rassi_no,
        created_by,
      });

      /**
       * @last call below
       */

      connection.commit();

      res.status(201).json({
        message: "Admission status created successfully",
        success: true,
      });
    } catch (error) {
      console.error(error);
      connection.rollback();
      res.status(500).json({
        message: "Oops! Something went wrong",
        success: false,
      });
    }
  });
};

/**
 * @trans_0
 */

const insertAdmissionDetail = async (connection, data) => {
  try {
    const {
      type_of_rescue_id,
      species_id,
      state_id,
      city_id,
      area_id,
      rescue_address,
      rescue_by_tolfa,
      animal_name,
      sex,
      age,
      main_color_id,
      second_color_id,
      thirdcolor_id,
      id_features,
      breed_id,
      file_name,
      active,
      created_by,
    } = data;

    const tolfaAdmissionStatusStatement = `INSERT INTO tolfa_admission_status (
    type_of_rescue_id,
    species_id,
    state_id,
    city_id,
    area_id,
    rescue_address,
    rescue_by_tolfa,
    animal_name,
    sex,
    age,
    main_color_id,
    second_color_id,
    thirdcolor_id,
    id_features,
    breed_id,
    animal_image,
    created_at,
    active,
    created_by
) VALUES (
    ${type_of_rescue_id},
    ${species_id},
    ${state_id},
    ${city_id},
    ${area_id},
    '${rescue_address}',
    ${rescue_by_tolfa},
    '${animal_name}',
    ${sex},
    ${age},
    ${main_color_id},
    ${second_color_id},
    ${thirdcolor_id},
    '${id_features}',
    ${breed_id},
    '${file_name}',
    '${moment().format("YYYY-MM-DD HH:mm:ss")}',
    ${active},
    ${created_by}
)`;
    return new Promise((resolve, reject) => {
      connection.query(tolfaAdmissionStatusStatement, (err, data) => {
        if (err) {
          console.log("rollback");
          reject(err);
        } else {
          console.log("data", data.insertId);
          resolve(data.insertId);
        }
      });
    });
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

/**
 * @trans_1_of_2
 */
const mapTolfaTeam = async (connection, data) => {
  try {
    const { values } = data;
    const mapTolfaTeamStatement = `INSERT INTO rescued_by_tolfa_x_team (rescue_id, name_id)
    VALUES ${values}`;
    return new Promise((resolve, reject) => {
      connection.query(mapTolfaTeamStatement, (err, data) => {
        if (err) {
          console.log("rollback");
          reject(err);
        } else {
          resolve(data.insertId);
        }
      });
    });
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

/**
 * @trans_2_of_2
 */
const mapCarePeople = async (connection, data) => {
  try {
    const { rescue_id, care_people_id } = data;
    const mapCarePeopleStatement = `INSERT INTO tolfa_rescue_x_care_people (rescue_id, care_people_id)
    VALUES (
      ${rescue_id},
      ${care_people_id}
      )`;

    return new Promise((resolve, reject) => {
      connection.query(mapCarePeopleStatement, (err, data) => {
        if (err) {
          console.log("rollback");
          reject(err);
        } else {
          resolve(data.insertId);
        }
      });
    });
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

/**
 * @trans_3
 */
const tolfaLocationTable = async (connection, data) => {
  try {
    const { tolfa_area_id, tolfa_block_id, rescue_id, created_by } = data;
    const tolfaLocationDetailStatement = `INSERT INTO tolfa_rescue_location (rescue_id, tolfa_area_id, tolfa_block_id, created_at, updated_at, created_by, updated_by, is_latest)
    VALUES (
      ${rescue_id}, 
      ${tolfa_area_id}, 
      ${tolfa_block_id},  
      '${moment().format("YYYY-MM-DD HH:mm:ss")}',  
      '${moment().format("YYYY-MM-DD HH:mm:ss")}', 
      ${created_by}, 
      ${created_by}, 
      1
      );`;

    return new Promise((resolve, reject) => {
      connection.query(tolfaLocationDetailStatement, (err, data) => {
        if (err) {
          console.log("rollback");
          reject(err);
        } else {
          console.log("data", data.insertId);
          resolve(data.insertId);
        }
      });
    });
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

/**
 * @trans_4
 */
const tolfaRescueAnimalStatus = async (connection, data) => {
  try {
    const {
      status_id,
      rescue_id,
      abc_status,
      tattoo_number,
      condition_value,
      body_score,
      caregiver_name,
      caregiver_number,
      problem,
      problem_type,
      symptoms,
      injury_location,
      alt_problem,
      alt_problem_type,
      alt_symptoms,
      alt_injury_location,
      cause_of_problem,
      rassi_no,
      created_by,
    } = data;

    const tolfaAnimalStatusStatement = `INSERT INTO tolfa_rescue_animal_status (
      rescue_id,
      status_id,
      abc_status,
      tattoo_number,
      condition_value,
      body_score,
      caregiver_name,
      caregiver_number,
      problem,
      problem_type,
      symptoms,
      injury_location,
      alt_problem,
      alt_problem_type,
      alt_symptoms,
      alt_injury_location,
      cause_of_problem,
      rassi_no,
      created_at,
      updated_at,
      created_by,
      updated_by,
      is_latest
    ) VALUES (
      ${rescue_id},
      ${status_id},
      '${abc_status}',
      '${tattoo_number}',
      '${condition_value}',
      '${body_score}',
      '${caregiver_name}',
      ${caregiver_number},
      '${problem}',
      ${JSON.stringify(problem_type)},
      ${symptoms ? `${JSON.stringify(symptoms)}` : null},
      ${
        injury_location && injury_location !== "undefined"
          ? `'${JSON.stringify(injury_location)}'`
          : null
      },
      '${alt_problem}',
      '${JSON.stringify(alt_problem_type)}',
      ${
        alt_symptoms && alt_symptoms !== "undefined"
          ? `${JSON.stringify(alt_symptoms)}`
          : null
      },
      ${
        alt_injury_location && alt_injury_location !== "undefined"
          ? `${JSON.stringify(alt_injury_location)}`
          : null
      },
      '${cause_of_problem}',
      '${rassi_no}',
      '${moment().format("YYYY-MM-DD HH:mm:ss")}',  
      '${moment().format("YYYY-MM-DD HH:mm:ss")}', 
      ${created_by},
      ${created_by},
      1
    );`;

    console.log(tolfaAnimalStatusStatement);

    return new Promise((resolve, reject) => {
      connection.query(tolfaAnimalStatusStatement, (err, data) => {
        if (err) {
          console.log("rollback");
          reject(err);
        } else {
          console.log("data", data.insertId);
          resolve(data.insertId);
        }
      });
    });
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

exports.update = async (req, res) => {
  try {
    let { body } = req;
    let { name, id, updated_by } = body;

    const statement = `UPDATE ${TABLE_NAME} set 
    name = '${name}', 
    updated_by = ${updated_by},
    updated_at = '${moment().format("YYYY-MM-DD HH:mm:ss")}' where id = ${id}`;

    pool.query(statement, (err, result, fileds) => {
      if (err) {
        res.status(500).json({
          status: 500,
          message: err,
          success: false,
        });
        return;
      } else if (result) {
        res.status(200).json({
          status: 200,
          message: "Status updated successfuly",
          success: true,
          data: result[0],
        });
      }
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "Ops something went wrong",
      status: 500,
      success: false,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    let { body } = req;
    let { id } = body;

    const statement = `UPDATE ${TABLE_NAME} set active = ${false} where id = ${id}`;

    pool.query(statement, (err, result, fileds) => {
      if (err) {
        res.status(500).json({
          status: 500,
          message: err,
          success: false,
        });
        return;
      } else if (result) {
        res.status(200).json({
          status: 200,
          message: "Rescue type deleted successfuly",
          success: true,
          data: result[0],
        });
      }
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "Ops something went wrong",
      status: 500,
      success: false,
    });
  }
};

// {
//   "type_of_rescue_id": 1,
//   "species_id": 2,
//   "status_id": 3,
//   "state_id": 4,
//   "city_id": 5,
//   "area_id": 6,
//   "rescue_address": "123 Main Street",
//   "rescue_by_tolfa": 1,
//   "animal_name": "Fido",
//   "sex": 1,
//   "age": 2,
//   "main_color_id": 7,
//   "second_color_id": 8,
//   "thirdcolor_id": 9,
//   "id_features": "Black nose, floppy ears",
//   "breed_id": 10,
//   "animal_image": "https://example.com/image.jpg",
//   "created_at": "2023-10-14 15:30:00",
//   "active": 1,
//   "created_by": 11,
//   "tolfa_team": [
//       1,
//       12,
//       4
//   ]
// }
