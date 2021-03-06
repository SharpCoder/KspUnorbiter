// Date: 2014-07-30
// SharpCoder
// This file does the maths for our page.
// It is highly scientific and based on university
// level kerbal physics.

OrbitalMaths = (function() {
		
	function getMass( size ) {
		if ( size == 0 ) return 3;
		else if ( size == 1 ) return 5;
		else if ( size == 2 ) return 15;
		else return 30;
	}
	
	function getThrust( engine ) {
		if ( engine == 0 ) return 50; // LVL-909
		else if ( engine == 1 ) return 215; // LV-T30
		else if ( engine == 2 ) return 200; // LV-T45
		else if ( engine == 3 ) return 650; // Skipper
		else if ( engine == 4 ) return 1500; // Mainsail
		else if ( engine == 5 ) return 60; // Atomic Rocket
	}
	
	// Code from http://www.mredkj.com/javascript/numberFormat.html#addcommas
	function addCommas(nStr)
	{
		nStr += '';
		x = nStr.split('.');
		x1 = x[0];
		x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	}
	
	function calculate( g, size, engine, altitude, velocity ) {
		
		// Fix the numbers.
		altitude = parseFloat( altitude );
		velocity = parseFloat( velocity );
					
		// Calculate how many seconds until we hit (without gravity).
		var eta = altitude / velocity;
		var sec = 0;
		var tAcc = altitude;
		var tVel = velocity;
		
		var m = getMass(size);
		var Ft = m * g;
		var a = (Ft / m) * g;
		var twr = (getThrust(engine) / (m * g));
		
		do {
			sec++;
			tAcc -= a * twr;
		} while ( tAcc > 0 && a != 0 && twr != 0);
		
		// Calculate how many seconds it takes to reach 0 velocity.
		var eta0 = Math.sqrt( sec );
		
		// Calculate how far you will travel in that time.
		var dist = 0;
		for ( var i = 0; i < eta0 && tVel > 0; i++ ) {
			dist += tVel;
			tVel -= a * twr;
		}
		
		return Math.round(dist); 
	}
	
	return {
		Calculate: function( g, size, engine, altitude, velocity ) {
		
			// Fix the numbers.
			altitude = parseFloat( altitude );
			velocity = parseFloat( velocity );
			var eta = altitude / velocity;
			var alt = altitude;
			var best = 0;
			
			// Recalculate the information at different altitudes until we find
			// the 'optimum' one. This is very scientific here.
			for ( var i = 0; i < eta; i++ ) {
				// Iterate.
				var result = calculate(g, size, engine, altitude, velocity);
				alt -= velocity;
				velocity += Math.sqrt(g);
				if ( result < alt ) best = result;
			}
			
			// Check if we're dead, jim.
			if ( result > altitude ) return -1;
			return addCommas(result);
			
		}
	};
	
})();