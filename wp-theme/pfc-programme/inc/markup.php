<?php
/**
 * Markup helpers. They emit the same HTML and class names as the Next.js demo, so pfc.css styles both unchanged.
 */

const PFC_DONATE_URL = 'https://partnershipsforchange.org/donate/';

function pfc_arrow() {
	return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
}

function pfc_tab( $strand, $large = false ) {
	return sprintf( '<span class="tab tab--%s%s">%s</span>', esc_attr( strtolower( $strand ?: 'media' ) ), $large ? ' tab--lg' : '', esc_html( $strand ) );
}

function pfc_band_html( $band, $large = false ) {
	$style = 'solid' === $band['style'] ? '' : ' band--' . $band['style'];
	return sprintf( '<span class="band%s%s">%s</span>', esc_attr( $style ), $large ? ' band--lg' : '', esc_html( $band['text'] ) );
}

function pfc_image_or_placeholder( $v, $extra = '' ) {
	if ( $v['image'] ) {
		return sprintf( '<img src="%s" alt="%s" %s>', esc_url( $v['image'] ), esc_attr( $v['image_alt'] ), $extra );
	}
	return '<span class="placeholder">' . esc_html( $v['placeholder'] ) . '</span>';
}

function pfc_ticket( $label, $large = false ) {
	$inner = $large ? '<span class="ticket__inner">' . esc_html( $label ) . '</span>' : esc_html( $label );
	return sprintf( '<a class="ticket%s" href="%s">%s</a>', $large ? ' ticket--lg' : '', esc_url( PFC_DONATE_URL ), $inner );
}

function pfc_also_showing_html( $views, $wide = false ) {
	$rows = '';
	foreach ( $views as $i => $v ) {
		$credit = ( 'Project' === $v['kind'] && false !== strpos( $v['place'], 'Partnership' ) ) ? '<span class="row__credit">' . esc_html( $v['place'] ) . '</span>' : '';
		$rows  .= sprintf(
			'<li><a class="row" style="--i:%d" href="%s"><span class="row__thumb">%s</span><span class="row__body"><span class="row__title display">%s</span>%s<span class="kind">%s</span>%s<span class="row__cue">See project %s</span></span></a></li>',
			$i, esc_url( $v['url'] ), pfc_image_or_placeholder( $v, 'loading="lazy"' ), esc_html( $v['title'] ), pfc_tab( $v['strand'] ), esc_html( $v['kind'] ), $credit, pfc_arrow()
		);
	}
	return sprintf(
		'<aside class="showing%s" aria-labelledby="showing-title"><h2 id="showing-title" class="showing__title display">Also showing</h2><ol>%s</ol><p class="showing__foot"><a class="button-line" href="%s">Fiscal sponsorship: submissions open %s</a></p></aside>',
		$wide ? ' showing--wide' : '', $rows, esc_url( home_url( '/#submissions' ) ), pfc_arrow()
	);
}

function pfc_projects( $args = array() ) {
	$posts = get_posts( array_merge( array( 'post_type' => 'pfc_project', 'numberposts' => -1, 'orderby' => 'name', 'order' => 'ASC' ), $args ) );
	return array_map( 'pfc_project_view', $posts );
}
