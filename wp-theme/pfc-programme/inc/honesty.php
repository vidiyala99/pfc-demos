<?php
/**
 * PFC honesty rules. Mirrors lib/content.ts; both are tested against fixtures/honesty.json.
 */

const PFC_STRANDS  = array( 'Education', 'Health', 'Climate', 'Media' );
const PFC_KINDS    = array( 'Project', 'Documentary', 'Book', 'Campaign' );
const PFC_STATUSES = array( 'Active', 'Completed', 'Paused', 'To confirm' );

function pfc_band( $status, $since = null ) {
	switch ( $status ) {
		case 'Active':
			return array( 'style' => 'solid', 'text' => $since ? 'Active, since ' . $since : 'Active' );
		case 'Completed':
			return array( 'style' => 'archive', 'text' => 'Completed' );
		case 'Paused':
			return array( 'style' => 'pending', 'text' => 'Paused' );
		default:
			return array( 'style' => 'pending', 'text' => 'Status to confirm' );
	}
}

function pfc_placeholder_label( $kind ) {
	if ( 'Documentary' === $kind ) return 'Poster from PFC needed';
	if ( 'Book' === $kind ) return 'Cover from PFC needed';
	return 'Image from PFC needed';
}

/** Returns null when valid, or an error message naming the failing field. */
function pfc_validate_project( $p ) {
	if ( empty( $p['title'] ) ) return 'title is required';
	if ( ! in_array( $p['strand'] ?? null, PFC_STRANDS, true ) ) return 'strand must be one of ' . implode( ', ', PFC_STRANDS );
	if ( ! in_array( $p['kind'] ?? null, PFC_KINDS, true ) ) return 'kind must be one of ' . implode( ', ', PFC_KINDS );
	if ( empty( $p['place'] ) ) return 'place is required';
	if ( ! in_array( $p['status'] ?? null, PFC_STATUSES, true ) ) return 'status must be one of ' . implode( ', ', PFC_STATUSES );
	if ( ! empty( $p['image'] ) && empty( $p['image_alt'] ) ) return 'image_alt is required when an image is set';
	return null;
}

/** Resolves a featured project by slug, or a WP_Error naming "featured". */
function pfc_resolve_featured( $slug ) {
	$post = get_page_by_path( $slug, OBJECT, 'pfc_project' );
	if ( ! $post || 'publish' !== $post->post_status ) {
		return new WP_Error( 'pfc_featured', sprintf( 'home: featured points to "%s", which is not a project', $slug ) );
	}
	return $post;
}

/** Collects a project's display data from the post, its taxonomies and meta. */
function pfc_project_view( $post ) {
	$term = function ( $tax ) use ( $post ) {
		$t = get_the_terms( $post, $tax );
		return ( $t && ! is_wp_error( $t ) ) ? $t[0]->name : '';
	};
	$status = $term( 'pfc_status' );
	$kind   = $term( 'pfc_kind' );
	$since  = (int) get_post_meta( $post->ID, 'pfc_since', true );
	$image  = get_the_post_thumbnail_url( $post, 'large' );
	$alt    = $image ? get_post_meta( get_post_thumbnail_id( $post ), '_wp_attachment_image_alt', true ) : '';
	if ( ! $image ) {
		$path = get_post_meta( $post->ID, 'pfc_image', true );
		if ( $path ) {
			$image = get_theme_file_uri( 'assets' . $path );
			$alt   = get_post_meta( $post->ID, 'pfc_image_alt', true );
		}
	}
	return array(
		'slug'        => $post->post_name,
		'title'       => get_the_title( $post ),
		'url'         => get_permalink( $post ),
		'strand'      => $term( 'pfc_strand' ),
		'kind'        => $kind,
		'place'       => get_post_meta( $post->ID, 'pfc_place', true ),
		'band'        => pfc_band( $status, $since ?: null ),
		'image'       => $image,
		'image_alt'   => $alt,
		'placeholder' => pfc_placeholder_label( $kind ),
		'reviewed'    => get_post_meta( $post->ID, 'pfc_last_reviewed', true ),
		'lede'        => wp_strip_all_tags( pfc_first_paragraph( $post->post_content ) ),
	);
}

function pfc_first_paragraph( $content ) {
	if ( preg_match( '/<p>(.*?)<\/p>/s', $content, $m ) ) return $m[1];
	return '';
}
