const sinonChai = require( 'sinon-chai' );
const chai      = require( 'chai' )
chai.use( sinonChai );

global.expect
  = chai.expect;

global.sinon
  = require( 'sinon' );

global.proxyquire
  = require( '../../tools/util/proxyquireWithNamespaceSupport' );

global.mockfs
  = require( 'mock-fs' );
