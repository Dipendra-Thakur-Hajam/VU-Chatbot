def chunk_text(text: str, chunk_size=500, overlap=100):
    """
    Improved chunking that respects sentence boundaries.
    Creates more semantic chunks for better retrieval.
    """
    # Split by sentences first for better semantic chunks
    sentences = text.replace('\n', ' ').split('.')
    
    chunks = []
    current_chunk = []
    current_size = 0
    
    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue
            
        sentence_words = sentence.split()
        sentence_size = len(sentence_words)
        
        # If adding this sentence exceeds chunk_size, save current chunk
        if current_size + sentence_size > chunk_size and current_chunk:
            chunk_text = '. '.join(current_chunk) + '.'
            chunks.append(chunk_text)
            
            # Keep last sentence for overlap
            overlap_count = 0
            while current_chunk and overlap_count < overlap:
                removed = current_chunk.pop()
                overlap_count += len(removed.split())
            current_size = sum(len(s.split()) for s in current_chunk)
        
        current_chunk.append(sentence)
        current_size += sentence_size
    
    # Add remaining chunk
    if current_chunk:
        chunk_text = '. '.join(current_chunk) + '.'
        chunks.append(chunk_text)
    
    return chunks
