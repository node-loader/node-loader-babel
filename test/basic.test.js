import assert from "assert";

describe(`basic babel usage`, () => {
  it(`can transform jsx and run it in node`, async () => {
    const basicModule = await import("./fixtures/basic.js");
    assert.deepEqual(basicModule.default, {
      type: "button",
      props: null,
      children: undefined,
    });
  });
});
