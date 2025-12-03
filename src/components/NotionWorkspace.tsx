import { useState } from "react";
import { FileText, Plus, Folder, Search, Star, Clock, Trash2, Edit2, MoreVertical } from "lucide-react";
import useLocalStorage from "@/hooks/useLocalStorage";
import NotionPage, { ContentBlock } from "./NotionPage";
import { format } from "date-fns";
import { lt } from "date-fns/locale";

export interface NotionPageData {
  id: string;
  title: string;
  blocks: ContentBlock[];
  createdAt: string;
  updatedAt: string;
  icon?: string;
  favorite?: boolean;
  folder?: string;
}

interface NotionWorkspaceProps {
  subject?: string;
}

const NotionWorkspace = ({ subject }: NotionWorkspaceProps) => {
  const [pages, setPages] = useLocalStorage<NotionPageData[]>("notion-pages", []);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [showNewPage, setShowNewPage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.blocks.some(block => block.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const currentPage = pages.find(p => p.id === selectedPage);

  const handleCreatePage = (title: string = "Naujas puslapis") => {
    const newPage: NotionPageData = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title,
      blocks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      favorite: false,
    };
    setPages([newPage, ...pages]);
    setSelectedPage(newPage.id);
    setShowNewPage(false);
  };

  const handleUpdatePage = (id: string, blocks: ContentBlock[]) => {
    setPages(pages.map(page =>
      page.id === id
        ? { ...page, blocks, updatedAt: new Date().toISOString() }
        : page
    ));
  };

  const handleDeletePage = (id: string) => {
    setPages(pages.filter(p => p.id !== id));
    if (selectedPage === id) {
      setSelectedPage(null);
    }
  };

  const handleToggleFavorite = (id: string) => {
    setPages(pages.map(page =>
      page.id === id ? { ...page, favorite: !page.favorite } : page
    ));
  };

  const handleRenamePage = (id: string, newTitle: string) => {
    setPages(pages.map(page =>
      page.id === id ? { ...page, title: newTitle } : page
    ));
  };

  // Group pages
  const favoritePages = filteredPages.filter(p => p.favorite);
  const recentPages = filteredPages
    .filter(p => !p.favorite)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);
  const otherPages = filteredPages.filter(p => !p.favorite && !recentPages.includes(p));

  if (selectedPage && currentPage) {
    return (
      <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-fade-in min-h-[600px]">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setSelectedPage(null)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Grįžti
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleToggleFavorite(currentPage.id)}
              className={`p-2 rounded-lg transition-colors ${
                currentPage.favorite
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary/70"
              }`}
            >
              <Star className={`w-4 h-4 ${currentPage.favorite ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={() => handleDeletePage(currentPage.id)}
              className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:bg-red-500/20 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Page Content */}
        <NotionPage
          pageId={currentPage.id}
          title={currentPage.title}
          onSave={(blocks) => handleUpdatePage(currentPage.id, blocks)}
        />
      </div>
    );
  }

  return (
    <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl gradient-indigo-purple flex items-center justify-center shadow-lg shadow-purple-500/30">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-foreground">Mano užrašai</h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              {subject ? `${subject} užrašai` : "Visų dalykų užrašai"}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowNewPage(true)}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl gradient-indigo-purple flex items-center justify-center hover:opacity-90 transition-all shadow-lg hover:scale-110"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ieškoti užrašų..."
            className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-white/10 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
        </div>
      </div>

      {/* Pages List */}
      <div className="space-y-4">
        {/* Favorite Pages */}
        {favoritePages.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              Mėgstamiausi
            </h4>
            <div className="space-y-1">
              {favoritePages.map((page) => (
                <PageItem
                  key={page.id}
                  page={page}
                  onClick={() => setSelectedPage(page.id)}
                  onDelete={() => handleDeletePage(page.id)}
                  onRename={(title) => handleRenamePage(page.id, title)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recent Pages */}
        {recentPages.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <Clock className="w-3 h-3" />
              Paskutiniai
            </h4>
            <div className="space-y-1">
              {recentPages.map((page) => (
                <PageItem
                  key={page.id}
                  page={page}
                  onClick={() => setSelectedPage(page.id)}
                  onDelete={() => handleDeletePage(page.id)}
                  onRename={(title) => handleRenamePage(page.id, title)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Other Pages */}
        {otherPages.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Kiti puslapiai</h4>
            <div className="space-y-1">
              {otherPages.map((page) => (
                <PageItem
                  key={page.id}
                  page={page}
                  onClick={() => setSelectedPage(page.id)}
                  onDelete={() => handleDeletePage(page.id)}
                  onRename={(title) => handleRenamePage(page.id, title)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredPages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {searchQuery ? "Užrašų nerasta" : "Nėra užrašų"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowNewPage(true)}
                className="text-xs text-primary hover:text-primary/80 transition-colors"
              >
                Sukurti pirmą užrašą
              </button>
            )}
          </div>
        )}
      </div>

      {/* New Page Modal */}
      {showNewPage && (
        <NewPageModal
          onCreate={handleCreatePage}
          onClose={() => setShowNewPage(false)}
        />
      )}
    </div>
  );
};

// Page Item Component
const PageItem = ({
  page,
  onClick,
  onDelete,
  onRename,
}: {
  page: NotionPageData;
  onClick: () => void;
  onDelete: () => void;
  onRename: (title: string) => void;
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(page.title);
  const [showMenu, setShowMenu] = useState(false);

  const handleRename = () => {
    if (newTitle.trim()) {
      onRename(newTitle.trim());
    } else {
      setNewTitle(page.title);
    }
    setIsRenaming(false);
  };

  const preview = page.blocks.find(b => b.content)?.content || "Tuščias puslapis...";
  const previewText = preview.length > 60 ? preview.substring(0, 60) + "..." : preview;

  return (
    <div
      className="group p-3 rounded-lg bg-secondary/30 border border-white/10 hover:bg-secondary/50 hover:border-primary/30 transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {isRenaming ? (
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
                if (e.key === "Escape") {
                  setNewTitle(page.title);
                  setIsRenaming(false);
                }
              }}
              className="w-full bg-secondary/50 border border-primary/50 rounded px-2 py-1 text-sm text-foreground focus:outline-none"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <>
              <h4 className="text-sm font-semibold text-foreground mb-1 line-clamp-1">
                {page.title}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {previewText}
              </p>
              <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                <span>
                  {format(new Date(page.updatedAt), "d MMM yyyy", { locale: lt })}
                </span>
                <span>•</span>
                <span>{page.blocks.length} {page.blocks.length === 1 ? "blokas" : "blokai"}</span>
              </div>
            </>
          )}
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 rounded hover:bg-secondary/50 transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 z-10 glass rounded-lg border border-white/10 p-1 shadow-xl min-w-[120px]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRenaming(true);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-secondary/70 text-xs text-foreground transition-colors text-left"
              >
                <Edit2 className="w-3 h-3" />
                Pervardyti
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-red-500/20 text-xs text-red-400 transition-colors text-left"
              >
                <Trash2 className="w-3 h-3" />
                Ištrinti
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// New Page Modal
const NewPageModal = ({
  onCreate,
  onClose,
}: {
  onCreate: (title: string) => void;
  onClose: () => void;
}) => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(title || "Naujas puslapis");
    setTitle("");
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="glass rounded-2xl p-6 w-full max-w-md border-2 border-primary/30 animate-scale-in" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-lg font-semibold text-foreground mb-4">Sukurti naują puslapį</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Pavadinimas</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-secondary/50 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50"
                placeholder="Pvz: Matematikos užrašai"
                autoFocus
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 rounded-lg gradient-indigo-purple text-white font-medium hover:opacity-90 transition-all"
              >
                Sukurti
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-secondary/50 text-foreground hover:bg-secondary/70 transition-colors"
              >
                Atšaukti
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default NotionWorkspace;

