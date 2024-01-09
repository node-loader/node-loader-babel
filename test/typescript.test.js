import assert from "assert";

describe(`@babel/preset-typescript usage`, () => {
  it(`can transform .ts files`, async () => {
    const basicModule = await import("./fixtures/typescript/main.ts");
    assert.deepEqual(basicModule.default, "typescript is working!");
  });

  it(`can transform .tsx files`, async () => {
    const componentModule = await import("./fixtures/typescript/component.tsx");
    assert.deepEqual(componentModule.default.type, "div");
    assert.deepEqual(componentModule.default.props, {});
  });
});
