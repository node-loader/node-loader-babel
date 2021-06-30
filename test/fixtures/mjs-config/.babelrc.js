export default {
  plugins: [
    [
      "@babel/plugin-transform-react-jsx",
      {
        runtime: "classic",
        pragma: "h",
      },
    ],
  ],
};
