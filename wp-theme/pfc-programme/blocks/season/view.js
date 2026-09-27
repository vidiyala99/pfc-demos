document.querySelectorAll( '.filters' ).forEach( function ( group ) {
  var buttons = group.querySelectorAll( '.filter' );
  var entries = group.closest( 'section' ).querySelectorAll( '.entry' );
  buttons.forEach( function ( b ) {
    b.addEventListener( 'click', function () {
      buttons.forEach( function ( x ) { x.setAttribute( 'aria-pressed', String( x === b ) ); } );
      entries.forEach( function ( e ) { e.toggleAttribute( 'data-dim', b.dataset.strand !== 'all' && e.dataset.strand !== b.dataset.strand ); } );
    } );
  } );
} );
