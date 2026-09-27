<?php
/**
 * PFC Programme theme. No plugins, no build step.
 */

require_once __DIR__ . '/inc/honesty.php';
require_once __DIR__ . '/inc/markup.php';
require_once __DIR__ . '/inc/static-blocks.php';

add_action( 'after_setup_theme', function () {
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'editor-styles' );
	add_editor_style( array( 'assets/pfc.css' ) );
} );

add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_style( 'pfc', get_theme_file_uri( 'assets/pfc.css' ), array(), wp_get_theme()->get( 'Version' ) );
	// Front end only, so the editor canvas never animates while someone is editing.
	wp_enqueue_script( 'pfc-motion', get_theme_file_uri( 'assets/motion.js' ), array(), wp_get_theme()->get( 'Version' ), array( 'strategy' => 'defer' ) );
} );

add_action( 'init', function () {
	register_post_type( 'pfc_project', array(
		'labels'       => array( 'name' => 'Projects', 'singular_name' => 'Project', 'add_new_item' => 'Add new project', 'edit_item' => 'Edit project' ),
		'public'       => true,
		'show_in_rest' => true,
		'menu_icon'    => 'dashicons-video-alt2',
		'menu_position'=> 5,
		'has_archive'  => false,
		'rewrite'      => array( 'slug' => 'work' ),
		'supports'     => array( 'title', 'editor', 'thumbnail', 'custom-fields' ),
	) );

	$taxonomies = array(
		'pfc_strand' => array( 'Strand', PFC_STRANDS ),
		'pfc_kind'   => array( 'Kind', PFC_KINDS ),
		'pfc_status' => array( 'Status', PFC_STATUSES ),
	);
	foreach ( $taxonomies as $tax => $def ) {
		register_taxonomy( $tax, 'pfc_project', array(
			'label'             => $def[0],
			'hierarchical'      => true, // checkbox UI in the editor sidebar
			'show_in_rest'      => true,
			'show_admin_column' => true,
			'rewrite'           => false,
			// Editors pick from the fixed list; they cannot invent "Current!" as a status.
			'capabilities'      => array( 'manage_terms' => 'manage_options', 'edit_terms' => 'manage_options', 'delete_terms' => 'manage_options', 'assign_terms' => 'edit_posts' ),
		) );
		foreach ( $def[1] as $name ) {
			if ( ! term_exists( $name, $tax ) ) wp_insert_term( $name, $tax );
		}
	}

	$meta = array(
		'pfc_place'                => 'string',
		'pfc_since'                => 'integer',
		'pfc_image'                => 'string',
		'pfc_image_alt'            => 'string',
		'pfc_show_in_also_showing' => 'boolean',
		'pfc_last_reviewed'        => 'string',
	);
	foreach ( $meta as $key => $type ) {
		register_post_meta( 'pfc_project', $key, array( 'type' => $type, 'single' => true, 'show_in_rest' => true, 'auth_callback' => function () { return current_user_can( 'edit_posts' ); } ) );
	}

	foreach ( array( 'featured', 'also-showing', 'season', 'screening' ) as $block ) {
		register_block_type( __DIR__ . '/blocks/' . $block );
	}
} );

add_action( 'enqueue_block_editor_assets', function () {
	wp_enqueue_script( 'pfc-project-panel', get_theme_file_uri( 'editor/project-panel.js' ), array( 'wp-plugins', 'wp-editor', 'wp-element', 'wp-components', 'wp-data', 'wp-core-data' ), wp_get_theme()->get( 'Version' ), true );
} );

function pfc_demo_notice() {
	echo '<div class="notice notice-info" style="border-left-color:#0b1a3e"><p><strong>Demo WordPress:</strong> this runs entirely in your browser. Nothing you change here is public, and nothing reaches PFC&#8217;s real website.</p></div>';
}
add_action( 'admin_notices', 'pfc_demo_notice' );
