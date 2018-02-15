const glob
  = require( 'glob' ).sync;

const path
  = require( 'path' );

const staticNamespaces
  = require( '../../.static-namespaces.json' );

const libNamespaces = glob( 'lib/services/*/[^.]*/', { cwd: path.resolve( __dirname, '../..' ) } )
  .reduce( ( acc, namespacePath )=>Object.assign( acc, entryFor( namespacePath )  ), {} );

module.exports = ()=>{

  const namespaces = Object.assign(
    {},
    staticNamespaces,
    libNamespaces
  );

  return { namespaces };

};

/* internal functions */

function entryFor( namespacePath ){

  const namespaceKey
    = `${ path.basename( path.dirname( namespacePath ) ) }_${ path.basename( namespacePath ) }`;

  return { [ namespaceKey ]: `./${ namespacePath }` };

}
