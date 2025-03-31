## 1. Add a processing function in `app.py`

```python
def process_excerpt_highlights(result):
    """
    Process document excerpt highlights from search results and wrap highlighted sections with HTML tags.
    """
    excerpt = result.get('DocumentExcerpt', {})
    text = excerpt.get('Text', 'No excerpt available')
    highlights = excerpt.get('Highlights', [])
    
    if not highlights:
        return text
    
    # Sort highlights by begin offset in descending order to avoid
    # position shifts when inserting HTML tags
    highlights.sort(key=lambda x: x.get('BeginOffset', 0), reverse=True)
    
    # Create a mutable list of characters from the text
    text_chars = list(text)
    
    # Insert HTML tags for each highlight
    for highlight in highlights:
        begin = highlight.get('BeginOffset', 0)
        end = highlight.get('EndOffset', 0)
        
        if 0 <= begin < end <= len(text_chars):
            # Insert end tag first, then start tag to avoid position shifts
            text_chars.insert(end, '</span>')
            text_chars.insert(begin, '<span class="highlight">')
    
    return ''.join(text_chars)
```

## 2. Update the `result_data` dictionary in your query processing section

Find this line:
```python
'excerpt': result.get('DocumentExcerpt', {}).get('Text', 'No excerpt available'),
```

Replace it with:
```python
'excerpt': process_excerpt_highlights(result),
```

## 3. Add CSS for highlighting in `style.css`

```css
.highlight {
    background-color: yellow;
    padding: 0 2px;
    font-weight: bold;
}
```

## 4. Update `index.html` to safely render HTML

Find this line in your template:
```html
<p><strong>Excerpt:</strong> {{ result.excerpt }}</p>
```

Replace it with:
```html
<p><strong>Excerpt:</strong> {{ result.excerpt|safe }}</p>
```

The `|safe` filter tells Jinja2 not to escape the HTML tags we've added for highlighting.

This implementation will process the highlighted segments that AWS Kendra identifies in the search results and display them with a yellow background, making it easier for users to spot the matching terms in the search results.