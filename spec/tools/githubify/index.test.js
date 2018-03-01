import path from 'path'; 
import fs from 'fs-extra'; 
import githubify from '<tools>/githubify';

describe( 'The <tools>/githubify function', ()=>{

  const someDir         = 'someDir';
  const someFile        = 'someFile.md';
  const src             = 'mockSrcDir';
  const dist            = 'mockDistDir';
  const expectedOutPath = path.join( dist, someDir, someFile );
    
  it( 'should copy src files to the destination folder', done=>{

    const expected     =  '# Some Markdown Text';
    const mockfsConfig = {
      [ src ]:  { [ someDir ]: { [ someFile ]: expected } },
      [ dist ]: { [ someDir ]: { } }
    };
    
    mockfs( mockfsConfig );

    githubify( src, dist, ( err, results )=>{

      try {
        
        expect( err )
          .to.not.exist;

        expect( results )
          .to.include( expectedOutPath );

        const actual = fs.readFileSync( expectedOutPath, 'utf8' ); // eslint-disable-line no-sync

        expect( actual )
          .to.equal( expected );
      
      } catch( e ){

        throw( e );

      } finally{
        
        mockfs.restore();
        done();

      }

    } );

  } );

} );
