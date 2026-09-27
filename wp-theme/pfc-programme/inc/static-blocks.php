<?php
/**
 * Page chrome and fixed sections as server-rendered blocks, so every link goes through home_url()
 * (Playground serves WordPress under a scoped path, so hard-coded "/" links would break).
 */

function pfc_masthead_block() {
	$h     = function ( $p ) { return esc_url( home_url( $p ) ); };
	$links = array( 'Our work' => '/#season', 'Films' => '/#season', 'Impact' => '/#record', 'About' => '#footer', 'Fiscal sponsorship' => '/#submissions' );
	$nav   = '';
	foreach ( $links as $label => $path ) {
		$nav .= '<a href="' . ( '#' === $path[0] ? esc_attr( $path ) : $h( $path ) ) . '">' . esc_html( $label ) . '</a>';
	}
	return '<header class="masthead"><div class="masthead__row">'
		. '<a class="masthead__logo" href="' . $h( '/' ) . '" aria-label="Partnerships For Change home"><img src="' . esc_url( get_theme_file_uri( 'assets/images/pfc-logo.png' ) ) . '" alt="Partnerships For Change" width="270" height="87"></a>'
		. '<p class="masthead__line">Stories that move real change.</p>'
		. '<nav class="nav" aria-label="Main">' . $nav . '</nav>'
		. '<details class="menu"><summary aria-label="Menu"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></summary><nav aria-label="Main menu">' . $nav . '</nav></details>'
		. pfc_ticket( 'Donate' )
		. '</div></header>';
}

function pfc_footer_block() {
	$h = function ( $p ) { return esc_url( home_url( $p ) ); };
	return '<footer class="footer" id="footer"><div class="footer__inner">'
		. '<div><p class="footer__name">Partnerships For Change®</p><address>The Presidio of San Francisco<br>1016 Lincoln Blvd., Suite 222<br>San Francisco, CA 94129<br>(415) 548-3330 [confirm as primary]</address></div>'
		. '<div><h2>Explore</h2><ul><li><a href="' . $h( '/#season' ) . '">Our work</a></li><li><a href="' . $h( '/#season' ) . '">Films</a></li><li><a href="' . $h( '/#record' ) . '">Impact</a></li><li><a href="' . $h( '/#submissions' ) . '">Fiscal sponsorship</a></li></ul></div>'
		. '<div><h2>Policies</h2><ul><li>Privacy [to write]</li><li>Accessibility [to write]</li><li>Donation disclosure [to write]</li><li>Terms [to write]</li></ul></div>'
		. '<div><h2>Programme updates</h2><p style="margin:0">Email sign-up [service to choose at no cost]</p></div>'
		. '</div><p class="footer__legal">© 2026 Partnerships For Change. A 501(c)(3) nonprofit, EIN 88-0303288, incorporated in Nevada.</p></footer>';
}

function pfc_submissions_block() {
	return '<section class="submissions" id="submissions" aria-labelledby="sub-title"><div class="submissions__inner"><div>'
		. '<h2 id="sub-title" class="display">Submissions open</h2>'
		. '<p>Issue-based films and projects can apply for fiscal sponsorship: a 501(c)(3) home for grants and donations, plus the support to get the work made and seen.</p>'
		. '<p class="fine">Fees depend on the level of support. PFC confirms terms with each project.</p>'
		. '<a class="button-line" href="https://partnershipsforchange.org/fiscal-sponsorship-application/">Apply for fiscal sponsorship ' . pfc_arrow() . '</a></div>'
		. '<ul class="offer" aria-label="What PFC provides"><li>Fiscal sponsorship</li><li>Funding networks</li><li>Financial development</li><li>Talent</li><li>Design and packaging</li><li>Distribution</li></ul>'
		. '</div></section>';
}

function pfc_record_block() {
	return '<section class="section" id="record" aria-labelledby="record-title"><div class="section__head"><div>'
		. '<h2 id="record-title" class="section__title display">The record</h2>'
		. '<p class="section__lede">Solid figures are checked against independent records. Outlined figures are PFC&#039;s own and wait for a source.</p></div></div>'
		. '<div class="record">'
		. '<div class="figure"><span class="figure__n">$1.16M</span><p class="figure__what">Revenue in fiscal year 2024</p><p class="figure__src"><strong>Verified.</strong> <a href="https://projects.propublica.org/nonprofits/organizations/880303288">IRS Form 990, via ProPublica</a></p></div>'
		. '<div class="figure"><span class="figure__n figure__n--ghost">1990</span><p class="figure__what">Year PFC began its work</p><p class="figure__src">Awaiting source</p></div>'
		. '<div class="figure"><span class="figure__n figure__n--ghost">$40M+</span><p class="figure__what">Support directed to projects</p><p class="figure__src">Awaiting source and period</p></div>'
		. '<div class="figure"><span class="figure__n figure__n--ghost">80-85%</span><p class="figure__what">Of funds to direct project work</p><p class="figure__src">PFC FAQ; awaiting Form 990 match</p></div>'
		. '</div></section>';
}

add_action( 'init', function () {
	wp_register_script( 'pfc-static-blocks', get_theme_file_uri( 'editor/static-blocks.js' ), array( 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-server-side-render' ), '0.1.0', true );
	$blocks = array(
		'masthead'    => array( 'Masthead', 'pfc_masthead_block' ),
		'footer'      => array( 'Footer', 'pfc_footer_block' ),
		'submissions' => array( 'Submissions open', 'pfc_submissions_block' ),
		'record'      => array( 'The record', 'pfc_record_block' ),
	);
	foreach ( $blocks as $slug => $def ) {
		register_block_type( 'pfc/' . $slug, array( 'title' => $def[0], 'category' => 'theme', 'editor_script' => 'pfc-static-blocks', 'render_callback' => $def[1] ) );
	}
} );
