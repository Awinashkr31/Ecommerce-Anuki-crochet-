import React from 'react';
import Link from 'next/link';

interface BlogMarkdownProps {
  content: string;
}

function renderInline(text: string): (string | React.ReactElement)[] {
  // Regex to match **bold**, *italic*, and [link](url)
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return '';
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-bold text-[#221a1a]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={index} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
      const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (match) {
        const linkText = match[1];
        const href = match[2];
        const isInternal = href.startsWith('/') || href.startsWith('#');
        if (isInternal) {
          return (
            <Link
              key={index}
              href={href}
              className="text-[#9e3345] underline font-medium hover:text-[#7e2534] transition-colors"
            >
              {linkText}
            </Link>
          );
        }
        return (
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#9e3345] underline font-medium hover:text-[#7e2534] transition-colors"
          >
            {linkText}
          </a>
        );
      }
    }
    return part;
  });
}

interface Block {
  type: 'h2' | 'h3' | 'p' | 'ol' | 'ul' | 'table';
  text?: string;
  items?: string[];
  headers?: string[];
  rows?: string[][];
  isFirst?: boolean;
}

function parseMarkdown(content: string): Block[] {
  const rawLines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let isFirstParagraph = true;

  let currentParagraph: string[] = [];
  let currentList: { type: 'ol' | 'ul'; items: string[] } | null = null;
  let currentTable: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      blocks.push({
        type: 'p',
        text: currentParagraph.join(' '),
        isFirst: isFirstParagraph
      });
      isFirstParagraph = false;
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (currentList && currentList.items.length > 0) {
      blocks.push({
        type: currentList.type,
        items: currentList.items
      });
      currentList = null;
    }
  };

  const flushTable = () => {
    if (currentTable.length > 0) {
      const headerLine = currentTable[0];
      const headers = headerLine.split('|').map(c => c.trim()).filter(Boolean);
      const rowLines = currentTable.slice(1).filter(l => !/^\|[\s-:]+\|/.test(l) && l.startsWith('|'));
      const rows = rowLines.map(r => r.split('|').map(c => c.trim()).filter(Boolean));

      blocks.push({
        type: 'table',
        headers,
        rows
      });
      currentTable = [];
    }
  };

  const flushAll = () => {
    flushParagraph();
    flushList();
    flushTable();
  };

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i].trim();

    // Empty line
    if (!line) {
      flushAll();
      continue;
    }

    // Table line
    if (line.startsWith('|') && line.endsWith('|')) {
      flushParagraph();
      flushList();
      currentTable.push(line);
      continue;
    } else if (currentTable.length > 0) {
      flushTable();
    }

    // Heading 2
    if (line.startsWith('## ')) {
      flushAll();
      blocks.push({
        type: 'h2',
        text: line.replace(/^##\s+/, '')
      });
      continue;
    }

    // Heading 3
    if (line.startsWith('### ')) {
      flushAll();
      blocks.push({
        type: 'h3',
        text: line.replace(/^###\s+/, '')
      });
      continue;
    }

    // Numbered list item
    const olMatch = line.match(/^\d+\.\s+(.+)$/);
    if (olMatch) {
      flushParagraph();
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(olMatch[1]);
      continue;
    }

    // Bullet list item
    const ulMatch = line.match(/^[-*]\s+(.+)$/);
    if (ulMatch) {
      flushParagraph();
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(ulMatch[1]);
      continue;
    }

    // Normal text line
    if (currentList) {
      flushList();
    }
    currentParagraph.push(line);
  }

  flushAll();
  return blocks;
}

export default function BlogMarkdown({ content }: BlogMarkdownProps) {
  const blocks = parseMarkdown(content);

  return (
    <div className="space-y-6 text-[#564243] leading-relaxed">
      {blocks.map((block, idx) => {
        if (block.type === 'h2') {
          return (
            <h2 key={idx} className="text-2xl md:text-3xl font-serif font-bold text-[#221a1a] pt-6 pb-1">
              {renderInline(block.text || '')}
            </h2>
          );
        }

        if (block.type === 'h3') {
          return (
            <h3 key={idx} className="text-xl md:text-2xl font-serif font-bold text-[#221a1a] pt-4 pb-1">
              {renderInline(block.text || '')}
            </h3>
          );
        }

        if (block.type === 'ol') {
          return (
            <ol key={idx} className="list-decimal list-outside ml-6 space-y-2.5 my-5 text-[#564243]">
              {block.items?.map((item, itemIdx) => (
                <li key={itemIdx} className="leading-relaxed">
                  {renderInline(item)}
                </li>
              ))}
            </ol>
          );
        }

        if (block.type === 'ul') {
          return (
            <ul key={idx} className="list-disc list-outside ml-6 space-y-2.5 my-5 text-[#564243]">
              {block.items?.map((item, itemIdx) => (
                <li key={itemIdx} className="leading-relaxed">
                  {renderInline(item)}
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === 'table') {
          return (
            <div key={idx} className="overflow-x-auto my-8 rounded-2xl border border-[#EFE5DE] shadow-sm">
              <table className="min-w-full text-left text-sm divide-y divide-[#EFE5DE]">
                <thead className="bg-[#FBF8F5]">
                  <tr>
                    {block.headers?.map((header, hIdx) => (
                      <th key={hIdx} className="px-5 py-3.5 font-serif font-bold text-[#221a1a]">
                        {renderInline(header)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE5DE] bg-white">
                  {block.rows?.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-[#FAF6F3] transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-5 py-3.5 text-[#564243] align-top">
                          {renderInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        // Paragraph
        const isFirst = block.isFirst;
        return (
          <p
            key={idx}
            className={`text-lg leading-relaxed text-[#564243] ${
              isFirst
                ? 'first-letter:float-left first-letter:text-6xl first-letter:pr-2 first-letter:font-serif first-letter:text-[#be4b5c] first-letter:mt-1'
                : ''
            }`}
          >
            {renderInline(block.text || '')}
          </p>
        );
      })}
    </div>
  );
}
