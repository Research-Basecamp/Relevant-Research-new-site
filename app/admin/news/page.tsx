"use client";

import { useState, useEffect } from "react";
import { DataTable, Column } from "@/components/data-table";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { formatDateShort } from "@/lib/utils";

interface NewsArticle {
  id: string;
  url: string;
  title: string | null;
  author: string | null;
  domain: string | null;
  publishDate: string | null;
  isPublished: boolean;
}

export default function NewsPage() {
  const [items, setItems] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<Partial<NewsArticle> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const load = () => { setLoading(true); api.get<{ items: NewsArticle[] }>("/news/admin").then((r) => setItems(r.items)).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openNew = () => { setIsNew(true); setEditItem({ url: "", title: "", author: "", domain: "", isPublished: true }); };
  const openEdit = (item: NewsArticle) => { setIsNew(false); setEditItem({ ...item }); };

  const handleSave = async () => {
    if (!editItem) return;
    try {
      if (isNew) { await api.post("/news", editItem); toast.success("Created"); }
      else { await api.put(`/news/${editItem.id}`, editItem); toast.success("Updated"); }
      setEditItem(null); load();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleDelete = async (item: NewsArticle) => {
    if (!confirm(`Delete "${item.title || item.url}"?`)) return;
    try { await api.delete(`/news/${item.id}`); toast.success("Deleted"); load(); }
    catch (err: any) { toast.error(err.message); }
  };

  const columns: Column<NewsArticle>[] = [
    { key: "title", label: "Title", sortable: true, render: (item) => <span className="truncate block max-w-[300px]">{item.title || "-"}</span> },
    { key: "domain", label: "Source" },
    { key: "publishDate", label: "Date", sortable: true, render: (item) => item.publishDate ? formatDateShort(item.publishDate) : "-" },
    { key: "isPublished", label: "Published", render: (item) => item.isPublished ? <Badge>Yes</Badge> : <Badge variant="outline">No</Badge> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">News Articles</h1>
        <p className="text-muted-foreground">Manage news mentions and media coverage</p>
      </div>
      <DataTable columns={columns} data={items} onEdit={openEdit} onDelete={handleDelete} onCreate={openNew} createLabel="Add Article" searchKeys={["title", "domain", "author"]} loading={loading} />
      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>{isNew ? "New Article" : "Edit Article"}</DialogTitle></DialogHeader>
          {editItem && (
            <div className="space-y-4">
              <div className="space-y-2"><Label>URL</Label><Input value={editItem.url || ""} onChange={(e) => setEditItem({ ...editItem, url: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Title</Label><Input value={editItem.title || ""} onChange={(e) => setEditItem({ ...editItem, title: e.target.value })} /></div>
                <div className="space-y-2"><Label>Author</Label><Input value={editItem.author || ""} onChange={(e) => setEditItem({ ...editItem, author: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Domain / Source</Label><Input value={editItem.domain || ""} onChange={(e) => setEditItem({ ...editItem, domain: e.target.value })} /></div>
                <div className="space-y-2"><Label>Publish Date</Label><Input type="date" value={editItem.publishDate ? editItem.publishDate.split("T")[0] : ""} onChange={(e) => setEditItem({ ...editItem, publishDate: e.target.value ? new Date(e.target.value).toISOString() : null })} /></div>
              </div>
              <div className="space-y-2"><Label>Published</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={editItem.isPublished ? "true" : "false"} onChange={(e) => setEditItem({ ...editItem, isPublished: e.target.value === "true" })}>
                  <option value="true">Yes</option><option value="false">No</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditItem(null)}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
