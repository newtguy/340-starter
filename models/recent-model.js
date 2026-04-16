const pool = require("../database/")

/* ***************************
 *  Add or update recent view
 * ************************** */
async function addRecentView(account_id, inv_id) {
  try {
    const sql = `
      INSERT INTO recent_view (account_id, inv_id, viewed_at)
      VALUES ($1, $2, CURRENT_TIMESTAMP)
      ON CONFLICT (account_id, inv_id)
      DO UPDATE SET viewed_at = CURRENT_TIMESTAMP
    `
    await pool.query(sql, [account_id, inv_id])
  } catch (error) {
    console.error("addRecentView error:", error)
  }
}

/* ***************************
 *  Get recent vehicles by account_id
 * ************************** */
async function getRecentByAccountId(account_id) {
  try {
    const sql = `
      SELECT inv.*, rv.viewed_at
      FROM recent_view rv
      JOIN inventory inv ON rv.inv_id = inv.inv_id
      WHERE rv.account_id = $1
      ORDER BY rv.viewed_at DESC
      LIMIT 5
    `
    const data = await pool.query(sql, [account_id])
    return data.rows
  } catch (error) {
    console.error("getRecentByAccountId error:", error)
    return []
  }
}

module.exports = {
  addRecentView,
  getRecentByAccountId,
}
