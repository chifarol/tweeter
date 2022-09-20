module.exports = {
  //   module: {
  //     rules: [
  //       {
  //         test: /\.scss$/,
  //         use: [
  //           { loader: "style-loader" },
  //           // [css-loader](/loaders/css-loader)
  //           {
  //             loader: "css-loader",
  //             options: {
  //               modules: true,
  //             },
  //           },
  //           // [sass-loader](/loaders/sass-loader)
  //           { loader: "sass-loader" },
  //         ],
  //       },
  //     ],
  //   },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
        },
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
