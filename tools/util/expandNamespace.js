const path = require( 'path' );
const assert = require( 'assert' );
const loadNamespaces = require( './loadNamespaces' );

function expandNameSpace( modulePath, callerPath ){

  const match = /<([^>]+)>/.exec( modulePath );
  if( !( match && match[1] ) ) return modulePath;

  const namespaceKey
    = match[1];

  const { namespaces }
    = loadNamespaces();

  const namespacePath
    = namespaces[ namespaceKey ];

  assert(
    namespacePath != null,
    `namespace <${ namespaceKey }> is not defined.`
  );

  const fullModulePath
    = path.join( process.cwd(), namespacePath, modulePath.substr( match[0].length + 1 ) );

  const relativePath
    = path.relative( callerPath, fullModulePath );

  return relativePath.startsWith( '.' )
    ? relativePath
    : `./${ relativePath }`;

}

module.exports = expandNameSpace;
