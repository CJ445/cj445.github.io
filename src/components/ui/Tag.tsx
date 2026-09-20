const Tag = ({ children }: { children: string }) => (
  <span className="rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-xs text-primary">{children}</span>
);

export const TagList = ({ tags }: { tags: string[] }) => (
  <ul className="flex flex-wrap gap-2">
    {tags.map((t) => (
      <li key={t}>
        <Tag>{t}</Tag>
      </li>
    ))}
  </ul>
);

export default Tag;
