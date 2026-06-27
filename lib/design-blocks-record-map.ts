import type { Block, Decoration, ExtendedRecordMap } from 'notion-types'

export type DesignBlockCategory =
  | 'Typography'
  | 'Lists'
  | 'Rich content'
  | 'Media'

const id = (value: number) =>
  `00000000-0000-4000-8000-${String(value).padStart(12, '0')}`

const publicUrl = (path: string) =>
  new URL(path, 'https://wustep.me').toString()

export const designBlocksRootId = id(1)
const spaceId = id(999)

const blockIds = {
  intro: id(2),
  h1: id(3),
  h2: id(4),
  h3: id(5),
  inline: id(6),
  bullet1: id(7),
  bullet2: id(8),
  bulletNested: id(9),
  number1: id(10),
  number2: id(11),
  number3: id(12),
  todo1: id(13),
  todo2: id(14),
  todo3: id(15),
  toggle: id(16),
  toggleText: id(17),
  callout: id(18),
  quote: id(19),
  divider: id(20),
  code: id(21),
  table: id(22),
  tableRow1: id(23),
  tableRow2: id(24),
  tableRow3: id(25),
  bookmark: id(26),
  equation: id(27),
  image: id(28),
  color: id(29),
  columns: id(30),
  column1: id(31),
  column2: id(32),
  columnText1: id(33),
  columnText2: id(34)
} as const

export const designBlockDefinitions: Array<{
  id: string
  label: string
  category: DesignBlockCategory
  blockIds: string[]
}> = [
  {
    id: 'paragraph',
    label: 'Paragraph + link',
    category: 'Typography',
    blockIds: [blockIds.intro]
  },
  {
    id: 'headings',
    label: 'Heading scale',
    category: 'Typography',
    blockIds: [blockIds.h1, blockIds.h2, blockIds.h3]
  },
  {
    id: 'inline',
    label: 'Inline styles',
    category: 'Typography',
    blockIds: [blockIds.inline]
  },
  {
    id: 'bulleted-list',
    label: 'Bulleted list',
    category: 'Lists',
    blockIds: [blockIds.bullet1, blockIds.bullet2]
  },
  {
    id: 'numbered-list',
    label: 'Numbered list',
    category: 'Lists',
    blockIds: [blockIds.number1, blockIds.number2, blockIds.number3]
  },
  {
    id: 'checklist',
    label: 'Checklist',
    category: 'Lists',
    blockIds: [blockIds.todo1, blockIds.todo2, blockIds.todo3]
  },
  {
    id: 'toggle',
    label: 'Toggle',
    category: 'Lists',
    blockIds: [blockIds.toggle]
  },
  {
    id: 'callout',
    label: 'Callout',
    category: 'Rich content',
    blockIds: [blockIds.callout]
  },
  {
    id: 'quote',
    label: 'Quote',
    category: 'Rich content',
    blockIds: [blockIds.quote]
  },
  {
    id: 'divider',
    label: 'Divider',
    category: 'Rich content',
    blockIds: [blockIds.divider]
  },
  {
    id: 'code',
    label: 'Code block',
    category: 'Rich content',
    blockIds: [blockIds.code]
  },
  {
    id: 'table',
    label: 'Simple table',
    category: 'Rich content',
    blockIds: [blockIds.table]
  },
  {
    id: 'bookmark',
    label: 'Bookmark',
    category: 'Rich content',
    blockIds: [blockIds.bookmark]
  },
  {
    id: 'equation',
    label: 'Equation',
    category: 'Rich content',
    blockIds: [blockIds.equation]
  },
  {
    id: 'color',
    label: 'Color + highlight',
    category: 'Rich content',
    blockIds: [blockIds.color]
  },
  {
    id: 'columns',
    label: 'Columns',
    category: 'Rich content',
    blockIds: [blockIds.columns]
  },
  {
    id: 'image',
    label: 'Image + caption',
    category: 'Media',
    blockIds: [blockIds.image]
  }
]

const now = 1_735_689_600_000

function baseBlock(
  blockId: string,
  type: string,
  parentId = designBlocksRootId
) {
  return {
    id: blockId,
    type,
    parent_id: parentId,
    parent_table: 'block',
    space_id: spaceId,
    version: 1,
    created_time: now,
    last_edited_time: now,
    alive: true,
    created_by_table: 'notion_user',
    created_by_id: id(998),
    last_edited_by_table: 'notion_user',
    last_edited_by_id: id(998)
  }
}

