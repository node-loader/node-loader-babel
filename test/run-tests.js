import Mocha from "mocha";

const mocha = new Mocha();

mocha.addFile("./test/basic.test.js");
mocha.addFile("./test/commonjs.test.js");

mocha.loadFilesAsync().then(() => {
  mocha.run();
});
