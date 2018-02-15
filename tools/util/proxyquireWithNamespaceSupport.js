const expandNamespace = require( './expandNamespace' );
const proxyquire      = require( 'proxyquire' ).noCallThru();
const path            = require( 'path' );
const fs              = require( 'fs' );

function cleverProxyquire( modulePath, stubs, ...args ){

  const expandedPath = expandNamespace( modulePath, __dirname );
  const moduleDir = getModuleDirPath( expandedPath );

  const expandedStubs = Object
    .keys( stubs )
    .reduce( ( expandedStubs, stubPath )=>{

      let expandedStubPath = expandNamespace( stubPath, moduleDir );
      expandedStubPath = expandedStubPath === stubPath // eslint-disable-line padding-line-between-statements
        ? expandedStubPath
        : `./${ expandedStubPath }`;

      return Object.assign( expandedStubs, { [ expandedStubPath ]: stubs[ stubPath ] } );

    }, {} );

  return proxyquire( expandedPath, expandedStubs, ...args );

}


module.exports = cleverProxyquire;

function getModuleDirPath( expandedPath ){

  const moduleFullPath = path.resolve(
    __dirname,
    expandedPath
  );

  try {

    return fs.statSync( moduleFullPath ).isDirectory() // eslint-disable-line no-sync
      ? moduleFullPath
      : path.dirname( moduleFullPath );

  } catch( _ ){

    // assuming a module name without file extension
    return path.dirname( moduleFullPath );

  }

}
