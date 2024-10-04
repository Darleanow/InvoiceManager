const { MySqlContainer } = require("@testcontainers/mysql");

it("should execute a query and return the result", async () => {
  const container = await new MySqlContainer().start();

  const queryResult = await container.executeQuery("SELECT 1 as res");
  expect(queryResult).toEqual(expect.stringContaining("res\n1\n"));

  await container.stop();
}, 60000);
