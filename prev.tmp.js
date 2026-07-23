const sharp=require('sharp');
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="520" height="120" viewBox="0 0 520 120">
<rect width="520" height="120" fill="#f9f7f4"/>
<g transform="translate(24,42) scale(1.125)">
<circle cx="16" cy="16" r="15" fill="none" stroke="#c9a96a" stroke-width="1"/>
<path d="M9.5 23 16 8.6 22.5 23" fill="none" stroke="#2a241f" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.6 18.4h8.8" fill="none" stroke="#2a241f" stroke-width="1"/>
<circle cx="26.4" cy="6.6" r="2.6" fill="#c9a96a"/>
</g>
<text x="76" y="60" font-family="Georgia,serif" font-size="24" letter-spacing="3.4" fill="#2a241f">AURELIUS</text>
<text x="77" y="76" font-family="Arial" font-size="8" letter-spacing="2.7" fill="#8f7d6e">STUDIO SYSTEMS</text>
</svg>`;
sharp(Buffer.from(svg)).png().toFile(process.argv[2]).then(()=>console.log('ok'));
