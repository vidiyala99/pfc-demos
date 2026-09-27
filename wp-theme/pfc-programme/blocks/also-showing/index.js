( function ( wp ) {
  var el = wp.element.createElement;
  wp.blocks.registerBlockType( 'pfc/also-showing', {
    edit: function ( props ) {
      return el( 'div', wp.blockEditor.useBlockProps(), el( wp.serverSideRender, { block: 'pfc/also-showing', attributes: props.attributes } ) );
    },
    save: function () { return null; }
  } );
} )( window.wp );
