import fs from 'fs';
import http from 'http';
import open from 'open';

const port = 3001;

const interpolate = (html, data) => {
  return html.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, placeholder) => {
    return data[placeholder] || '';
  });
};

const formatnotes = (notes) => {
  return notes.map(note => {
    return ` <div class="note">
      <p class="note-content">${note.content}</p>
      <div class="tags">
        ${note.tags.map(tag => `<span class="tag">${tag}</span>`)}
      </div>
    `;
  }).join('\n');
};

 const createServer = (notes) => {
  return http.createServer(async (req, res) => {
    const HTML_PATH = new URL('./template.html', import.meta.url).pathname;
    const template = await fs.promises.readFile(HTML_PATH, 'utf8');
    const html = interpolate(template, {
      notes: formatnotes(notes),
    });

    res.writeHead(200, { 'Content-Type': 'text/html' }).end(html);
  });
 };

 export const start = (notes, port) => {
  const server = createServer(notes);
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    open(`http://localhost:${port}`);
  });
 };
