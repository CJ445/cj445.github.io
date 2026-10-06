import { createContext } from 'react';

/** True while a section is rendered inside the 3D view's datasheet: the section drops its page frame. */
export const SheetContext = createContext(false);
