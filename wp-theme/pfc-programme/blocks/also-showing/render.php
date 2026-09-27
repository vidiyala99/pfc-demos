<?php
$current = is_singular( 'pfc_project' ) ? get_post_field( 'post_name', get_the_ID() ) : '';
$views   = array_values( array_filter( pfc_projects( array( 'meta_key' => 'pfc_show_in_also_showing', 'meta_value' => '1' ) ), function ( $o ) use ( $current ) { return $o['slug'] !== $current; } ) );
echo '<section ' . get_block_wrapper_attributes( array( 'class' => 'section' ) ) . ' aria-label="More from the programme">' . pfc_also_showing_html( array_slice( $views, 0, 4 ), true ) . '</section>';
