( function ( wp ) {
  var el = wp.element.createElement;
  wp.blocks.registerBlockType( 'pfc/screening', {
    edit: function ( props ) {
      return el( 'div', wp.blockEditor.useBlockProps(), el( wp.serverSideRender, { block: 'pfc/screening', attributes: props.attributes } ) );
    },
    save: function () { return null; }
  } );
} )( window.wp );
