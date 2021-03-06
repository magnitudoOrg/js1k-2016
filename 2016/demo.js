/* 
 * Real Molecules 1kB demo by Oliver Güther 
 * Orig. for JS1k 2016 Let's get eleMental! contest
 *
 * Minified and compressed with UglifyJS and RegPack 4.
 * Code redundancy increased to compress well with RegPack.
 *
 * Generates molecules like alcohol, acid, ether, methane, ethane, ammonia, amines, alkanes, alkanols, water.
 * Subscript in formula looks best in Firefox, okay in Chrome, worst in IE 11, Edge not tested.
 * 
 * Features:
 * - Generates 30 real existing unique molecules (bonds checked H:1 O:2 N:3 C:4, double bond in f. acid for O)
 * - 2.5D Molecule with approx. real atom distances and radius ratio (H < C), angles ~real for most m.
 * - Chemical empirical formula
 * - Molecule name or group name
 * - Symbol for a characteristic property of the molecule (burnable, toxic, fishy smell... ;)
 *
 *
 * Improved after JS1k 2016 submission:
 * - removed (variable) assignments for static strings
 * - removed function used only once
 * - TODO check if merging strings will pay of
 * - TODO check a 2nd time if c.globalCompositeOperation couldn't be replaced by changing drawing order
 *
 * Thanks to JS1k organizers/contributors/participants, RegPack and UglifyJS developers!
 *
 */  
  
q = 1,  // E = [q=1,0,0,0] saves 1 B but loses variety 
// Regex for the following molecules/groups
// -> has gone inline!
//R = '^10,^20,^30,^330,^130,^3310|^1330,^310,^3+0,^3+10|^13+0,2', 
//T = 'water,ammonia,methane,ethane,methyl alcohol,alcohol,formic acid,alkane group,alkanol group,amine group,ether group',


// draw atom, then gen. next atoms, recursive
// createMolecule(atom, prevAtom, x, y, inBackground) 
C = function(j, k, l, m, n) {
    
    // draw background side chain atoms (main chain is gen. 1st, so we fix it here)
    c.globalCompositeOperation = n ? 'destination-over' : 'source-over';

    // draw atom sphere as overlaying circles with different color, leave out the part to the prev atom
    for (i = 18 - n + (j.t&&9); i--;) {        
        c.fillStyle = 'hsl(' + [j.t%2 ? 0 : 220, (j.t%3 ? 8 : 0) + '0%', (n ? 74 : (!j.t ? 139 : j.t%3 ? 80 : 55) - 60*Math.sin(i/9))  + '%)'];
        c.beginPath();
        c.arc(l, m, i, Math.PI + j.o + (j.t?.8:1.6), Math.PI + j.o + 6.3 - (j.t?.8:1.6), 0);  // not: 11 for PI/2
        c.fill();
    } 
    
    // produce up to j.t child atoms (O:2,N:3,C:4)
    // use argument n instead of i because of recursion we need a local var
    // E[1] < 2 : formic acid got an extra O atom and is done after this
    for (n = j.t + !k; E[1] < 2 && n--;) {  
        if (n > j.t - 2) { // gen. main chain 1st
        
            // generate new atom type, r*6%4 for balancing molecule distribution
            t = Math.random()*6%4|0;            
            // max one O and N in main chain else transform into C
            t && E[t] && ++t && ++t; 
            // reduce N (amines) occ. for balancing 
            h[0] && t == 2 && ++t; 
            // transform H2 into HC-..
            !t && !j.t && ++t && ++t && ++t; 
            // limit to max 4 C atoms and ensure type is valid,  h += t 
            // store main chain, [p=3]; // main chain pos
            h += t = E[p=3] > 3 ? 0 : Math.min(t,3);   
              
            // save angle for side chains (due to recursive usage)                 
            j.q = q; 
            // invert main chain angle
            q = -q; 
                 
        } else {
            // side chain defaults to H atoms
            p = t = 0; 
            // transform 2nd form of CH3OH into CH2O2 formic acid (double bond for O)
            h.match(/^310/) && ++t && n--;          
        }
        
        E[t]++; // save count per atom type
        
        e = {t: t, o: p ? q*.5 : n ? j.q*2 : j.q*1.3}; // next atom node
        
        C(e, j, l + Math.cos(e.o) * (t && k ? 36 : 18), m + Math.sin(e.o) * (t && k ? 36 : 18), !p && n); // draw next atom with children      
    }        
}


// init and render scene 
U = function(j, k, l, m, n) {   
    c.clearRect(0,0,3e3,3e3);

    E = [1,0,0,0]; // E = [q=1,0,0,0] saves 1 B but loses variety 
    h = '';
    C({t: 0, o: q*2.6}, 0, 20, 200, 0);
    
    s = '';  
    // determine empirical formula 
    // most redundant form compresses well with RegPack
    t = 3; s += E[t] ? 'C' + (E[t] > 1 ? E[t] > 9 ? String.fromCharCode(8320 + E[t]/10) + String.fromCharCode(8320 + E[t]%10) : String.fromCharCode(8320 + E[t]%10) : '')  : '';  
    t = 2; s += !E[3] && E[t]  ? 'N' + (E[t] > 1 ? E[t] > 9 ? String.fromCharCode(8320 + E[t]/10) + String.fromCharCode(8320 + E[t]%10) : String.fromCharCode(8320 + E[t]%10) : '')  : '';
    t = 0; s += E[t] ? 'H' + (E[t] > 1 ? E[t] > 9 ? String.fromCharCode(8320 + E[t]/10) + String.fromCharCode(8320 + E[t]%10) : String.fromCharCode(8320 + E[t]%10) : '')  : '';   
    t = 2; s += E[3] && E[t] ? 'N' + (E[t] > 1 ? E[t] > 9 ? String.fromCharCode(8320 + E[t]/10) + String.fromCharCode(8320 + E[t]%10) : String.fromCharCode(8320 + E[t]%10) : '')  : '';    
    t = 1; s += E[t] ? 'O' + (E[t] > 1 ? E[t] > 9 ? String.fromCharCode(8320 + E[t]/10) + String.fromCharCode(8320 + E[t]%10) : String.fromCharCode(8320 + E[t]%10) : '')  : '';   

    // determine the molecule (group) from formula pattern
    for (t = 0;!h.match('^10,^20,^30,^330,^130,^3310|^1330,^310,^3+0,^3+10|^13+0,2'.split(',')[t]) && ++t;); 
    // the following line is normally not part of the loop but saves 1 B if ; is cut after loop
    
    c.font = 'small-caps 20px s';   
    c.fillStyle = '#333'; // optional but looks cleaner
    
    // 'unicode'[t] works with 2 B but not with 4 B Unicode chars!
    // direct alternative without extra '01221432265'[t] saves 1 - 2 B, but RegPack 4.0.1 dont like it and we still have B left, no need for hand-opt. :)
    c.fillText(s + ' ' + 'water,ammonia,methane,ethane,methyl alcohol,alcohol,formic acid,alkane group,alkanol group,amine group,ether group'.split(',')[t] + ' ' + '☔,☠,🔥,⚕,🍷,☣,૮'.split(',')['01221432265'[t]], 20, 350); // manual todo: after RegPack replace ૮ by 🐬
    
    
    // Debug code for a distinct molecule
    //if (h.match(/^21330/)) clearInterval(iid);
}
//iid = setInterval(U,0) // scroll to molecule to debug


setInterval(U, 3e3) // slideshow for relaxed viewing, impatient can refresh/F5
U()

