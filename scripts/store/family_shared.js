'use strict';

GetOption( { 'steamdb-family-shared': true }, ( items ) =>
{
	if( !items[ 'steamdb-family-shared' ] )
	{
		return;
	}

	const element = document.createElement( 'script' );
	element.id = 'steamdb_family_shared';
	element.type = 'text/javascript';
	element.src = GetLocalResource( 'scripts/store/family_shared_injected.js' );

	document.head.appendChild( element );
} );
