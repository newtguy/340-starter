const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get vehicle data by inv_id
 * ************************** */
async function getVehicleById(inv_id) {
    try {
        const sql = 'SELECT * FROM inventory WHERE inv_id = $1';
        const result = await pool.query(sql, [inv_id]);
        return result.rows[0];
    } catch (error) {
        throw new Error('Error fetching vehicle: ' + error.message);
    }
}

/* ***************************
 *  Add classification into database 
    (inserted into classification)
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = `
      INSERT INTO classification (classification_name)
      VALUES ($1)
      RETURNING *`
    return await pool.query(sql, [classification_name])
  } catch (error) {
    console.error("addClassification error:", error)
  }
}


/* ***************************
 *  Add vehicle data into database 
 *  (inserted into inventory)
 * ************************** */
/* ***************************
 *  Add vehicle data into inventory table
 * ************************** */
async function addInventory(vehicle) {
  const sql = `
    INSERT INTO inventory
      (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail,
       inv_price, inv_miles, inv_color, classification_id)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *;
  `
  const values = [
    vehicle.inv_make,
    vehicle.inv_model,
    vehicle.inv_year,
    vehicle.inv_description,
    vehicle.inv_image,
    vehicle.inv_thumbnail,
    vehicle.inv_price,
    vehicle.inv_miles,
    vehicle.inv_color,
    vehicle.classification_id,
  ]

  try {
    const result = await pool.query(sql, values)
    return result.rows[0]
  } catch (err) {
    console.error("addInventory error:", err)
    return null
  }
}


module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById, addClassification, addInventory};