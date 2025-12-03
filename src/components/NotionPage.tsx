import { useState, useRef, useEffect } from "react";
import { FileText, Heading1, Heading2, Heading3, List, CheckSquare, Quote, Code, Image, Link, Plus, GripVertical, Trash2, Edit2, Save, X } from "lucide-react";
import useLocalStorage from "@/hooks/useLocalStorage";

export type BlockType =
  | "paragraph"
  | "heading1"
  | "heading2"
  | "heading3"
  | "bullet-list"
  | "numbered-list"
  | "todo"
  | "quote"
  | "code"
  | "divider"
  | "callout";

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: string;
  checked?: boolean; // for todo blocks
  children?: ContentBlock[]; // nested blocks
}

interface NotionPageProps {
  pageId?: string;
  title?: string;
  onSave?: (blocks: ContentBlock[]) => void;
}

const NotionPage = ({ pageId = "default", title: initialTitle, onSave }: NotionPageProps) => {
  const [blocks, setBlocks] = useLocalStorage<ContentBlock[]>(`notion-page-${pageId}`, []);
  const [title, setTitle] = useLocalStorage(`notion-title-${pageId}`, initialTitle || "Naujas puslapis");
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);

  useEffect(() => {
    if (blocks.length === 0) {
      // Add initial empty block
      addBlock("paragraph", 0);
    }
  }, []);

  const addBlock = (type: BlockType, index: number) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      content: "",
      checked: type === "todo" ? false : undefined,
    };
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    setBlocks(newBlocks);
    setEditingBlock(newBlock.id);
    setEditingContent("");
  };

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    setBlocks(blocks.map(block =>
      block.id === id ? { ...block, ...updates } : block
    ));
  };

  const deleteBlock = (id: string) => {
    if (blocks.length > 1) {
      setBlocks(blocks.filter(block => block.id !== id));
    }
  };

  const handleBlockClick = (block: ContentBlock) => {
    setEditingBlock(block.id);
    setEditingContent(block.content);
  };

  const handleSaveBlock = (id: string) => {
    updateBlock(id, { content: editingContent });
    setEditingBlock(null);
    setEditingContent("");
    if (onSave) {
      onSave(blocks);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, block: ContentBlock, index: number) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (editingBlock === block.id) {
        handleSaveBlock(block.id);
        addBlock("paragraph", index);
      }
    }
    if (e.key === "Backspace" && block.content === "" && blocks.length > 1) {
      e.preventDefault();
      deleteBlock(block.id);
      if (index > 0) {
        setEditingBlock(blocks[index - 1].id);
      }
    }
    if (e.key === "/" && editingBlock === block.id) {
      e.preventDefault();
      // Show block type menu (simplified - just add paragraph)
    }
  };

  const toggleTodo = (id: string) => {
    const block = blocks.find(b => b.id === id);
    if (block && block.type === "todo") {
      updateBlock(id, { checked: !block.checked });
    }
  };

  const getBlockIcon = (type: BlockType) => {
    switch (type) {
      case "heading1":
        return <Heading1 className="w-4 h-4" />;
      case "heading2":
        return <Heading2 className="w-4 h-4" />;
      case "heading3":
        return <Heading3 className="w-4 h-4" />;
      case "bullet-list":
        return <List className="w-4 h-4" />;
      case "numbered-list":
        return <List className="w-4 h-4" />;
      case "todo":
        return <CheckSquare className="w-4 h-4" />;
      case "quote":
        return <Quote className="w-4 h-4" />;
      case "code":
        return <Code className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getBlockStyles = (type: BlockType) => {
    switch (type) {
      case "heading1":
        return "text-2xl font-bold";
      case "heading2":
        return "text-xl font-bold";
      case "heading3":
        return "text-lg font-semibold";
      case "quote":
        return "border-l-4 border-primary/50 pl-4 italic text-muted-foreground";
      case "code":
        return "font-mono bg-secondary/50 px-2 py-1 rounded text-sm";
      default:
        return "text-base";
    }
  };

  return (
    <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-fade-in min-h-[600px]">
      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-3xl font-bold bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground mb-6"
        placeholder="Nepavadinta..."
      />

      {/* Blocks */}
      <div className="space-y-1">
        {blocks.map((block, index) => {
          const isEditing = editingBlock === block.id;
          const isHovered = hoveredBlock === block.id;

          return (
            <div
              key={block.id}
              className={`group relative flex items-start gap-2 p-2 rounded-lg transition-all ${isHovered || isEditing ? "bg-secondary/30" : "hover:bg-secondary/10"
                }`}
              onMouseEnter={() => setHoveredBlock(block.id)}
              onMouseLeave={() => setHoveredBlock(null)}
            >
              {/* Drag Handle */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1 cursor-move">
                <GripVertical className="w-4 h-4 text-muted-foreground" />
              </div>

              {/* Block Content */}
              <div className="flex-1 min-w-0">
                {block.type === "todo" ? (
                  <div className="flex items-start gap-2">
                    <button
                      onClick={() => toggleTodo(block.id)}
                      className="shrink-0 mt-0.5"
                    >
                      {block.checked ? (
                        <CheckSquare className="w-5 h-5 text-green-400" fill="currentColor" />
                      ) : (
                        <CheckSquare className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        onBlur={() => handleSaveBlock(block.id)}
                        onKeyDown={(e) => handleKeyDown(e, block, index)}
                        className={`flex-1 bg-transparent border-none outline-none ${getBlockStyles(block.type)} ${block.checked ? "line-through text-muted-foreground" : "text-foreground"
                          }`}
                        autoFocus
                      />
                    ) : (
                      <div
                        onClick={() => handleBlockClick(block)}
                        className={`flex-1 cursor-text ${getBlockStyles(block.type)} ${block.checked ? "line-through text-muted-foreground" : "text-foreground"
                          } ${!block.content ? "text-muted-foreground" : ""}`}
                      >
                        {block.content || "Užduotis..."}
                      </div>
                    )}
                  </div>
                ) : block.type === "divider" ? (
                  <div className="w-full h-px bg-white/10 my-4" />
                ) : isEditing ? (
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    onBlur={() => handleSaveBlock(block.id)}
                    onKeyDown={(e) => handleKeyDown(e, block, index)}
                    className={`w-full bg-transparent border-none outline-none resize-none ${getBlockStyles(block.type)} text-foreground`}
                    rows={block.type.includes("heading") ? 1 : 3}
                    autoFocus
                    placeholder={getPlaceholder(block.type)}
                  />
                ) : (
                  <div
                    onClick={() => handleBlockClick(block)}
                    className={`cursor-text ${getBlockStyles(block.type)} ${!block.content ? "text-muted-foreground" : "text-foreground"
                      }`}
                  >
                    {block.content || getPlaceholder(block.type)}
                  </div>
                )}
              </div>

              {/* Block Actions */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0">
                <button
                  onClick={() => deleteBlock(block.id)}
                  className="p-1 rounded hover:bg-secondary/50 transition-colors"
                  title="Ištrinti"
                >
                  <Trash2 className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Add Block Button */}
              {isHovered && (
                <div className="absolute left-8 top-full mt-1 z-10">
                  <BlockTypeMenu
                    onSelect={(type) => addBlock(type, index)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Block at End */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <BlockTypeMenu
          onSelect={(type) => addBlock(type, blocks.length - 1)}
          variant="button"
        />
      </div>
    </div>
  );
};

const getPlaceholder = (type: BlockType): string => {
  switch (type) {
    case "heading1":
      return "1 lygio antraštė";
    case "heading2":
      return "2 lygio antraštė";
    case "heading3":
      return "3 lygio antraštė";
    case "bullet-list":
      return "Sąrašo elementas";
    case "numbered-list":
      return "Numeruoto sąrašo elementas";
    case "todo":
      return "Užduotis...";
    case "quote":
      return "Citatos tekstas...";
    case "code":
      return "Kodas...";
    default:
      return "Pradėkite rašyti arba paspauskite / komandoms...";
  }
};

// Block Type Menu
const BlockTypeMenu = ({
  onSelect,
  variant = "menu"
}: {
  onSelect: (type: BlockType) => void;
  variant?: "menu" | "button";
}) => {
  const blockTypes: Array<{ type: BlockType; label: string; icon: any }> = [
    { type: "paragraph", label: "Tekstas", icon: FileText },
    { type: "heading1", label: "Antraštė 1", icon: Heading1 },
    { type: "heading2", label: "Antraštė 2", icon: Heading2 },
    { type: "heading3", label: "Antraštė 3", icon: Heading3 },
    { type: "bullet-list", label: "Sąrašas", icon: List },
    { type: "numbered-list", label: "Numeruotas sąrašas", icon: List },
    { type: "todo", label: "Užduotis", icon: CheckSquare },
    { type: "quote", label: "Citatos", icon: Quote },
    { type: "code", label: "Kodas", icon: Code },
    { type: "divider", label: "Skirtukas", icon: FileText },
  ];

  if (variant === "button") {
    return (
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 hover:bg-secondary/70 text-sm text-foreground transition-colors">
        <Plus className="w-4 h-4" />
        Pridėti bloką
      </button>
    );
  }

  return (
    <div className="glass rounded-lg border border-white/10 p-2 shadow-xl min-w-[200px]">
      <div className="text-xs text-muted-foreground mb-2 px-2">Blokų tipai</div>
      <div className="space-y-1">
        {blockTypes.map(({ type, label, icon: Icon }) => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-secondary/70 text-sm text-foreground transition-colors text-left"
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NotionPage;

