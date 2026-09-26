const fs = require('fs');

let content = fs.readFileSync('js/api.js', 'utf8');

// The objects might contain nested objects (like amenities array or images array) 
// so a simple regex [^}]+ might fail.
// Let's use a more robust replacement by replacing the exact objects manually 
// or using eval if we must, but it's easier to just match strings.

const lines = content.split('\n');
let newLines = [];
let inProp = false;
let propBuffer = [];
let isOwn501 = false;

for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // We start buffering when we see an object start in the array
    if (line.trim() === '{' && (lines[i+1] && lines[i+1].includes('propertyId:') || lines[i+1].includes('settlementId:'))) {
        inProp = true;
        propBuffer = [line];
        isOwn501 = false;
        continue;
    }
    
    if (inProp) {
        propBuffer.push(line);
        if (line.includes('ownerId: "OWN-501"')) {
            isOwn501 = true;
        }
        
        // If we reach the end of the object
        if (line.trim() === '},' || line.trim() === '}') {
            inProp = false;
            if (!isOwn501) {
                newLines.push(...propBuffer);
            } else {
                console.log('Removed an object for OWN-501');
            }
            propBuffer = [];
        }
    } else {
        newLines.push(line);
    }
}

fs.writeFileSync('js/api.js', newLines.join('\n'), 'utf8');
console.log('Done.');
