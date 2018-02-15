module.exports = {
  presets: [[
    require( 'babel-preset-env' ), { targets: { node: "8" } }
  ]],
  plugins: [
    [ require( 'babel-plugin-namespaces' ).default, require( './tools/util/loadNamespaces' )() ]
  ],
};
