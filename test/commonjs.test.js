import assert from "assert";

describe("babel compilation of commonjs files", () => {
  it(`can transform commonjs modules`, async () => {
    const commonJSModule = await import("./fixtures/commonjs/main.cjs");

    assert.deepEqual(commonJSModule.default, {
      red: "#ff0000",
      blue: "#0000ff",
    });

    assert.deepEqual(commonJSModule.red, "#ff0000");
    assert.deepEqual(commonJSModule.blue, "#0000ff");
  });
});
