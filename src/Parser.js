/**
 * Simply add meta data to raw data difined in data folder
 */
import WORDS from './data/words-fr.js';
import GRAPHEMES from './data/graphemes-fr.js';

/**
 * A grapheme can represent sevral phonems
 * ie : the letter "e" in french
 */
function getGraphemePhonemes(g) {
  return GRAPHEMES.multipleSoundsGraphemes[g] != null ? GRAPHEMES.multipleSoundsGraphemes[g] : [g];
}

function extractGraphemes(rawGraphemes, type) {
  return rawGraphemes.map(grapheme => {
    return {
      phonems: getGraphemePhonemes(grapheme),
      representation: grapheme,
      graphemeType: type,
    }
  });
}

export function getGraphemes(){
	return {
		vowels: extractGraphemes(GRAPHEMES.vowels.split(''), 'vowel'),
		consonants: extractGraphemes(GRAPHEMES.consonants.split(''), 'consonant'),
		complexes: extractGraphemes(GRAPHEMES.complexes, 'complex'),
	};
}

function getWordGraphemeType(description) {
  // Muted graphems ends with a '_' (ie 'e_' for graine)
  if (description.endsWith('_')) {
    return 'mute';
  } else if (description.length > 1 && !description.includes('_')) {
    return 'complex';
  }
  return GRAPHEMES.vowels.indexOf(description.charAt(0)) ? 'vowel' : 'consonant';
}

// graphems that sounds differently contains a '_'
// and the second part is the phonem
// Note that muted words don't have phonems
function getWordGraphemePhonem(description) {
  return description.split('_').pop();
}

// graphems that sounds differently contains a '_'
// and the first part is their representation
function getWordGraphemeRepresentation(description) {
  return description.split('_').shift();
}

function getWordGrapheme(description) {
  return {
    graphemeType: getWordGraphemeType(description),
    phonem: getWordGraphemePhonem(description),
    representation: getWordGraphemeRepresentation(description),
  };
}

export function getWords() {
  return WORDS.map(word => {
    return word.reduce((w, graphemeDesc) => {
      const g = getWordGrapheme(graphemeDesc);

      w.graphemes.push(g);
      //word's fileName is a concatenation off all graphemes
      w.fileName += g.representation;
      return w;
    }, {
      graphemes: [],
      fileName: '',
    });
  });
}
