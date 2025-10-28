const MarkSearch = (text: string | null | undefined, searchTerm: string): React.ReactNode => {
  if (!text || !searchTerm) {
    return text || '—'; 
  }

  const lowerText = text.toLowerCase();
  const lowerSearch = searchTerm.toLowerCase();
  const index = lowerText.indexOf(lowerSearch);

  if (index === -1) {
    return text; 
  }

  const before = text.substring(0, index);
  const match = text.substring(index, index + searchTerm.length);
  const after = text.substring(index + searchTerm.length);

  return (
    <>
      {before}
      <mark>{match}</mark>
      {after}
    </>
  );
};

export default MarkSearch;