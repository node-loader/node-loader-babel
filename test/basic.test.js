import assert from "assert";

describe(`basic babel usage`, () => {
  it(`can transform jsx and run it in node`, async () => {
    const basicModule = await import("./fixtures/basic/basic.js");
    assert.deepEqual(basicModule.default, {
      type: "button",
      props: null,
      children: undefined,
    });
  });

  it(`supports ES module babel config files`, async () => {
    const mjsConfig = await import("./fixtures/mjs-config/main.js");
    assert.deepEqual(mjsConfig.default, {
      type: "div",
      props: null,
      children: undefined,
    });
  });
});
