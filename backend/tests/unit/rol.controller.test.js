import { jest } from "@jest/globals";

const listarRolesMock = jest.fn();

jest.unstable_mockModule("../../src/services/rol.service.js", () => ({
  listarRoles: listarRolesMock,
}));

let listarRolesController;

beforeAll(async () => {
  ({ listarRolesController } =
    await import("../../src/controllers/rol.controller.js"));
});

describe("rol.controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("lista roles y responde 200", async () => {
    listarRolesMock.mockResolvedValue([{ id_rol: 1 }]);
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await listarRolesController({}, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});
