'use strict';

( ( () =>
{
	let steamdb_familyOwned;
	if( !window.GDynamicStore || !window.GDynamicStore.DecorateDynamicItems )
	{
		return;
	}

	window.HandleFamilyOwned = function SteamDB_HandleFamilyOwned()
	{
		if( !steamdb_familyOwned )
		{
			return;
		}

		if( window.location.pathname.split( '/' )[ 1 ] === 'wishlist' )
		{
			// we might need to handle bForceRecalculate, but i don't think it's ever set on the wishlist
			[ ...document.getElementsByClassName( 'wishlist_row' ) ].forEach(
				( div ) =>
				{
					if( div.getAttribute( 'data-app-id' ) && steamdb_familyOwned?.rgFamilySharedApps [ div.getAttribute( 'data-app-id' ) ] )
					{
						div.classList.add( 'ds_flagged' , 'ds_owned' );
						const element = document.createElement( 'div' );
						element.classList.add( 'steamdb_ds_family_owned_flag', 'ds_flag' );
						element.innerHTML = 'IN FAMILY&nbsp;&nbsp;';
						div.querySelector( '.capsule' ).appendChild( element );
					}
				}
			);
		}
		else
		{
		// sucks that we can't grab all elements that have a given attribute (data-app-id) (querySelectorAll gives static elements)
		// Maybe Array.from() is cleaner?
			[ ...document.getElementsByTagName( 'a' ) ].forEach(
				( link ) =>
				{
					if( link.classList.contains( 'ds_no_flags' ) || link.classList.contains( 'ds_owned' ) )
					{
						return;
					}
					// we don't need to remove anything when bForceRecalculate is true since base DecorateDynamicItems already does
					if( link.getAttribute( 'data-ds-appid' ) && steamdb_familyOwned?.rgFamilySharedApps [ link.getAttribute( 'data-ds-appid' ) ] )
					{
						link.classList.add( 'ds_flagged' , 'ds_owned' );
						const element = document.createElement( 'div' );
						element.classList.add( 'steamdb_ds_family_owned_flag', 'ds_flag' );
						element.innerHTML = 'IN FAMILY&nbsp;&nbsp;';
						link.appendChild( element );
					}
				} );
		}
	};

	const originalGDynamicStoreDecorateDynamicItems = window.GDynamicStore.DecorateDynamicItems;

	window.GDynamicStore.DecorateDynamicItems = function SteamDB_GDynamicStore_DecorateDynamicItems()
	{
		originalGDynamicStoreDecorateDynamicItems.apply( this, arguments );

		window.HandleFamilyOwned();
	};

	window.addEventListener( 'message', ( request ) =>
	{
		if( request?.data && request.data.type === 'steamdb:user-family-data-processed' )
		{
			console.log( 'Updating user family display' );
			steamdb_familyOwned = request?.data.data;
			window.HandleFamilyOwned();
		}
	} );
} )() );

