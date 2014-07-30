// Date: 2014-07-30
// SharpCoder
// This file does the maths for our page.
// It is highly scientific and based on university
// level kerbal physics.

OrbitalMaths = (function() {
	
	function getGravityConstant( planet ) {
		if ( planet == 0 ) return 9.81; // Kerbin
		else if ( planet == 1 ) return 1.63; // Mun
		else if ( planet == 2 ) return 1; // Minmus
	}
	
	function getRadius( planet ) {
		if ( planet == 0 ) return 600000; // Kerbin
		else if ( planet == 1 ) return 200000; // Mun
		else if ( planet == 2 ) return 60000; // Minmus
	}
	
	function getMass( size ) {
		if ( size == 0 ) return 3;
		else if ( size == 1 ) return 5;
		else if ( size == 2 ) return 8;
		else return 15;
	}
	
	function getThrust( engine ) {
		if ( engine == 0 ) return 50; // LVL-909
		else if ( engine == 1 ) return 215; // LV-T30
		else if ( engine == 2 ) return 200; // LV-T45
		else if ( engine == 3 ) return 650; // Skipper
		else if ( engine == 4 ) return 1500; // Mainsail
		else if ( engine == 5 ) return 60; // Atomic Rocket
	}
	
	function getOrbitalConstant( shape ) {
		if ( shape == 0 ) return 1.4;
		else if ( shape == 1 ) return 1.8;
		else if ( shape == 2 ) return 1;
	}
	
	function calculate( planet, size, engine, altitude, velocity ) {
		
		// Fix the numbers.
		altitude = parseFloat( altitude );
		velocity = parseFloat( velocity );
	
		// Derive our celestial variables.
		var radius = getRadius( planet );
					
		// Calculate how many seconds until we hit (without gravity).
		var eta = altitude / velocity;
		var sec = 0;
		var tAcc = altitude;
		var tVel = velocity;
		
		var m = getMass(size);
		var g = getGravityConstant(planet);
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
		Calculate: function( planet, size, engine, altitude, velocity ) {
		
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
				var result = calculate(planet, size, engine, altitude, velocity);
				alt -= velocity;
				velocity += Math.sqrt(getGravityConstant(planet));
				if ( result < alt ) best = result;
			}
			
			// Check if we're dead, jim.
			if ( result > altitude ) return -1;
			return result;
			
		}
	};
	
})();