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

interface ResearchPaper {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  downloadLink: string | null;
  authors: string[];
  year: string;
  status: string;
  abstract: string;
  keywords: string[];
  citation: string;
  isActive: boolean;
}

export default function ResearchPapersPage() {
  const [items, setItems] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<Partial<ResearchPaper> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const load = () => { setLoading(true); api.get<ResearchPaper[]>("/research-papers").then(setItems).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openNew = () => { setIsNew(true); setEditItem({ title: "", description: "", shortDescription: "", category: "", authors: [], year: "", status: "published", abstract: "", keywords: [], citation: "", isActive: true }); };
  const openEdit = (item: ResearchPaper) => { setIsNew(false); setEditItem({ ...item, authors: [...item.authors], keywords: [...item.keywords] }); };

  const handleSave = async () => {
    if (!editItem) return;
    try {
      if (isNew) { await api.post("/research-papers", editItem); toast.success("Created"); }
      else { await api.put(`/research-papers/${editItem.id}`, editItem); toast.success("Updated"); }
      setEditItem(null); load();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleDelete = async (item: ResearchPaper) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    try { await api.delete(`/research-papers/${item.id}`); toast.success("Deleted"); load(); }
    catch (err: any) { toast.error(err.message); }
  };

  const columns: Column<ResearchPaper>[] = [
    { key: "title", label: "Title", sortable: true, render: (item) => <span className="truncate block max-w-[300px]">{item.title}</span> },
    { key: "category", label: "Category" },
    { key: "year", label: "Year", sortable: true },
    { key: "status", label: "Status", render: (item) => <Badge variant="outline">{item.status}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Research Papers</h1>
        <p className="text-muted-foreground">Manage research publications</p>
      </div>
      <DataTable columns={columns} data={items} onEdit={openEdit} onDelete={handleDelete} onCreate={openNew} createLabel="Add Paper" searchKeys={["title", "category"]} loading={loading} />
      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{isNew ? "New Research Paper" : "Edit Research Paper"}</DialogTitle></DialogHeader>
          {editItem && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2"><Label>Title</Label><Input value={editItem.title || ""} onChange={(e) => setEditItem({ ...editItem, title: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Category</Label><Input value={editItem.category || ""} onChange={(e) => setEditItem({ ...editItem, category: e.target.value })} /></div>
                <div className="space-y-2"><Label>Year</Label><Input value={editItem.year || ""} onChange={(e) => setEditItem({ ...editItem, year: e.target.value })} /></div>
              </div>
              <div className="space-y-2"><Label>Short Description</Label><Textarea value={editItem.shortDescription || ""} onChange={(e) => setEditItem({ ...editItem, shortDescription: e.target.value })} rows={2} /></div>
              <div className="space-y-2"><Label>Full Description</Label><Textarea value={editItem.description || ""} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} rows={3} /></div>
              <div className="space-y-2"><Label>Abstract</Label><Textarea value={editItem.abstract || ""} onChange={(e) => setEditItem({ ...editItem, abstract: e.target.value })} rows={4} /></div>
              <div className="space-y-2"><Label>Authors (one per line)</Label><Textarea value={(editItem.authors || []).join("\n")} onChange={(e) => setEditItem({ ...editItem, authors: e.target.value.split("\n").filter(Boolean) })} rows={3} /></div>
              <div className="space-y-2"><Label>Keywords (one per line)</Label><Textarea value={(editItem.keywords || []).join("\n")} onChange={(e) => setEditItem({ ...editItem, keywords: e.target.value.split("\n").filter(Boolean) })} rows={3} /></div>
              <div className="space-y-2"><Label>Citation</Label><Textarea value={editItem.citation || ""} onChange={(e) => setEditItem({ ...editItem, citation: e.target.value })} rows={2} /></div>
              <div className="space-y-2"><Label>Download Link</Label><Input value={editItem.downloadLink || ""} onChange={(e) => setEditItem({ ...editItem, downloadLink: e.target.value })} /></div>
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
