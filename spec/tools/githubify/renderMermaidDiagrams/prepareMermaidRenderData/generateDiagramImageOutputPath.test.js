import generateDiagramImageOutputPath, {
  MediaDirname,
  OutputFileTypeExtension } from '<tools>/githubify/renderMermaidDiagrams/prepareMermaidRenderData/generateDiagramImageOutputPath'; // eslint-disable-line max-len
import path from 'path';

describe( 'The <tools>/githubify/renderMermaidDiagrams/prepareMermaidRenderData/generateDiagramImageOutputPath function', ()=>{ // eslint-disable-line max-len
 
  const dirPath              =  path.join( 'path', 'to' );
  const markdownFileBaseName = 'markdownFile';
  const markdownTargetPath   = path.join( dirPath, `${ markdownFileBaseName }.md` );

  it( 'should generate an output path with the kebab-case version of the tile', ()=>{

    const title            = 'Some Title';
    const expectedBasename = 'some-title';

    const expected = path.join(
      dirPath,
      markdownFileBaseName,
      MediaDirname,
      `${ expectedBasename }${ OutputFileTypeExtension }`
    );

    expect( generateDiagramImageOutputPath( markdownTargetPath, { title } ) )
      .to.equal( expected );

  } );

  it( 'should generate an output path with the result of the uuid.v4 function, if no title is present', ()=>{

    const expectedBasename = '5be17543-b124-44cd-9dea-c9f85111b31e';

    const v4                             = sinon.spy( ()=>expectedBasename );
    const generateDiagramImageOutputPath = proxyquire(
      '<tools>/githubify/renderMermaidDiagrams/prepareMermaidRenderData/generateDiagramImageOutputPath',
      { uuid: { v4 } }
    ); 


    const expected = path.join(
      dirPath,
      markdownFileBaseName,
      MediaDirname,
      `${ expectedBasename }${ OutputFileTypeExtension }`
    );

    expect( generateDiagramImageOutputPath( markdownTargetPath, {} ) )
      .to.equal( expected );

    expect( v4 )
      .to.have.been.called; 

  } );


} );
