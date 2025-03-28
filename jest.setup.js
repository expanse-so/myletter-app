// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Polyfill for ResizeObserver required by TipTap
if (typeof window !== 'undefined') {
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
  }));
}

// Global mocks for TipTap commands
jest.mock('@tiptap/react', () => ({
  useEditor: () => ({
    chain: () => ({
      focus: () => ({
        toggleBold: () => ({ run: jest.fn() }),
        toggleItalic: () => ({ run: jest.fn() }),
        toggleBulletList: () => ({ run: jest.fn() }),
        toggleOrderedList: () => ({ run: jest.fn() }),
        toggleHeading: () => ({ run: jest.fn() }),
        setLink: () => ({ run: jest.fn() }),
      }),
    }),
    isActive: jest.fn().mockReturnValue(false),
    getHTML: jest.fn().mockReturnValue('<p>Test content</p>'),
    commands: {
      setContent: jest.fn()
    }
  }),
  EditorContent: ({ editor }) => <div data-testid="editor-content">Editor Content</div>,
}));

// Mock implementations for TipTap extensions
jest.mock('@tiptap/starter-kit', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@tiptap/extension-heading', () => ({
  __esModule: true,
  default: {
    configure: jest.fn().mockReturnValue({})
  },
}));

jest.mock('@tiptap/extension-image', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@tiptap/extension-link', () => ({
  __esModule: true,
  default: {
    configure: jest.fn().mockReturnValue({})
  },
}));

jest.mock('@tiptap/extension-placeholder', () => ({
  __esModule: true,
  default: {
    configure: jest.fn().mockReturnValue({})
  },
}));

// Mock the API functionality
jest.mock('./utils/api', () => ({
  sendMessageToAI: jest.fn().mockResolvedValue({ text: 'AI response', error: null }),
}));