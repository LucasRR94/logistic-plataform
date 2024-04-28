import RepositoryDisplacement from "@/pages/api/Repositorys/RepositoryDisplacement";
import { ERROR_ACCESSING_DB } from "../../../../pages/constants";

describe("RepositoryDisplacement", () => {
  const mocksCorrectlyTheDbInstance = (mock) => ({
    query: mock,
  });

  it("__accessDb can correctly call the instace of db", async () => {
    const answer = ["one", "two", "three"];
    const mockInstance = jest.fn(() => {
      return new Promise((res) => {
        res({ rows: answer });
      });
    });
    const instaceDb = mocksCorrectlyTheDbInstance(mockInstance);
    const repository = new RepositoryDisplacement(instaceDb);
    const query = "test";
    const values = "test values";
    const myTest = "This op is a test";
    const result = await repository.__accessDb(query, values, myTest);
    expect(result).toStrictEqual(answer);
    expect(mockInstance).toHaveBeenCalled();
    expect(mockInstance).toHaveBeenCalledWith(query, values);
  });

  it("__accessDb can correctly throw the error refering the op", async () => {
    const errMessage = "Error in querying";
    const mockInstance = jest.fn(() => {
      return new Promise((res, rej) => {
        rej(errMessage);
      });
    });
    const instaceDb = mocksCorrectlyTheDbInstance(mockInstance);
    const repository = new RepositoryDisplacement(instaceDb);
    const query = "test";
    const values = "test values";
    const op = "Error in operation";
    expect(repository.__accessDb(query, values, op)).rejects.toThrow(
      new Error(`${ERROR_ACCESSING_DB} /n ${op} /n ${errMessage}`)
    );
  });

  it("getAllDisplacementsOfAServiceOrder correctly return rows", async () => {
    const rows = { test: "test" };
    const mockInstance = jest.fn(() => {
      return new Promise((res) => {
        res({ rows });
      });
    });
    const serviceOrder = "111";
    const query = "SELECT * FROM DISPLACEMENT WHERE main_service=$1";
    const instaceDb = mocksCorrectlyTheDbInstance(mockInstance);
    const repository = new RepositoryDisplacement(instaceDb);
    const result = await repository.getAllDisplacementsOfAServiceOrder(
      serviceOrder
    );
    expect(result).toStrictEqual(rows);
    expect(mockInstance).toHaveBeenCalled();
    expect(mockInstance).toHaveBeenCalledWith(query, [BigInt(serviceOrder)]);
  });

  it("getAllDisplacementsOfAServiceOrder correctly throws error", async () => {
    const error = "error query service order";
    const mockInstance = jest.fn(() => {
      return new Promise((res, rej) => {
        rej(error);
      });
    });
    const serviceOrder = "111";
    const op = "query all displacements using a service order";
    const instaceDb = mocksCorrectlyTheDbInstance(mockInstance);
    const repository = new RepositoryDisplacement(instaceDb);
    expect(
      repository.getAllDisplacementsOfAServiceOrder(serviceOrder)
    ).rejects.toThrow(new Error(`${ERROR_ACCESSING_DB} /n ${op} /n ${error}`));
  });

  it("getADiplacementeByPickupDate correctly return rows", async () => {
    const rows = { test: "test" };
    const mockInstance = jest.fn(() => {
      return new Promise((res) => {
        res({ rows });
      });
    });
    const pickupDate = "1714254840791";
    const query =
      "SELECT * FROM DISPLACEMENT WHERE displacement_pick_up_date=$1";
    const instaceDb = mocksCorrectlyTheDbInstance(mockInstance);
    const repository = new RepositoryDisplacement(instaceDb);
    const result = await repository.getADiplacementeByPickupDate(pickupDate);
    expect(result).toStrictEqual(rows);
    expect(mockInstance).toHaveBeenCalled();
    expect(mockInstance).toHaveBeenCalledWith(query, [
      new Date(parseInt(pickupDate)),
    ]);
  });

  it("getADiplacementeByPickupDate correctly throws error", async () => {
    const error = "error query vehicle ref";
    const mockInstance = jest.fn(() => {
      return new Promise((res, rej) => {
        rej(error);
      });
    });
    const pickupDate = "1714254840791";
    const op = "query many displacements using a pickup date";
    const instaceDb = mocksCorrectlyTheDbInstance(mockInstance);
    const repository = new RepositoryDisplacement(instaceDb);
    expect(repository.getADiplacementeByPickupDate(pickupDate)).rejects.toThrow(
      new Error(`${ERROR_ACCESSING_DB} /n ${op} /n ${error}`)
    );
  });

  it("getADisplacementByDeliveryDate correctly return rows", async () => {
    const rows = { test: "test" };
    const mockInstance = jest.fn(() => {
      return new Promise((res) => {
        res({ rows });
      });
    });
    const pickupDate = "1714254840791";
    const query =
      "SELECT * FROM DISPLACEMENT WHERE displacement_delivery_date=$1";
    const instaceDb = mocksCorrectlyTheDbInstance(mockInstance);
    const repository = new RepositoryDisplacement(instaceDb);
    const result = await repository.getADisplacementByDeliveryDate(pickupDate);
    expect(result).toStrictEqual(rows);
    expect(mockInstance).toHaveBeenCalled();
    expect(mockInstance).toHaveBeenCalledWith(query, [
      new Date(parseInt(pickupDate)),
    ]);
  });

  it("getADisplacementByDeliveryDate correctly throws error", async () => {
    const error = "error query vehicle ref";
    const mockInstance = jest.fn(() => {
      return new Promise((res, rej) => {
        rej(error);
      });
    });
    const pickupDate = "1714254840791";
    const op = "query many displacements using a delivery date";
    const instaceDb = mocksCorrectlyTheDbInstance(mockInstance);
    const repository = new RepositoryDisplacement(instaceDb);
    expect(
      repository.getADisplacementByDeliveryDate(pickupDate)
    ).rejects.toThrow(new Error(`${ERROR_ACCESSING_DB} /n ${op} /n ${error}`));
  });
});
