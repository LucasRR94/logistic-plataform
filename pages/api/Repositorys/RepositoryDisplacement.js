import { ERROR_ACCESSING_DB } from "constants";
import { validateBitInt, validateDate } from "../utils/sanitize";

class RepositoryDisplacement {
  constructor(databaseInstance) {
    this._instanceOfDatabase = databaseInstance;
  }

  // function that effective execute the query
  // its execute the access to the database executing querys in db using third party package
  async __accessDb(query, values, specificOperation) {
    try {
      const result = await this._instanceOfDatabase.query(query, values);
      return result.rows;
    } catch (err) {
      throw new Error(
        `${ERROR_ACCESSING_DB} /n ${specificOperation} /n ${err}`
      );
    }
  }

  // getADisplacementsOfAServiceOrder
  // it requires the id of the displacement
  async getAllDisplacementsOfAServiceOrder(serviceOrderId) {
    const query = "SELECT * FROM DISPLACEMENT WHERE main_service=$1";
    try {
      const orderId = await validateBitInt(serviceOrderId);
      const values = [orderId];
      const op = "query all displacements using a service order";
      const answer = await this.__accessDb(query, values, op);
      return answer;
    } catch (err) {
      throw err;
    }
  }

  // getAllDisplacementsOf
  // it requires the vehicle Ref
  async getAllDisplacementByVehicleRef(vehicleRef) {
    const query = "SELECT * FROM DISPLACEMENT WHERE vehicle_ref=$1";
    try {
      const vehicleRefSanitize = await validateBitInt(vehicleRef);
      const values = [vehicleRefSanitize];
      const op = "query all displacements using a vehicle order";
      return this.__accessDb(query, values, op);
    } catch (err) {
      throw err;
    }
  }

  // getADisplacementById
  // it requires the id of displacement
  async getADisplacementById(displacementId) {
    const query = "SELECT * FROM DISPLACEMENT WHERE id=$1";
    try {
      const sanitizeDisplacementId = await validateBitInt(displacementId);
      const values = [sanitizeDisplacementId];
      const op =
        "query a displacement using the identification of displacement";
      return this.__accessDb(query, values, op);
    } catch (err) {
      throw err;
    }
  }

  // getADiplacementeByPickupDate
  // it requires a pick up date of displacement
  async getADiplacementeByPickupDate(pickupDate) {
    const query =
      "SELECT * FROM DISPLACEMENT WHERE displacement_pick_up_date=$1";
    try {
      const sanitizeDate = await validateDate(pickupDate);
      const values = [sanitizeDate];
      const op = "query many displacements using a pickup date";
      return this.__accessDb(query, values, op);
    } catch (err) {
      throw err;
    }
  }
  // getADiplacementeByPickupDate
  // it requires a pick up date of displacement
  async getADisplacementByDeliveryDate(deliveryDate) {
    const query =
      "SELECT * FROM DISPLACEMENT WHERE displacement_delivery_date=$1";
    try {
      const sanitizeDeliveryDate = await validateDate(deliveryDate);
      const values = [sanitizeDeliveryDate];
      const op = "query many displacements using a delivery date";
      return this.__accessDb(query, values, op);
    } catch (err) {
      throw err;
    }
  }
}

export default RepositoryDisplacement;
