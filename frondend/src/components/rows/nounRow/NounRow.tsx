import React from 'react';
import { NounWord } from '../../../types/words';
import MarkSearch from '../../../utils/MarkSearch';

interface NounRowProps {
  word: NounWord;
  searchTerm: string; 
}

const NounRow: React.FC<NounRowProps> = ({ word, searchTerm }) => {
  return (
    <>
      <td>
        <strong>
          {MarkSearch(word.article, searchTerm)}{' '} 
          {MarkSearch(word.singular, searchTerm)}
        </strong>
      </td>
      <td>{MarkSearch(word.translation, searchTerm)}</td>
      <td>{MarkSearch(word.plural, searchTerm)}</td>
      <td>Nomen</td>
    </>
  );
};

export default NounRow;