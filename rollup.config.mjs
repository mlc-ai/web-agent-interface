import { nodeResolve } from "@rollup/plugin-node-resolve";
import ignore from "rollup-plugin-ignore";
import commonjs from "@rollup/plugin-commonjs";
import image from "@rollup/plugin-image";
import sass from "rollup-plugin-sass";

export default {
  input: "src/index.js",
  output: [
    {
      file: "lib/index.js",
      exports: "named",
      format: "cjs",
      sourcemap: true,
    },
  ],
  plugins: [
    ignore(["fs", "path", "crypto"]),
    nodeResolve({ browser: true }),
    commonjs({
      ignoreDynamicRequires: true,
    }),
    image(),
    sass(),
  ],
};