function title(text: string): Decoration[] {
  return [[text]]
}

const blocks: Block[] = [
  {
    ...baseBlock(designBlocksRootId, 'page', spaceId),
    parent_table: 'space',
    properties: { title: title('Block specimen') },
    format: {},
    permissions: [{ role: 'reader', type: 'public_permission' }],
    content: designBlockDefinitions.flatMap((group) => group.blockIds)
  } as Block,
  {
    ...baseBlock(blockIds.intro, 'text'),
    properties: {
      title: [
        ['A deterministic local fixture rendered by the '],
        ['same NotionRenderer', [['b']]],
        [' used for production articles. It includes a '],
        ['local link', [['a', '/design']]],
        [' and inline '],
        ['code', [['c']]],
        [' without any Notion API request.']
      ]
    }
  } as Block,
  {
    ...baseBlock(blockIds.h1, 'header'),
    properties: { title: title('Heading one') }
  } as Block,
  {
    ...baseBlock(blockIds.h2, 'sub_header'),
    properties: { title: title('Heading two') }
  } as Block,
  {
    ...baseBlock(blockIds.h3, 'sub_sub_header'),
    properties: { title: title('Heading three') }
  } as Block,
  {
    ...baseBlock(blockIds.inline, 'text'),
    properties: {
      title: [
        ['Bold', [['b']]],
        [', '],
        ['italic', [['i']]],
        [', '],
        ['strikethrough', [['s']]],
        [', '],
        ['underlined', [['_']]],
        [', and '],
        ['highlighted text', [['h', 'yellow_background']]],
        [' in one line.']
      ]
    }
  } as Block,
  {
    ...baseBlock(blockIds.bullet1, 'bulleted_list'),
    properties: { title: title('First-level unordered item') }
  } as Block,
  {
    ...baseBlock(blockIds.bullet2, 'bulleted_list'),
    properties: { title: title('A nested group') },
    content: [blockIds.bulletNested]
  } as Block,
  {
    ...baseBlock(blockIds.bulletNested, 'bulleted_list', blockIds.bullet2),
    properties: { title: title('Second-level supporting detail') }
  } as Block,
  ...(
    [
      [blockIds.number1, 'Start with the production renderer'],
      [blockIds.number2, 'Exercise realistic content'],
      [blockIds.number3, 'Promote deliberate changes into the site']
    ] as const
  ).map(
    ([blockId, text]) =>
      ({
        ...baseBlock(blockId, 'numbered_list'),
        properties: { title: title(text) }
      }) as Block
  ),
  ...(
    [
      [blockIds.todo1, 'Yes', 'Render the same production DOM'],
      [blockIds.todo2, 'Yes', 'Inherit the global site styles'],
      [blockIds.todo3, 'No', 'Review at narrow viewport width']
    ] as const
  ).map(
    ([blockId, checked, text]) =>
      ({
        ...baseBlock(blockId, 'to_do'),
        properties: { title: title(text), checked: [[checked]] }
      }) as Block
  ),
  {
    ...baseBlock(blockIds.toggle, 'toggle'),
    properties: { title: title('Why is this fixture local?') },
    content: [blockIds.toggleText]
  } as Block,
  {
    ...baseBlock(blockIds.toggleText, 'text', blockIds.toggle),
    properties: {
      title: title(
        'The record map is authored in the repository, so rendering never depends on a remote page.'
      )
    }
  } as Block,
  {
    ...baseBlock(blockIds.callout, 'callout'),
    properties: {
      title: title(
        'This uses the same callout component and site overrides as a production article.'
      )
    },
    format: { page_icon: '💡', block_color: 'blue_background' }
  } as Block,
  {
    ...baseBlock(blockIds.quote, 'quote'),
    properties: {
      title: title('Good systems make the right decisions easier to repeat.')
    }
  } as Block,
  { ...baseBlock(blockIds.divider, 'divider') } as Block,
  {
    ...baseBlock(blockIds.code, 'code'),
    properties: {
      title: title(
        'export function BlockFixture() {\n  return <article>Local content</article>\n}'
      ),
      language: title('TypeScript'),
      caption: title('Rendered by the production code block component.')
    }
  } as Block,
  {
    ...baseBlock(blockIds.table, 'table'),
    content: [blockIds.tableRow1, blockIds.tableRow2, blockIds.tableRow3],
    collection_id: id(800),
    view_ids: [],
    format: {
      collection_pointer: { id: id(800), table: 'collection', spaceId },
      table_block_column_header: true,
      table_block_row_header: false,
      table_block_column_order: ['title', 'source', 'network'],
      table_block_column_format: {
        title: { width: 180 },
        source: { width: 180 },
        network: { width: 120 }
      }
    }
  } as Block,
  {
    ...baseBlock(blockIds.tableRow1, 'table_row', blockIds.table),
    properties: {
      title: title('Surface'),
      source: title('Source'),
      network: title('Network')
    }
  } as Block,
  {
    ...baseBlock(blockIds.tableRow2, 'table_row', blockIds.table),
    properties: {
      title: title('Blocks'),
      source: title('Local record map'),
      network: title('None')
    }
  } as Block,
  {
    ...baseBlock(blockIds.tableRow3, 'table_row', blockIds.table),
    properties: {
      title: title('Articles'),
      source: title('Notion'),
      network: title('Required')
    }
  } as Block,
  {
    ...baseBlock(blockIds.bookmark, 'bookmark'),
    properties: {
      link: title(publicUrl('/design')),
      title: title('Design workbench'),
      description: title('Local tools for making site-wide design decisions.')
    },
    format: {
      bookmark_icon: publicUrl('/favicon-32x32.png'),
      bookmark_cover: ''
    }
  } as Block,
  {
    ...baseBlock(blockIds.equation, 'equation'),
    properties: { title: title('E = mc^2') }
  } as Block,
  {
    ...baseBlock(blockIds.color, 'text'),
    properties: {
      title: [
        ['Blue text', [['h', 'blue']]],
        [' beside '],
        ['a green background', [['h', 'teal_background']]],
        [' and ordinary body copy.']
      ]
    }
  } as Block,
  {
    ...baseBlock(blockIds.columns, 'column_list'),
    content: [blockIds.column1, blockIds.column2]
  } as Block,
  {
    ...baseBlock(blockIds.column1, 'column', blockIds.columns),
    content: [blockIds.columnText1],
    format: { column_ratio: 0.5 }
  } as Block,
  {
    ...baseBlock(blockIds.column2, 'column', blockIds.columns),
    content: [blockIds.columnText2],
    format: { column_ratio: 0.5 }
  } as Block,
  {
    ...baseBlock(blockIds.columnText1, 'text', blockIds.column1),
    properties: {
      title: title('Columns collapse through the real responsive CSS.')
    }
  } as Block,
  {
    ...baseBlock(blockIds.columnText2, 'text', blockIds.column2),
    properties: {
      title: title('Their spacing matches production article layouts.')
    }
  } as Block,
  {
    ...baseBlock(blockIds.image, 'image'),
    properties: {
      source: [[publicUrl('/images/prompting/magnus-carlsen-2800.png')]],
      caption: title('A real local project image with a production caption.'),
      alt_text: title('Chess position used in the Prompting project')
    },
    format: {
      block_alignment: 'center',
      block_width: 900,
      block_height: 506,
      display_source: publicUrl('/images/prompting/magnus-carlsen-2800.png'),
      block_full_width: false,
      block_page_width: true,
      block_aspect_ratio: 1.778,
      block_preserve_scale: true
    }
  } as Block
]

const blockMap = Object.fromEntries(
  blocks.map((block) => [block.id, { role: 'reader' as const, value: block }])
)

export function createDesignBlocksRecordMap(groupIds: string[]) {
  const visibleBlockIds = designBlockDefinitions
    .filter((group) => groupIds.includes(group.id))
    .flatMap((group) => group.blockIds)

  const root = blocks[0]!
  const visibleRoot = { ...root, content: visibleBlockIds }

  return {
    block: {
      ...blockMap,
      [designBlocksRootId]: { role: 'reader', value: visibleRoot }
    },
    collection: {},
    collection_view: {},
    notion_user: {},
    collection_query: {},
    signed_urls: {}
  } as ExtendedRecordMap
}
